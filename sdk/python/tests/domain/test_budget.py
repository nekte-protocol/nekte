"""Tests for budget resolution."""

from nekte.domain.budget import create_budget, estimate_tokens, resolve_budget
from nekte.domain.types import MultiLevelResult, TokenBudget


class TestEstimateTokens:
    def test_string(self) -> None:
        tokens = estimate_tokens("hello world")
        assert tokens > 0

    def test_dict(self) -> None:
        tokens = estimate_tokens({"key": "value"})
        assert tokens > 0

    def test_longer_means_more_tokens(self) -> None:
        short = estimate_tokens("hi")
        long = estimate_tokens("This is a much longer string for estimation")
        assert long > short


class TestResolveBudget:
    def test_returns_requested_level(self) -> None:
        result = MultiLevelResult(minimal="ok", compact={"s": "ok"}, full={"s": "ok", "d": "x"})
        budget = TokenBudget(max_tokens=4096, detail_level="full")
        data, level = resolve_budget(result, budget)
        assert level == "full"

    def test_falls_back_on_budget_exceeded(self) -> None:
        result = MultiLevelResult(minimal="ok", compact={"s": "ok"}, full={"s": "ok", "d": "x" * 10000})
        budget = TokenBudget(max_tokens=10, detail_level="full")
        data, level = resolve_budget(result, budget)
        assert level in ("compact", "minimal")

    def test_minimal_always_returned(self) -> None:
        result = MultiLevelResult(minimal="ok")
        budget = TokenBudget(max_tokens=1, detail_level="minimal")
        data, level = resolve_budget(result, budget)
        assert data == "ok"

    def test_default_compact(self) -> None:
        result = MultiLevelResult(compact={"s": "ok"})
        data, level = resolve_budget(result, None)
        assert level == "compact"


class TestCreateBudget:
    def test_defaults(self) -> None:
        b = create_budget()
        assert b.max_tokens == 500
        assert b.detail_level == "compact"

    def test_custom(self) -> None:
        b = create_budget(max_tokens=100, detail_level="minimal")
        assert b.max_tokens == 100
