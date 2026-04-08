"""Task Domain Model — Aggregate Root with state machine.

State Machine:
  pending -> accepted -> running -> completed
                      -> suspended -> running (resume)
  (any non-terminal) -> cancelled | failed
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Final

from nekte.domain.types import ContextEnvelope, Task, TaskStatus

# ---------------------------------------------------------------------------
# Valid transitions — single source of truth
# ---------------------------------------------------------------------------

TASK_TRANSITIONS: Final[dict[TaskStatus, tuple[TaskStatus, ...]]] = {
    "pending": ("accepted", "cancelled", "failed"),
    "accepted": ("running", "cancelled", "failed"),
    "running": ("completed", "failed", "cancelled", "suspended"),
    "completed": (),
    "failed": (),
    "cancelled": (),
    "suspended": ("running", "cancelled", "failed"),
}

CANCELLABLE_STATES: Final[tuple[TaskStatus, ...]] = ("pending", "accepted", "running", "suspended")
RESUMABLE_STATES: Final[tuple[TaskStatus, ...]] = ("suspended",)
TERMINAL_STATES: Final[tuple[TaskStatus, ...]] = ("completed", "failed", "cancelled")


# ---------------------------------------------------------------------------
# Domain functions
# ---------------------------------------------------------------------------


def is_valid_transition(from_status: TaskStatus, to_status: TaskStatus) -> bool:
    return to_status in TASK_TRANSITIONS[from_status]


def is_terminal(status: TaskStatus) -> bool:
    return status in TERMINAL_STATES


def is_active(status: TaskStatus) -> bool:
    return not is_terminal(status)


def is_cancellable(status: TaskStatus) -> bool:
    return status in CANCELLABLE_STATES


def is_resumable(status: TaskStatus) -> bool:
    return status in RESUMABLE_STATES


# ---------------------------------------------------------------------------
# Value Objects
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class TaskCheckpoint:
    data: dict[str, Any]
    created_at: float


@dataclass(frozen=True)
class TaskTransition:
    from_status: TaskStatus
    to_status: TaskStatus
    timestamp: float
    reason: str | None = None


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------


class TaskTransitionError(Exception):
    def __init__(self, task_id: str, from_status: TaskStatus, to_status: TaskStatus) -> None:
        super().__init__(
            f"Invalid task transition: '{from_status}' -> '{to_status}' for task '{task_id}'"
        )
        self.task_id = task_id
        self.from_status = from_status
        self.to_status = to_status


# ---------------------------------------------------------------------------
# TaskEntry — Aggregate Root
# ---------------------------------------------------------------------------


@dataclass
class TaskEntry:
    """Aggregate root for task lifecycle.

    Unlike the frozen Pydantic models, TaskEntry is mutable internally
    to support state transitions and checkpoint saves. External mutation
    should go through transition_task() and save_checkpoint().
    """

    task: Task
    status: TaskStatus = "pending"
    context: ContextEnvelope | None = None
    checkpoint: TaskCheckpoint | None = None
    transitions: list[TaskTransition] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    _cancelled: bool = field(default=False, repr=False)

    @property
    def is_cancelled(self) -> bool:
        return self._cancelled


def create_task_entry(task: Task, context: ContextEnvelope | None = None) -> TaskEntry:
    """Factory — the only way to create a valid TaskEntry."""
    now = time.time()
    return TaskEntry(
        task=task,
        context=context,
        created_at=now,
        updated_at=now,
    )


def transition_task(
    entry: TaskEntry,
    to: TaskStatus,
    reason: str | None = None,
) -> TaskEntry:
    """Transition a task to a new status. Raises TaskTransitionError if invalid."""
    if not is_valid_transition(entry.status, to):
        raise TaskTransitionError(entry.task.id, entry.status, to)

    now = time.time()
    transition = TaskTransition(
        from_status=entry.status,
        to_status=to,
        timestamp=now,
        reason=reason,
    )
    entry.transitions.append(transition)
    entry.status = to
    entry.updated_at = now

    if to == "cancelled":
        entry._cancelled = True

    return entry


def save_checkpoint(entry: TaskEntry, data: dict[str, Any]) -> TaskEntry:
    """Save a checkpoint on a running/suspended task for later resume."""
    if entry.status not in ("running", "suspended"):
        raise ValueError(f"Cannot checkpoint task in '{entry.status}' state")

    entry.checkpoint = TaskCheckpoint(data=data, created_at=time.time())
    entry.updated_at = time.time()
    return entry
