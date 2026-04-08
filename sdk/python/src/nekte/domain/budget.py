"""NEKTE Token Budget — resolution and estimation."""

from __future__ import annotations

import json
import math
from typing import Any, Final

from nekte.domain.types import DetailLevel, MultiLevelResult, TokenBudget

DEFAULT_BUDGETS: Final[dict[DetailLevel, TokenBudget]] = {
    "minimal": TokenBudget(max_tokens=50, detail_level="minimal"),
    "compact": TokenBudget(max_tokens=500, detail_level="compact"),
    "full": TokenBudget(max_tokens=4096, detail_level="full"),
}


def estimate_tokens(value: Any) -> int:
    """Rough token estimation for a JSON value (~4 chars per token)."""
    text = value if isinstance(value, str) else json.dumps(value, separators=(",", ":"))
    return math.ceil(len(text) / 4)


def resolve_budget(
    result: MultiLevelResult,
    budget: TokenBudget | None = None,
) -> tuple[Any, DetailLevel]:
    """Resolve which detail level to return based on budget.

    Returns (data, level) tuple.
    """
    requested = budget.detail_level if budget else "compact"
    max_tokens = budget.max_tokens if budget else DEFAULT_BUDGETS["compact"].max_tokens

    levels: list[DetailLevel]
    if requested == "full":
        levels = ["full", "compact", "minimal"]
    elif requested == "compact":
        levels = ["compact", "minimal"]
    else:
        levels = ["minimal"]

    for level in levels:
        data = getattr(result, level)
        if data is not None:
            estimated = estimate_tokens(data)
            if estimated <= max_tokens:
                return data, level

    # Last resort fallbacks
    if result.minimal is not None:
        return result.minimal, "minimal"
    if result.compact is not None:
        return result.compact, "compact"
    return result.full, "full"


def create_budget(
    max_tokens: int = 500,
    detail_level: DetailLevel = "compact",
) -> TokenBudget:
    """Create a token budget with sensible defaults."""
    return TokenBudget(max_tokens=max_tokens, detail_level=detail_level)
