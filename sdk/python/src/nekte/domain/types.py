"""NEKTE Protocol Types v0.3 — Pydantic models for all protocol value objects."""

from __future__ import annotations

from typing import Any, Literal, Union

from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Token Budget
# ---------------------------------------------------------------------------

DetailLevel = Literal["minimal", "compact", "full"]


class TokenBudget(BaseModel, frozen=True):
    """First-class citizen in every NEKTE message."""

    max_tokens: int
    detail_level: DetailLevel


# ---------------------------------------------------------------------------
# Discovery Levels — progressive, never eager
# ---------------------------------------------------------------------------

DiscoveryLevel = Literal[0, 1, 2]


class CapabilityRef(BaseModel, frozen=True):
    """L0: Catalog entry — ~8 tokens per capability."""

    id: str
    cat: str
    h: str  # version hash


class CapabilitySummary(CapabilityRef, frozen=True):
    """L1: Summary — ~40 tokens per capability."""

    desc: str
    cost: dict[str, float | int] | None = None


class CapabilitySchema(CapabilitySummary, frozen=True):
    """L2: Full schema — ~120 tokens per capability."""

    input: dict[str, Any]
    output: dict[str, Any]
    examples: list[dict[str, Any]] | None = None


Capability = Union[CapabilityRef, CapabilitySummary, CapabilitySchema]

# ---------------------------------------------------------------------------
# Agent Card
# ---------------------------------------------------------------------------


class AgentCard(BaseModel, frozen=True):
    """Ultra-compact agent metadata (~50 tokens)."""

    nekte: str
    agent: str
    endpoint: str
    caps: list[str]
    auth: Literal["bearer", "apikey", "none"] | None = None
    budget_support: bool | None = None


# ---------------------------------------------------------------------------
# Context Envelopes
# ---------------------------------------------------------------------------

ContextCompression = Literal["none", "semantic", "reference"]


class ContextPermissions(BaseModel, frozen=True):
    forward: bool
    persist: bool
    derive: bool


class ContextEnvelope(BaseModel, frozen=True):
    id: str
    data: dict[str, Any]
    compression: ContextCompression
    permissions: ContextPermissions
    ttl_s: int
    budget_hint: int | None = None


# ---------------------------------------------------------------------------
# Multi-level Result
# ---------------------------------------------------------------------------


class MultiLevelResult(BaseModel, frozen=True):
    minimal: str | None = None
    compact: dict[str, Any] | None = None
    full: dict[str, Any] | None = None


class InvokeResult(BaseModel, frozen=True):
    out: MultiLevelResult | dict[str, Any]
    resolved_level: DetailLevel | None = None
    meta: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Task
# ---------------------------------------------------------------------------

TaskStatus = Literal[
    "pending", "accepted", "running", "completed", "failed", "cancelled", "suspended"
]
TerminalTaskStatus = Literal["completed", "failed", "cancelled"]
ActiveTaskStatus = Literal["pending", "accepted", "running", "suspended"]


class Task(BaseModel, frozen=True):
    id: str
    desc: str
    timeout_ms: int = 30000
    budget: TokenBudget


class TaskResult(BaseModel, frozen=True):
    task_id: str
    status: TaskStatus
    out: MultiLevelResult | None = None
    error: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# JSON-RPC 2.0 Envelope
# ---------------------------------------------------------------------------

NekteMethod = Literal[
    "nekte.discover",
    "nekte.invoke",
    "nekte.delegate",
    "nekte.context",
    "nekte.verify",
    "nekte.task.cancel",
    "nekte.task.resume",
    "nekte.task.status",
]


class NekteRequest(BaseModel, frozen=True):
    jsonrpc: Literal["2.0"] = "2.0"
    method: NekteMethod
    id: str | int
    params: dict[str, Any]


class NekteResponse(BaseModel, frozen=True):
    jsonrpc: Literal["2.0"] = "2.0"
    id: str | int
    result: Any | None = None
    error: NekteError | None = None


class NekteError(BaseModel, frozen=True):
    code: int
    message: str
    data: Any | None = None
