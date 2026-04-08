---
title: "Function: transitionTask()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / transitionTask

# Function: transitionTask()

> **transitionTask**(`entry`, `to`, `reason?`): [`TaskEntry`](../interfaces/TaskEntry.md)

Defined in: [packages/core/src/task.ts:164](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L164)

Transition a task to a new status.
Throws if the transition is invalid.

Mutates internal state through a controlled cast.
External code cannot mutate because TaskEntry fields are readonly.

## Parameters

### entry

[`TaskEntry`](../interfaces/TaskEntry.md)

### to

[`TaskStatus`](../type-aliases/TaskStatus.md)

### reason?

`string`

## Returns

[`TaskEntry`](../interfaces/TaskEntry.md)
