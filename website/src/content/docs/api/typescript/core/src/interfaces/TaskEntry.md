---
title: "Interface: TaskEntry"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / TaskEntry

# Interface: TaskEntry

Defined in: [packages/core/src/task.ts:117](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L117)

TaskEntry — Aggregate Root for task lifecycle.

All fields are readonly. State changes MUST go through
transitionTask() / saveCheckpoint() which enforce the
state machine invariants.

Note: Unlike the Python SDK (which returns new frozen instances),
the TS SDK mutates internal state for performance (AbortController
is inherently mutable). The readonly modifiers prevent accidental
mutation from outside transitionTask()/saveCheckpoint().

## Properties

### abortController

> `readonly` **abortController**: `AbortController`

Defined in: [packages/core/src/task.ts:120](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L120)

***

### checkpoint?

> `readonly` `optional` **checkpoint?**: [`TaskCheckpoint`](TaskCheckpoint.md)

Defined in: [packages/core/src/task.ts:125](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L125)

**`Internal`**

Mutated only by saveCheckpoint()

***

### context?

> `readonly` `optional` **context?**: [`ContextEnvelope`](ContextEnvelope.md)

Defined in: [packages/core/src/task.ts:119](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L119)

***

### createdAt

> `readonly` **createdAt**: `number`

Defined in: [packages/core/src/task.ts:121](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L121)

***

### status

> `readonly` **status**: [`TaskStatus`](../type-aliases/TaskStatus.md)

Defined in: [packages/core/src/task.ts:123](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L123)

**`Internal`**

Mutated only by transitionTask()

***

### task

> `readonly` **task**: [`Task`](Task.md)

Defined in: [packages/core/src/task.ts:118](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L118)

***

### transitions

> `readonly` **transitions**: readonly [`TaskTransition`](TaskTransition.md)[]

Defined in: [packages/core/src/task.ts:127](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L127)

**`Internal`**

Mutated only by transitionTask()

***

### updatedAt

> `readonly` **updatedAt**: `number`

Defined in: [packages/core/src/task.ts:129](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L129)

**`Internal`**

Mutated only by transitionTask()/saveCheckpoint()
