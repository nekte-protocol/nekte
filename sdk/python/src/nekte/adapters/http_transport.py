"""HTTP Transport Adapter — default transport using httpx.

Handles JSON-RPC over HTTP POST and SSE streaming for delegate.
"""

from __future__ import annotations

import json
from collections.abc import AsyncIterator
from typing import Any

import httpx

from nekte.domain.sse import SseEvent, parse_sse_event
from nekte.domain.types import NekteMethod, NekteResponse


class HttpTransport:
    """HTTP transport adapter implementing the Transport port."""

    def __init__(
        self,
        endpoint: str,
        *,
        headers: dict[str, str] | None = None,
        timeout_s: float = 30.0,
    ) -> None:
        self._endpoint = endpoint.rstrip("/")
        self._headers = headers or {}
        self._timeout_s = timeout_s
        self._request_id = 0
        self._client = httpx.AsyncClient(
            headers={"Content-Type": "application/json", **self._headers},
            timeout=httpx.Timeout(timeout_s),
        )

    async def request(self, method: NekteMethod, params: Any) -> NekteResponse:
        """Send a JSON-RPC request and return the parsed response."""
        self._request_id += 1
        body = {
            "jsonrpc": "2.0",
            "method": method,
            "id": self._request_id,
            "params": params if isinstance(params, dict) else {},
        }

        response = await self._client.post(self._endpoint, json=body)
        response.raise_for_status()
        data = response.json()
        return NekteResponse.model_validate(data)

    async def get(self, url: str) -> dict[str, Any]:
        """Perform a plain GET request (e.g., Agent Card)."""
        response = await self._client.get(url, headers=self._headers)
        response.raise_for_status()
        return response.json()  # type: ignore[no-any-return]

    async def stream(
        self, method: NekteMethod, params: Any
    ) -> AsyncIterator[SseEvent]:
        """Send a request and yield SSE events."""
        self._request_id += 1
        body = {
            "jsonrpc": "2.0",
            "method": method,
            "id": self._request_id,
            "params": params if isinstance(params, dict) else {},
        }

        async with self._client.stream(
            "POST",
            self._endpoint,
            json=body,
            timeout=httpx.Timeout(self._timeout_s * 2),
        ) as response:
            response.raise_for_status()
            buffer = ""
            async for chunk in response.aiter_text():
                buffer += chunk
                parts = buffer.split("\n\n")
                buffer = parts[-1]
                for part in parts[:-1]:
                    part = part.strip()
                    if not part:
                        continue
                    event = parse_sse_event(part)
                    if event is not None:
                        yield event

            if buffer.strip():
                event = parse_sse_event(buffer.strip())
                if event is not None:
                    yield event

    async def close(self) -> None:
        """Close the underlying HTTP client."""
        await self._client.aclose()
