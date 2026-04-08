"""NEKTE Protocol Errors."""

from __future__ import annotations

from typing import Final

# Error codes matching the TypeScript SDK
NEKTE_ERRORS: Final[dict[str, int]] = {
    "VERSION_MISMATCH": -32001,
    "CAPABILITY_NOT_FOUND": -32002,
    "BUDGET_EXCEEDED": -32003,
    "CONTEXT_EXPIRED": -32004,
    "CONTEXT_PERMISSION_DENIED": -32005,
    "TASK_TIMEOUT": -32006,
    "TASK_FAILED": -32007,
    "VERIFICATION_FAILED": -32008,
    "TASK_NOT_FOUND": -32009,
    "TASK_NOT_CANCELLABLE": -32010,
    "TASK_NOT_RESUMABLE": -32011,
}


class NekteProtocolError(Exception):
    """Raised when the NEKTE protocol returns an error response."""

    def __init__(self, code: int, message: str, data: object = None) -> None:
        super().__init__(message)
        self.code = code
        self.data = data

    @property
    def is_version_mismatch(self) -> bool:
        return self.code == NEKTE_ERRORS["VERSION_MISMATCH"]

    @property
    def is_capability_not_found(self) -> bool:
        return self.code == NEKTE_ERRORS["CAPABILITY_NOT_FOUND"]

    @property
    def is_budget_exceeded(self) -> bool:
        return self.code == NEKTE_ERRORS["BUDGET_EXCEEDED"]

    @property
    def is_task_not_found(self) -> bool:
        return self.code == NEKTE_ERRORS["TASK_NOT_FOUND"]

    @property
    def is_task_not_cancellable(self) -> bool:
        return self.code == NEKTE_ERRORS["TASK_NOT_CANCELLABLE"]

    @property
    def is_task_not_resumable(self) -> bool:
        return self.code == NEKTE_ERRORS["TASK_NOT_RESUMABLE"]
