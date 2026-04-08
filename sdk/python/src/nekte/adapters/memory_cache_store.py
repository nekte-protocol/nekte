"""In-Memory Cache Store adapter with TTL support."""

from __future__ import annotations

import time
from typing import Any, Literal

from nekte.ports.cache_store import CacheGetResult


class _CacheEntry:
    __slots__ = ("value", "expires_at")

    def __init__(self, value: dict[str, Any], ttl: float) -> None:
        self.value = value
        self.expires_at = time.monotonic() + ttl


class InMemoryCacheStore:
    """Simple in-memory cache with TTL expiry.

    Implements the CacheStore port contract.
    """

    def __init__(self, max_entries: int = 1000) -> None:
        self._store: dict[str, _CacheEntry] = {}
        self._max_entries = max_entries

    def get(self, key: str) -> CacheGetResult | None:
        entry = self._store.get(key)
        if entry is None:
            return None

        now = time.monotonic()
        if now >= entry.expires_at:
            # Stale — still return but mark as stale (SWR pattern)
            return CacheGetResult(value=entry.value, status="stale")

        return CacheGetResult(value=entry.value, status="fresh")

    def set(self, key: str, value: dict[str, Any], ttl: float) -> None:
        # Simple eviction: remove oldest if at capacity
        if len(self._store) >= self._max_entries and key not in self._store:
            oldest_key = next(iter(self._store))
            del self._store[oldest_key]

        self._store[key] = _CacheEntry(value, ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    @property
    def size(self) -> int:
        return len(self._store)
