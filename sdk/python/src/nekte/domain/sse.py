"""NEKTE SSE (Server-Sent Events) types and encoding."""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Literal, Union

from nekte.domain.types import DetailLevel, TaskStatus

# ---------------------------------------------------------------------------
# SSE Event Types
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class SseProgressEvent:
    processed: int
    total: int
    message: str | None = None
    event: Literal["progress"] = "progress"


@dataclass(frozen=True)
class SsePartialEvent:
    out: dict[str, Any]
    resolved_level: DetailLevel | None = None
    event: Literal["partial"] = "partial"


@dataclass(frozen=True)
class SseCompleteEvent:
    task_id: str
    out: dict[str, Any]
    meta: dict[str, Any] | None = None
    event: Literal["complete"] = "complete"


@dataclass(frozen=True)
class SseErrorEvent:
    code: int
    message: str
    task_id: str | None = None
    event: Literal["error"] = "error"


@dataclass(frozen=True)
class SseCancelledEvent:
    task_id: str
    previous_status: TaskStatus
    reason: str | None = None
    event: Literal["cancelled"] = "cancelled"


@dataclass(frozen=True)
class SseSuspendedEvent:
    task_id: str
    checkpoint_available: bool
    event: Literal["suspended"] = "suspended"


@dataclass(frozen=True)
class SseResumedEvent:
    task_id: str
    from_checkpoint: bool
    event: Literal["resumed"] = "resumed"


SseEvent = Union[
    SseProgressEvent,
    SsePartialEvent,
    SseCompleteEvent,
    SseErrorEvent,
    SseCancelledEvent,
    SseSuspendedEvent,
    SseResumedEvent,
]


# ---------------------------------------------------------------------------
# Encoding / Decoding
# ---------------------------------------------------------------------------


def _event_to_data(event: SseEvent) -> dict[str, Any]:
    """Convert an SSE event to its data dict (excluding the event type field)."""
    result: dict[str, Any] = {}
    for key, value in event.__dict__.items():
        if key != "event" and value is not None:
            result[key] = value
    return result


def encode_sse_event(event: SseEvent) -> str:
    """Encode a NEKTE SSE event to text/event-stream format."""
    data = _event_to_data(event)
    return f"event: {event.event}\ndata: {json.dumps(data)}\n\n"


def parse_sse_event(block: str) -> SseEvent | None:
    """Parse a single SSE event block. Returns None if incomplete."""
    event_type: str | None = None
    data_str: str | None = None

    for line in block.split("\n"):
        if line.startswith("event: "):
            event_type = line[7:].strip()
        elif line.startswith("data: "):
            data_str = line[6:]

    if not event_type or not data_str:
        return None

    try:
        data = json.loads(data_str)
    except json.JSONDecodeError:
        return None

    constructors: dict[str, type[SseEvent]] = {
        "progress": SseProgressEvent,
        "partial": SsePartialEvent,
        "complete": SseCompleteEvent,
        "error": SseErrorEvent,
        "cancelled": SseCancelledEvent,
        "suspended": SseSuspendedEvent,
        "resumed": SseResumedEvent,
    }

    cls = constructors.get(event_type)
    if cls is None:
        return None

    return cls(**data)  # type: ignore[arg-type]


def parse_sse_stream(text: str) -> list[SseEvent]:
    """Parse a full SSE stream into a list of events."""
    blocks = text.split("\n\n")
    events: list[SseEvent] = []
    for block in blocks:
        event = parse_sse_event(block.strip())
        if event is not None:
            events.append(event)
    return events


SSE_CONTENT_TYPE = "text/event-stream"
