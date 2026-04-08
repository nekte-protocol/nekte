"""NekteClient — NEKTE protocol client.

Progressive discovery, zero-schema invocation, token budget propagation,
task lifecycle management, and pluggable transport.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any

from nekte.adapters.http_transport import HttpTransport
from nekte.domain.budget import create_budget
from nekte.domain.errors import NEKTE_ERRORS, NekteProtocolError
from nekte.domain.types import (
    AgentCard,
    DiscoveryLevel,
    DiscoverResult,
    InvokeResult,
    NekteMethod,
    NekteResponse,
    SseEvent,
    TokenBudget,
)

WELL_KNOWN_PATH = "/.well-known/nekte.json"


class NekteClient:
    """NEKTE protocol client with progressive discovery and zero-schema invocation."""

    def __init__(
        self,
        endpoint: str,
        *,
        headers: dict[str, str] | None = None,
        timeout_s: float = 30.0,
        default_budget: TokenBudget | None = None,
        transport: HttpTransport | None = None,
    ) -> None:
        self.endpoint = endpoint.rstrip("/")
        self._default_budget = default_budget
        self._agent_id: str | None = None
        self._hash_cache: dict[str, str] = {}  # cap_id -> version_hash

        self._transport = transport or HttpTransport(
            self.endpoint,
            headers=headers,
            timeout_s=timeout_s,
        )

    # ------------------------------------------------------------------
    # Agent Card
    # ------------------------------------------------------------------

    async def agent_card(self) -> AgentCard:
        """Fetch the agent card from the well-known endpoint."""
        data = await self._transport.get(f"{self.endpoint}{WELL_KNOWN_PATH}")
        card = AgentCard.model_validate(data)
        self._agent_id = card.agent
        return card

    # ------------------------------------------------------------------
    # Discovery
    # ------------------------------------------------------------------

    async def discover(
        self,
        level: DiscoveryLevel = 0,
        *,
        filter_query: str | None = None,
        filter_category: str | None = None,
        filter_id: str | None = None,
        top_k: int | None = None,
        threshold: float | None = None,
    ) -> DiscoverResult:
        """Progressive capability discovery."""
        filter_param: dict[str, Any] | None = None
        if any(v is not None for v in (filter_query, filter_category, filter_id, top_k, threshold)):
            filter_param = {}
            if filter_query is not None:
                filter_param["query"] = filter_query
            if filter_category is not None:
                filter_param["category"] = filter_category
            if filter_id is not None:
                filter_param["id"] = filter_id
            if top_k is not None:
                filter_param["top_k"] = top_k
            if threshold is not None:
                filter_param["threshold"] = threshold

        result = await self._rpc("nekte.discover", {"level": level, "filter": filter_param})

        # Cache version hashes from discovered capabilities
        for cap in result.get("caps", []):
            if "h" in cap:
                self._hash_cache[cap["id"]] = cap["h"]

        if not self._agent_id and "agent" in result:
            self._agent_id = result["agent"]

        return DiscoverResult.model_validate(result)

    async def catalog(self) -> DiscoverResult:
        """L0 discovery — compact catalog."""
        return await self.discover(0)

    async def describe(self, cap_id: str) -> DiscoverResult:
        """L1 discovery — summary for a specific capability."""
        return await self.discover(1, filter_id=cap_id)

    async def schema(self, cap_id: str) -> DiscoverResult:
        """L2 discovery — full schema for a specific capability."""
        return await self.discover(2, filter_id=cap_id)

    # ------------------------------------------------------------------
    # Invoke
    # ------------------------------------------------------------------

    async def invoke(
        self,
        cap_id: str,
        input_data: dict[str, Any],
        *,
        budget: TokenBudget | None = None,
    ) -> InvokeResult:
        """Invoke a capability with zero-schema optimization."""
        effective_budget = budget or self._default_budget or create_budget()
        cached_hash = self._hash_cache.get(cap_id)

        params: dict[str, Any] = {
            "cap": cap_id,
            "in": input_data,
            "budget": effective_budget.model_dump(),
        }
        if cached_hash:
            params["h"] = cached_hash

        try:
            result = await self._rpc("nekte.invoke", params)
            return InvokeResult.model_validate(result)
        except NekteProtocolError as err:
            if err.is_version_mismatch and isinstance(err.data, dict):
                # Update cache with new schema hash
                schema = err.data.get("schema")
                if isinstance(schema, dict) and "h" in schema:
                    self._hash_cache[cap_id] = schema["h"]
                # Retry without hash
                params.pop("h", None)
                result = await self._rpc("nekte.invoke", params)
                return InvokeResult.model_validate(result)
            raise

    # ------------------------------------------------------------------
    # Delegate (streaming)
    # ------------------------------------------------------------------

    async def delegate_stream(
        self,
        task_id: str,
        desc: str,
        *,
        budget: TokenBudget | None = None,
        timeout_ms: int = 30000,
        context: dict[str, Any] | None = None,
    ) -> AsyncIterator[SseEvent]:
        """Delegate a task and stream SSE events."""
        effective_budget = budget or self._default_budget or create_budget()
        params: dict[str, Any] = {
            "task": {
                "id": task_id,
                "desc": desc,
                "timeout_ms": timeout_ms,
                "budget": effective_budget.model_dump(),
            },
        }
        if context:
            params["context"] = context

        async for event in self._transport.stream("nekte.delegate", params):
            yield event

    # ------------------------------------------------------------------
    # Task Lifecycle
    # ------------------------------------------------------------------

    async def cancel_task(self, task_id: str, reason: str | None = None) -> dict[str, Any]:
        """Cancel a running or suspended task."""
        params: dict[str, Any] = {"task_id": task_id}
        if reason:
            params["reason"] = reason
        return await self._rpc("nekte.task.cancel", params)

    async def resume_task(
        self, task_id: str, budget: TokenBudget | None = None
    ) -> dict[str, Any]:
        """Resume a suspended task."""
        params: dict[str, Any] = {"task_id": task_id}
        if budget:
            params["budget"] = budget.model_dump()
        return await self._rpc("nekte.task.resume", params)

    async def task_status(self, task_id: str) -> dict[str, Any]:
        """Query current task state."""
        return await self._rpc("nekte.task.status", {"task_id": task_id})

    # ------------------------------------------------------------------
    # Verify
    # ------------------------------------------------------------------

    async def verify(
        self,
        task_id: str,
        checks: list[str] | None = None,
        budget: TokenBudget | None = None,
    ) -> dict[str, Any]:
        """Verify result integrity."""
        params: dict[str, Any] = {
            "task_id": task_id,
            "checks": checks or ["hash", "sample", "source"],
        }
        if budget:
            params["budget"] = budget.model_dump()
        return await self._rpc("nekte.verify", params)

    # ------------------------------------------------------------------
    # Transport
    # ------------------------------------------------------------------

    async def _rpc(self, method: NekteMethod, params: dict[str, Any]) -> dict[str, Any]:
        """Send an RPC and handle errors."""
        response = await self._transport.request(method, params)

        if response.error is not None:
            raise NekteProtocolError(
                response.error.code,
                response.error.message,
                response.error.data,
            )

        return response.result if isinstance(response.result, dict) else {}

    async def close(self) -> None:
        """Close the transport."""
        await self._transport.close()

    async def __aenter__(self) -> NekteClient:
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()
