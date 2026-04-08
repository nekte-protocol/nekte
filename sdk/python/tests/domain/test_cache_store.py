"""Tests for InMemoryCacheStore adapter."""

import time

from nekte.adapters.memory_cache_store import InMemoryCacheStore


class TestInMemoryCacheStore:
    def test_set_and_get(self) -> None:
        store = InMemoryCacheStore()
        store.set("key1", {"data": "value"}, ttl=60.0)
        result = store.get("key1")
        assert result is not None
        assert result.value == {"data": "value"}
        assert result.status == "fresh"

    def test_get_missing(self) -> None:
        store = InMemoryCacheStore()
        assert store.get("nonexistent") is None

    def test_delete(self) -> None:
        store = InMemoryCacheStore()
        store.set("key1", {"data": "value"}, ttl=60.0)
        store.delete("key1")
        assert store.get("key1") is None

    def test_clear(self) -> None:
        store = InMemoryCacheStore()
        store.set("k1", {"a": 1}, ttl=60.0)
        store.set("k2", {"b": 2}, ttl=60.0)
        assert store.size == 2
        store.clear()
        assert store.size == 0

    def test_max_entries_eviction(self) -> None:
        store = InMemoryCacheStore(max_entries=2)
        store.set("k1", {"a": 1}, ttl=60.0)
        store.set("k2", {"b": 2}, ttl=60.0)
        store.set("k3", {"c": 3}, ttl=60.0)
        # k1 should have been evicted (oldest)
        assert store.get("k1") is None
        assert store.get("k3") is not None
        assert store.size == 2

    def test_expired_entry_returns_stale(self) -> None:
        store = InMemoryCacheStore()
        store.set("key1", {"data": "value"}, ttl=0.001)
        time.sleep(0.01)
        result = store.get("key1")
        assert result is not None
        assert result.status == "stale"

    def test_overwrite_existing(self) -> None:
        store = InMemoryCacheStore(max_entries=2)
        store.set("k1", {"v": 1}, ttl=60.0)
        store.set("k1", {"v": 2}, ttl=60.0)
        result = store.get("k1")
        assert result is not None
        assert result.value == {"v": 2}
        assert store.size == 1  # no duplication
