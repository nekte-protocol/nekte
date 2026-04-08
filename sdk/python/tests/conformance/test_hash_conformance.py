"""Cross-SDK conformance tests using shared hash vectors."""

import json
from pathlib import Path

import pytest

from nekte.domain.hash import compute_version_hash

VECTORS_PATH = Path(__file__).parent / "hash_vectors.json"


@pytest.fixture
def vectors() -> list[dict]:
    return json.loads(VECTORS_PATH.read_text())


def test_all_vectors_match(vectors: list[dict]) -> None:
    """Every hash vector must produce the same hash as the TypeScript SDK."""
    for vector in vectors:
        result = compute_version_hash(vector["input"], vector["output"])
        assert result == vector["expected_hash"], (
            f"Hash mismatch for '{vector['name']}': "
            f"got {result}, expected {vector['expected_hash']}"
        )


@pytest.mark.parametrize(
    "vector",
    json.loads(VECTORS_PATH.read_text()),
    ids=lambda v: v["name"],
)
def test_individual_vector(vector: dict) -> None:
    """Parameterized test — one assertion per vector for clear failure reporting."""
    result = compute_version_hash(vector["input"], vector["output"])
    assert result == vector["expected_hash"]
