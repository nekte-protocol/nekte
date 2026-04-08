"""NEKTE Version Hashing — cross-SDK conformant.

Computes stable hashes for capability schemas.
The canonicalize() function produces identical output to the TypeScript SDK.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any


def canonicalize(value: Any) -> str:
    """Canonicalize a JSON value for stable hashing.

    Objects have their keys sorted recursively.
    Must produce the exact same output as the TypeScript canonicalize().
    """
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return json.dumps(value)
    if isinstance(value, str):
        return json.dumps(value)
    if isinstance(value, list):
        return "[" + ",".join(canonicalize(item) for item in value) + "]"
    if isinstance(value, dict):
        sorted_entries = sorted(value.keys())
        parts = [f"{json.dumps(k)}:{canonicalize(value[k])}" for k in sorted_entries]
        return "{" + ",".join(parts) + "}"
    return "null"


def compute_version_hash(
    input_schema: dict[str, Any],
    output_schema: dict[str, Any],
) -> str:
    """Compute a version hash for a capability's contract.

    Only input and output schemas affect the hash.
    Returns 8-character hex hash (32 bits).
    """
    canonical = canonicalize({"input": input_schema, "output": output_schema})
    full = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return full[:8]


def verify_version_hash(
    hash_value: str,
    input_schema: dict[str, Any],
    output_schema: dict[str, Any],
) -> bool:
    """Verify a version hash matches the current schema."""
    return compute_version_hash(input_schema, output_schema) == hash_value


def compute_content_hash(data: Any) -> str:
    """Compute a content hash for result verification."""
    canonical = canonicalize(data)
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return f"sha256:{digest}"
