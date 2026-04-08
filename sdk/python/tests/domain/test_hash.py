"""Tests for hashing functions."""

from nekte.domain.hash import canonicalize, compute_content_hash, compute_version_hash


class TestCanonicalize:
    def test_null(self) -> None:
        assert canonicalize(None) == "null"

    def test_bool(self) -> None:
        assert canonicalize(True) == "true"
        assert canonicalize(False) == "false"

    def test_number(self) -> None:
        assert canonicalize(42) == "42"
        assert canonicalize(3.14) == "3.14"

    def test_string(self) -> None:
        assert canonicalize("hello") == '"hello"'

    def test_array(self) -> None:
        assert canonicalize([1, 2, 3]) == "[1,2,3]"

    def test_empty_object(self) -> None:
        assert canonicalize({}) == "{}"

    def test_keys_sorted(self) -> None:
        result = canonicalize({"b": 2, "a": 1})
        assert result == '{"a":1,"b":2}'

    def test_nested_keys_sorted(self) -> None:
        result = canonicalize({"z": {"b": 2, "a": 1}})
        assert result == '{"z":{"a":1,"b":2}}'


class TestComputeVersionHash:
    def test_deterministic(self) -> None:
        h1 = compute_version_hash({"type": "object"}, {"type": "object"})
        h2 = compute_version_hash({"type": "object"}, {"type": "object"})
        assert h1 == h2

    def test_length(self) -> None:
        h = compute_version_hash({"a": 1}, {"b": 2})
        assert len(h) == 8

    def test_hex_format(self) -> None:
        h = compute_version_hash({"a": 1}, {"b": 2})
        int(h, 16)  # Should not raise

    def test_different_schemas_different_hash(self) -> None:
        h1 = compute_version_hash({"a": 1}, {"b": 2})
        h2 = compute_version_hash({"c": 3}, {"d": 4})
        assert h1 != h2

    def test_key_order_irrelevant(self) -> None:
        h1 = compute_version_hash({"a": 1, "b": 2}, {"x": 1})
        h2 = compute_version_hash({"b": 2, "a": 1}, {"x": 1})
        assert h1 == h2


class TestComputeContentHash:
    def test_prefix(self) -> None:
        h = compute_content_hash({"result": "ok"})
        assert h.startswith("sha256:")

    def test_deterministic(self) -> None:
        h1 = compute_content_hash([1, 2, 3])
        h2 = compute_content_hash([1, 2, 3])
        assert h1 == h2
