"""NekteServer — NEKTE protocol server.

Register capabilities, handle discovery/invocation/delegation.
"""

from __future__ import annotations

import time
from collections.abc import Awaitable, Callable
from typing import Any

from nekte.domain.budget import estimate_tokens, resolve_budget
from nekte.domain.errors import NEKTE_ERRORS
from nekte.domain.hash import compute_version_hash
from nekte.domain.types import (
    AgentCard,
    DetailLevel,
    MultiLevelResult,
    NekteError,
    NekteRequest,
    NekteResponse,
    TokenBudget,
)

NEKTE_VERSION = "0.3.0"


# ---------------------------------------------------------------------------
# Capability types
# ---------------------------------------------------------------------------


class RegisteredCapability:
    """A registered capability with schema and handler."""

    __slots__ = ("id", "category", "description", "input_schema", "output_schema",
                 "handler", "version_hash", "cost", "to_minimal", "to_compact")

    def __init__(
        self,
        *,
        id: str,
        category: str,
        description: str,
        input_schema: dict[str, Any],
        output_schema: dict[str, Any],
        handler: Callable[..., Any],
        cost: dict[str, Any] | None = None,
        to_minimal: Callable[[Any], str] | None = None,
        to_compact: Callable[[Any], dict[str, Any]] | None = None,
    ) -> None:
        self.id = id
        self.category = category
        self.description = description
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.handler = handler
        self.version_hash = compute_version_hash(input_schema, output_schema)
        self.cost = cost
        self.to_minimal = to_minimal
        self.to_compact = to_compact


# ---------------------------------------------------------------------------
# NekteServer
# ---------------------------------------------------------------------------


class NekteServer:
    """NEKTE protocol server with capability registration and request handling."""

    def __init__(
        self,
        agent: str,
        *,
        version: str | None = None,
    ) -> None:
        self.agent = agent
        self.version = version
        self._capabilities: dict[str, RegisteredCapability] = {}

    def capability(
        self,
        id: str,
        *,
        category: str,
        description: str,
        input_schema: dict[str, Any],
        output_schema: dict[str, Any],
        handler: Callable[..., Awaitable[Any] | Any],
        cost: dict[str, Any] | None = None,
        to_minimal: Callable[[Any], str] | None = None,
        to_compact: Callable[[Any], dict[str, Any]] | None = None,
    ) -> NekteServer:
        """Register a capability."""
        self._capabilities[id] = RegisteredCapability(
            id=id,
            category=category,
            description=description,
            input_schema=input_schema,
            output_schema=output_schema,
            handler=handler,
            cost=cost,
            to_minimal=to_minimal,
            to_compact=to_compact,
        )
        return self

    def agent_card(self, endpoint: str) -> AgentCard:
        """Generate the Agent Card for this server."""
        return AgentCard(
            nekte=NEKTE_VERSION,
            agent=self.agent,
            endpoint=endpoint,
            caps=list(self._capabilities.keys()),
            auth="none",
            budget_support=True,
        )

    async def handle_request(self, request: dict[str, Any]) -> dict[str, Any]:
        """Handle a raw JSON-RPC request dict and return a response dict."""
        req_id = request.get("id", 0)
        method = request.get("method", "")
        params = request.get("params", {})

        try:
            if method == "nekte.discover":
                result = self._handle_discover(params)
            elif method == "nekte.invoke":
                result = await self._handle_invoke(params)
            else:
                return self._error_response(req_id, -32601, f"Method not found: {method}")

            return {"jsonrpc": "2.0", "id": req_id, "result": result}
        except _ProtocolError as exc:
            return self._error_response(req_id, exc.code, str(exc), exc.data)
        except Exception as exc:
            return self._error_response(req_id, -32000, str(exc))

    def _handle_discover(self, params: dict[str, Any]) -> dict[str, Any]:
        """Handle nekte.discover."""
        level: int = params.get("level", 0)
        filter_opts = params.get("filter") or {}

        caps = list(self._capabilities.values())

        # Apply basic filtering
        if "id" in filter_opts:
            caps = [c for c in caps if c.id == filter_opts["id"]]
        if "category" in filter_opts:
            caps = [c for c in caps if c.category == filter_opts["category"]]
        if "query" in filter_opts:
            q = filter_opts["query"].lower()
            caps = [c for c in caps if q in c.id.lower() or q in c.description.lower()]

        projected: list[dict[str, Any]] = []
        for cap in caps:
            entry: dict[str, Any] = {"id": cap.id, "cat": cap.category, "h": cap.version_hash}
            if level >= 1:
                entry["desc"] = cap.description
                if cap.cost:
                    entry["cost"] = cap.cost
            if level >= 2:
                entry["input"] = cap.input_schema
                entry["output"] = cap.output_schema
            projected.append(entry)

        return {
            "agent": self.agent,
            "v": self.version,
            "caps": projected,
        }

    async def _handle_invoke(self, params: dict[str, Any]) -> dict[str, Any]:
        """Handle nekte.invoke."""
        cap_id = params.get("cap", "")
        cap = self._capabilities.get(cap_id)

        if cap is None:
            raise _ProtocolError(NEKTE_ERRORS["CAPABILITY_NOT_FOUND"], f"Capability not found: {cap_id}")

        # Verify hash if provided
        h = params.get("h")
        if h and h != cap.version_hash:
            raise _ProtocolError(
                NEKTE_ERRORS["VERSION_MISMATCH"],
                "Version mismatch",
                {"current_hash": cap.version_hash, "schema": {"id": cap.id, "h": cap.version_hash}},
            )

        input_data = params.get("in", {})
        budget_data = params.get("budget")
        budget = TokenBudget.model_validate(budget_data) if budget_data else None

        # Execute handler
        start = time.monotonic()
        import asyncio
        result = cap.handler(input_data)
        if asyncio.iscoroutine(result):
            result = await result
        ms = round((time.monotonic() - start) * 1000)

        # Build multi-level result
        full = result if isinstance(result, dict) else {"value": result}
        minimal = cap.to_minimal(result) if cap.to_minimal else None
        compact = cap.to_compact(result) if cap.to_compact else full

        mlr = MultiLevelResult(minimal=minimal, compact=compact, full={**full, "_meta": {"ms": ms}})

        # Resolve budget
        data, level = resolve_budget(mlr, budget)

        return {
            "out": mlr.model_dump(exclude_none=True),
            "resolved_level": level,
            "meta": {"ms": ms},
        }

    @staticmethod
    def _error_response(req_id: Any, code: int, message: str, data: Any = None) -> dict[str, Any]:
        error: dict[str, Any] = {"code": code, "message": message}
        if data is not None:
            error["data"] = data
        return {"jsonrpc": "2.0", "id": req_id, "error": error}


class _ProtocolError(Exception):
    """Internal error with protocol error code."""

    def __init__(self, code: int, message: str, data: Any = None) -> None:
        super().__init__(message)
        self.code = code
        self.data = data
