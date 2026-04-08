"""Tests for task lifecycle state machine."""

import pytest

from nekte.domain.task import (
    TaskTransitionError,
    create_task_entry,
    is_active,
    is_cancellable,
    is_resumable,
    is_terminal,
    is_valid_transition,
    save_checkpoint,
    transition_task,
)
from nekte.domain.types import Task, TokenBudget


def make_task(task_id: str = "t-001") -> Task:
    return Task(
        id=task_id,
        desc="Test task",
        budget=TokenBudget(max_tokens=500, detail_level="compact"),
    )


class TestTransitionValidation:
    def test_pending_to_accepted(self) -> None:
        assert is_valid_transition("pending", "accepted") is True

    def test_pending_to_completed_invalid(self) -> None:
        assert is_valid_transition("pending", "completed") is False

    def test_running_to_suspended(self) -> None:
        assert is_valid_transition("running", "suspended") is True

    def test_suspended_to_running_resume(self) -> None:
        assert is_valid_transition("suspended", "running") is True

    def test_completed_to_anything_invalid(self) -> None:
        for status in ["pending", "accepted", "running", "failed", "cancelled", "suspended"]:
            assert is_valid_transition("completed", status) is False  # type: ignore[arg-type]


class TestStatusChecks:
    def test_terminal(self) -> None:
        assert is_terminal("completed") is True
        assert is_terminal("failed") is True
        assert is_terminal("cancelled") is True
        assert is_terminal("running") is False

    def test_active(self) -> None:
        assert is_active("pending") is True
        assert is_active("running") is True
        assert is_active("completed") is False

    def test_cancellable(self) -> None:
        assert is_cancellable("running") is True
        assert is_cancellable("completed") is False

    def test_resumable(self) -> None:
        assert is_resumable("suspended") is True
        assert is_resumable("running") is False


class TestTaskEntry:
    def test_create(self) -> None:
        entry = create_task_entry(make_task())
        assert entry.status == "pending"
        assert entry.checkpoint is None
        assert len(entry.transitions) == 0

    def test_full_lifecycle(self) -> None:
        entry = create_task_entry(make_task())
        transition_task(entry, "accepted")
        transition_task(entry, "running")
        transition_task(entry, "completed")
        assert entry.status == "completed"
        assert len(entry.transitions) == 3

    def test_invalid_transition_raises(self) -> None:
        entry = create_task_entry(make_task())
        with pytest.raises(TaskTransitionError):
            transition_task(entry, "completed")

    def test_cancel_sets_flag(self) -> None:
        entry = create_task_entry(make_task())
        transition_task(entry, "accepted")
        transition_task(entry, "running")
        transition_task(entry, "cancelled", reason="user requested")
        assert entry.is_cancelled is True
        assert entry.transitions[-1].reason == "user requested"

    def test_suspend_and_resume(self) -> None:
        entry = create_task_entry(make_task())
        transition_task(entry, "accepted")
        transition_task(entry, "running")
        save_checkpoint(entry, {"batch": 50})
        transition_task(entry, "suspended")
        assert entry.checkpoint is not None
        assert entry.checkpoint.data == {"batch": 50}
        transition_task(entry, "running")
        assert entry.status == "running"

    def test_checkpoint_only_running_or_suspended(self) -> None:
        entry = create_task_entry(make_task())
        with pytest.raises(ValueError, match="Cannot checkpoint"):
            save_checkpoint(entry, {"data": 1})

    def test_no_transition_after_terminal(self) -> None:
        entry = create_task_entry(make_task())
        transition_task(entry, "accepted")
        transition_task(entry, "running")
        transition_task(entry, "completed")
        with pytest.raises(TaskTransitionError):
            transition_task(entry, "running")
