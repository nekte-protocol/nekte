"""AuthHandler port — inbound adapter contract for request authentication."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol


@dataclass(frozen=True)
class AuthResult:
    identity: str
    claims: dict[str, Any] | None = None


class AuthHandler(Protocol):
    """Inbound port for authenticating incoming requests."""

    async def authenticate(self, headers: dict[str, str]) -> AuthResult: ...
