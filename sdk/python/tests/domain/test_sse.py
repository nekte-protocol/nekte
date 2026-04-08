"""Tests for SSE event encoding and parsing."""

from nekte.domain.sse import (
    SseCancelledEvent,
    SseCompleteEvent,
    SseErrorEvent,
    SsePartialEvent,
    SseProgressEvent,
    SseResumedEvent,
    SseSuspendedEvent,
    encode_sse_event,
    parse_sse_event,
    parse_sse_stream,
)


class TestEncodeSseEvent:
    def test_progress(self) -> None:
        event = SseProgressEvent(processed=50, total=100)
        encoded = encode_sse_event(event)
        assert encoded.startswith("event: progress\n")
        assert '"processed": 50' in encoded
        assert encoded.endswith("\n\n")

    def test_complete(self) -> None:
        event = SseCompleteEvent(task_id="t-001", out={"result": "ok"})
        encoded = encode_sse_event(event)
        assert "event: complete" in encoded
        assert "t-001" in encoded

    def test_error(self) -> None:
        event = SseErrorEvent(code=-32007, message="TASK_FAILED")
        encoded = encode_sse_event(event)
        assert "event: error" in encoded


class TestParseSseEvent:
    def test_progress(self) -> None:
        block = 'event: progress\ndata: {"processed":50,"total":100}'
        event = parse_sse_event(block)
        assert event is not None
        assert isinstance(event, SseProgressEvent)
        assert event.processed == 50

    def test_complete(self) -> None:
        block = 'event: complete\ndata: {"task_id":"t-001","out":{"result":"ok"}}'
        event = parse_sse_event(block)
        assert event is not None
        assert isinstance(event, SseCompleteEvent)
        assert event.task_id == "t-001"

    def test_cancelled(self) -> None:
        block = 'event: cancelled\ndata: {"task_id":"t-001","previous_status":"running"}'
        event = parse_sse_event(block)
        assert isinstance(event, SseCancelledEvent)

    def test_suspended(self) -> None:
        block = 'event: suspended\ndata: {"task_id":"t-001","checkpoint_available":true}'
        event = parse_sse_event(block)
        assert isinstance(event, SseSuspendedEvent)
        assert event.checkpoint_available is True

    def test_resumed(self) -> None:
        block = 'event: resumed\ndata: {"task_id":"t-001","from_checkpoint":true}'
        event = parse_sse_event(block)
        assert isinstance(event, SseResumedEvent)

    def test_incomplete_returns_none(self) -> None:
        assert parse_sse_event("event: progress") is None
        assert parse_sse_event("data: {}") is None

    def test_invalid_json_returns_none(self) -> None:
        assert parse_sse_event("event: progress\ndata: {bad}") is None


class TestParseSseStream:
    def test_multiple_events(self) -> None:
        stream = (
            'event: progress\ndata: {"processed":1,"total":10}\n\n'
            'event: progress\ndata: {"processed":5,"total":10}\n\n'
            'event: complete\ndata: {"task_id":"t-001","out":{"result":"ok"}}\n\n'
        )
        events = parse_sse_stream(stream)
        assert len(events) == 3
        assert isinstance(events[0], SseProgressEvent)
        assert isinstance(events[2], SseCompleteEvent)

    def test_round_trip(self) -> None:
        original = SseProgressEvent(processed=42, total=100, message="halfway")
        encoded = encode_sse_event(original)
        parsed = parse_sse_event(encoded.strip())
        assert parsed is not None
        assert isinstance(parsed, SseProgressEvent)
        assert parsed.processed == 42
        assert parsed.message == "halfway"
