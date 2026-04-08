"""CacheStore port — outbound adapter contract for capability caching."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal, Protocol


@dataclass(frozen=True)
class CacheGetResult:
    value: dict[str, Any]
    status: Literal["fresh", "stale"]


class CacheStore(Protocol):
    """Outbound port for caching capability data."""

    def get(self, key: str) -> CacheGetResult | None: ...

    def set(self, key: str, value: dict[str, Any], ttl: float) -> None: ...

    def delete(self, key: str) -> None: ...

    def clear(self) -> None: ...
