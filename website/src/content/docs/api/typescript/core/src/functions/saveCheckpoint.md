---
title: "Function: saveCheckpoint()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / saveCheckpoint

# Function: saveCheckpoint()

> **saveCheckpoint**(`entry`, `data`): [`TaskEntry`](../interfaces/TaskEntry.md)

Defined in: [packages/core/src/task.ts:193](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/task.ts#L193)

Save a checkpoint on a running task for later resume.
Mutates checkpoint and updatedAt through controlled cast.

## Parameters

### entry

[`TaskEntry`](../interfaces/TaskEntry.md)

### data

`Record`\<`string`, `unknown`\>

## Returns

[`TaskEntry`](../interfaces/TaskEntry.md)
