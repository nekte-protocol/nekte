"""Transport port — outbound adapter contract for sending requests."""

from __future__ import annotations

from typing import Protocol

from nekte.domain.types import NekteRequest, NekteResponse


class Transport(Protocol):
    """Outbound port for sending NEKTE protocol requests."""

    async def request(self, req: NekteRequest) -> NekteResponse: ...

    async def close(self) -> None: ...
