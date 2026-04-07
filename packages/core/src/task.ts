/**
 * Task Domain Model — DDD Aggregate Root
 *
 * Encapsulates the task lifecycle state machine with strict
 * transition rules. Every state change is validated and auditable.
 *
 * State Machine:
 *   pending → accepted → running → completed
 *                     ↘ suspended → running (resume)
 *   (any non-terminal) → cancelled | failed
 *
 * Terminal states: completed, failed, cancelled
 * Resumable states: suspended
 */

import type {
  ActiveTaskStatus,
  ContextEnvelope,
  Task,
  TaskStatus,
  TerminalTaskStatus,
  TokenBudget,
} from './types.js';

// ---------------------------------------------------------------------------
// Value Objects
// ---------------------------------------------------------------------------

/** Valid state transitions — the single source of truth */
export const TASK_TRANSITIONS: Readonly<Record<TaskStatus, readonly TaskStatus[]>> = {
  pending: ['accepted', 'cancelled', 'failed'],
  accepted: ['running', 'cancelled', 'failed'],
  running: ['completed', 'failed', 'cancelled', 'suspended'],
  completed: [],
  failed: [],
  cancelled: [],
  suspended: ['running', 'cancelled', 'failed'],
} as const;

/** States from which cancel is valid */
export const CANCELLABLE_STATES: readonly TaskStatus[] = [
  'pending',
  'accepted',
  'running',
  'suspended',
] as const;

/** States from which resume is valid */
export const RESUMABLE_STATES: readonly TaskStatus[] = ['suspended'] as const;

/** Terminal states — no further transitions */
export const TERMINAL_STATES: readonly TerminalTaskStatus[] = [
  'completed',
  'failed',
  'cancelled',
] as const;

// ---------------------------------------------------------------------------
// Domain Functions
// ---------------------------------------------------------------------------

/** Check if a transition is valid according to the state machine */
export function isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_TRANSITIONS[from].includes(to);
}

/** Check if a status is terminal (no further transitions) */
export function isTerminal(status: TaskStatus): status is TerminalTaskStatus {
  return (TERMINAL_STATES as readonly TaskStatus[]).includes(status);
}

/** Check if a status is active (non-terminal) */
export function isActive(status: TaskStatus): status is ActiveTaskStatus {
  return !isTerminal(status);
}

/** Check if a task can be cancelled from its current state */
export function isCancellable(status: TaskStatus): boolean {
  return CANCELLABLE_STATES.includes(status);
}

/** Check if a task can be resumed from its current state */
export function isResumable(status: TaskStatus): boolean {
  return RESUMABLE_STATES.includes(status);
}

// ---------------------------------------------------------------------------
// Task Entry — Aggregate Root
// ---------------------------------------------------------------------------

/** Serializable checkpoint for task resume */
export interface TaskCheckpoint {
  /** Handler-specific state snapshot */
  data: Record<string, unknown>;
  /** When the checkpoint was created */
  created_at: number;
}

/** Immutable record of a status transition */
export interface TaskTransition {
  from: TaskStatus;
  to: TaskStatus;
  timestamp: number;
  reason?: string;
}

/**
 * TaskEntry — The aggregate root for task lifecycle.
 *
 * Encapsulates a task, its current state, abort signaling,
 * and checkpoint data for resume. All state changes go through
 * validated transitions.
 */
export interface TaskEntry {
  /** The original task definition */
  readonly task: Task;
  /** Current lifecycle status */
  status: TaskStatus;
  /** Optional context envelope */
  readonly context?: ContextEnvelope;
  /** AbortController for cancellation signaling */
  readonly abortController: AbortController;
  /** Serialized checkpoint for resume */
  checkpoint?: TaskCheckpoint;
  /** Ordered history of all transitions */
  transitions: TaskTransition[];
  /** Creation timestamp */
  readonly createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
}

/**
 * Create a new TaskEntry in 'pending' state.
 * Factory function — the only way to create a valid TaskEntry.
 */
export function createTaskEntry(task: Task, context?: ContextEnvelope): TaskEntry {
  const now = Date.now();
  return {
    task,
    status: 'pending',
    context,
    abortController: new AbortController(),
    transitions: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Transition a task to a new status.
 * Throws if the transition is invalid.
 * Returns the updated entry (mutates in place for performance).
 */
export function transitionTask(entry: TaskEntry, to: TaskStatus, reason?: string): TaskEntry {
  if (!isValidTransition(entry.status, to)) {
    throw new TaskTransitionError(entry.task.id, entry.status, to);
  }

  const transition: TaskTransition = {
    from: entry.status,
    to,
    timestamp: Date.now(),
    reason,
  };

  entry.transitions.push(transition);
  entry.status = to;
  entry.updatedAt = transition.timestamp;

  // Fire abort signal on cancellation
  if (to === 'cancelled' && !entry.abortController.signal.aborted) {
    entry.abortController.abort(reason ?? 'Task cancelled');
  }

  return entry;
}

/**
 * Save a checkpoint on a running task for later resume.
 */
export function saveCheckpoint(entry: TaskEntry, data: Record<string, unknown>): TaskEntry {
  if (entry.status !== 'running' && entry.status !== 'suspended') {
    throw new Error(`Cannot checkpoint task in '${entry.status}' state`);
  }
  entry.checkpoint = { data, created_at: Date.now() };
  entry.updatedAt = Date.now();
  return entry;
}

// ---------------------------------------------------------------------------
// Domain Errors
// ---------------------------------------------------------------------------

/** Thrown when an invalid state transition is attempted */
export class TaskTransitionError extends Error {
  readonly taskId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;

  constructor(taskId: string, from: TaskStatus, to: TaskStatus) {
    super(`Invalid task transition: '${from}' → '${to}' for task '${taskId}'`);
    this.name = 'TaskTransitionError';
    this.taskId = taskId;
    this.from = from;
    this.to = to;
  }
}
