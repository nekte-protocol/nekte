"""Tests for domain types — Pydantic round-trip and immutability."""

import pytest

from nekte.domain.types import (
    AgentCard,
    CapabilityRef,
    CapabilitySchema,
    CapabilitySummary,
    ContextEnvelope,
    ContextPermissions,
    MultiLevelResult,
    NekteRequest,
    NekteResponse,
    Task,
    TokenBudget,
)


class TestTokenBudget:
    def test_create(self) -> None:
        b = TokenBudget(max_tokens=500, detail_level="compact")
        assert b.max_tokens == 500
        assert b.detail_level == "compact"

    def test_frozen(self) -> None:
        b = TokenBudget(max_tokens=100, detail_level="minimal")
        with pytest.raises(Exception):
            b.max_tokens = 200  # type: ignore[misc]

    def test_round_trip(self) -> None:
        b = TokenBudget(max_tokens=4096, detail_level="full")
        data = b.model_dump()
        b2 = TokenBudget.model_validate(data)
        assert b == b2


class TestCapabilityLevels:
    def test_l0_ref(self) -> None:
        ref = CapabilityRef(id="echo", cat="util", h="abc123")
        assert ref.id == "echo"

    def test_l1_summary(self) -> None:
        s = CapabilitySummary(id="echo", cat="util", h="abc", desc="Echo back")
        assert s.desc == "Echo back"

    def test_l2_schema(self) -> None:
        s = CapabilitySchema(
            id="echo",
            cat="util",
            h="abc",
            desc="Echo",
            input={"type": "object"},
            output={"type": "object"},
        )
        assert s.input == {"type": "object"}


class TestAgentCard:
    def test_create(self) -> None:
        card = AgentCard(
            nekte="0.3.0",
            agent="test",
            endpoint="http://localhost:4001",
            caps=["echo", "sentiment"],
            auth="none",
            budget_support=True,
        )
        assert len(card.caps) == 2

    def test_round_trip(self) -> None:
        card = AgentCard(
            nekte="0.3.0",
            agent="test",
            endpoint="http://localhost:4001",
            caps=["echo"],
        )
        data = card.model_dump()
        card2 = AgentCard.model_validate(data)
        assert card == card2


class TestContextEnvelope:
    def test_create(self) -> None:
        env = ContextEnvelope(
            id="ctx-1",
            data={"key": "value"},
            compression="none",
            permissions=ContextPermissions(forward=True, persist=False, derive=True),
            ttl_s=3600,
        )
        assert env.permissions.forward is True


class TestMultiLevelResult:
    def test_all_levels(self) -> None:
        r = MultiLevelResult(
            minimal="ok",
            compact={"status": "ok"},
            full={"status": "ok", "details": "verbose"},
        )
        assert r.minimal == "ok"
        assert r.compact is not None


class TestTask:
    def test_create(self) -> None:
        t = Task(
            id="t-001",
            desc="Analyze sentiment",
            budget=TokenBudget(max_tokens=500, detail_level="compact"),
        )
        assert t.timeout_ms == 30000  # default


class TestNekteRequest:
    def test_create(self) -> None:
        req = NekteRequest(
            method="nekte.discover",
            id=1,
            params={"level": 0},
        )
        assert req.jsonrpc == "2.0"


class TestNekteResponse:
    def test_with_result(self) -> None:
        res = NekteResponse(id=1, result={"agent": "test"})
        assert res.error is None

    def test_with_error(self) -> None:
        from nekte.domain.types import NekteError

        res = NekteResponse(
            id=1, error=NekteError(code=-32001, message="VERSION_MISMATCH")
        )
        assert res.result is None
        assert res.error is not None
