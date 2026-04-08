"""Tests for NekteServer application service."""

import pytest

from nekte.application.server import NekteServer


@pytest.fixture
def server() -> NekteServer:
    srv = NekteServer("test-agent", version="1.0.0")
    srv.capability(
        "sentiment",
        category="nlp",
        description="Analyze text sentiment",
        input_schema={"type": "object", "properties": {"text": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"score": {"type": "number"}, "label": {"type": "string"}}},
        handler=lambda inp: {"score": 0.92, "label": "positive"},
        to_minimal=lambda out: f"{out['label']} {out['score']}",
        to_compact=lambda out: {"s": out["label"], "v": out["score"]},
    )
    srv.capability(
        "echo",
        category="util",
        description="Echo back the message",
        input_schema={"type": "object", "properties": {"msg": {"type": "string"}}},
        output_schema={"type": "object", "properties": {"echo": {"type": "string"}}},
        handler=lambda inp: {"echo": inp.get("msg", "")},
        to_minimal=lambda out: out["echo"],
    )
    return srv


class TestAgentCard:
    def test_card(self, server: NekteServer) -> None:
        card = server.agent_card("http://localhost:4001")
        assert card.agent == "test-agent"
        assert "sentiment" in card.caps
        assert "echo" in card.caps
        assert card.budget_support is True


class TestDiscover:
    @pytest.mark.anyio
    async def test_l0(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 1,
            "method": "nekte.discover",
            "params": {"level": 0},
        })
        result = resp["result"]
        assert result["agent"] == "test-agent"
        assert len(result["caps"]) == 2
        # L0 should only have id, cat, h
        cap = result["caps"][0]
        assert "id" in cap
        assert "cat" in cap
        assert "h" in cap
        assert "desc" not in cap

    @pytest.mark.anyio
    async def test_l1(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 2,
            "method": "nekte.discover",
            "params": {"level": 1, "filter": {"id": "sentiment"}},
        })
        caps = resp["result"]["caps"]
        assert len(caps) == 1
        assert caps[0]["desc"] == "Analyze text sentiment"

    @pytest.mark.anyio
    async def test_l2(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 3,
            "method": "nekte.discover",
            "params": {"level": 2, "filter": {"id": "echo"}},
        })
        caps = resp["result"]["caps"]
        assert len(caps) == 1
        assert "input" in caps[0]
        assert "output" in caps[0]

    @pytest.mark.anyio
    async def test_filter_category(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 4,
            "method": "nekte.discover",
            "params": {"level": 0, "filter": {"category": "util"}},
        })
        caps = resp["result"]["caps"]
        assert len(caps) == 1
        assert caps[0]["id"] == "echo"

    @pytest.mark.anyio
    async def test_filter_query(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 5,
            "method": "nekte.discover",
            "params": {"level": 0, "filter": {"query": "sentiment"}},
        })
        caps = resp["result"]["caps"]
        assert len(caps) == 1


class TestInvoke:
    @pytest.mark.anyio
    async def test_invoke(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 10,
            "method": "nekte.invoke",
            "params": {"cap": "sentiment", "in": {"text": "great"}, "budget": {"max_tokens": 500, "detail_level": "compact"}},
        })
        result = resp["result"]
        assert "out" in result
        assert result["resolved_level"] in ("minimal", "compact", "full")
        assert result["meta"]["ms"] >= 0

    @pytest.mark.anyio
    async def test_invoke_with_hash(self, server: NekteServer) -> None:
        # First discover to get hash
        disc = await server.handle_request({
            "jsonrpc": "2.0", "id": 11,
            "method": "nekte.discover",
            "params": {"level": 0},
        })
        cap = next(c for c in disc["result"]["caps"] if c["id"] == "echo")
        h = cap["h"]

        # Invoke with correct hash
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 12,
            "method": "nekte.invoke",
            "params": {"cap": "echo", "h": h, "in": {"msg": "hello"}},
        })
        assert "error" not in resp

    @pytest.mark.anyio
    async def test_invoke_version_mismatch(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 13,
            "method": "nekte.invoke",
            "params": {"cap": "echo", "h": "wronghash", "in": {"msg": "hello"}},
        })
        assert "error" in resp
        assert resp["error"]["code"] == -32001  # VERSION_MISMATCH

    @pytest.mark.anyio
    async def test_invoke_not_found(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 14,
            "method": "nekte.invoke",
            "params": {"cap": "nonexistent", "in": {}},
        })
        assert "error" in resp
        assert resp["error"]["code"] == -32002  # CAPABILITY_NOT_FOUND


class TestErrors:
    @pytest.mark.anyio
    async def test_unknown_method(self, server: NekteServer) -> None:
        resp = await server.handle_request({
            "jsonrpc": "2.0", "id": 20,
            "method": "nekte.unknown",
            "params": {},
        })
        assert "error" in resp
        assert resp["error"]["code"] == -32601
