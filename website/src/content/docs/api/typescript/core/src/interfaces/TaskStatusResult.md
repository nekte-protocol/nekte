---
title: "Interface: TaskStatusResult"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / TaskStatusResult

# Interface: TaskStatusResult

Defined in: [packages/core/src/types.ts:307](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L307)

Response for task status queries

## Properties

### checkpoint\_available

> **checkpoint\_available**: `boolean`

Defined in: [packages/core/src/types.ts:313](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L313)

Whether a checkpoint exists for resume

***

### created\_at

> **created\_at**: `number`

Defined in: [packages/core/src/types.ts:315](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L315)

Timestamps for lifecycle auditing

***

### progress?

> `optional` **progress?**: `object`

Defined in: [packages/core/src/types.ts:311](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L311)

Current progress if available

#### processed

> **processed**: `number`

#### total

> **total**: `number`

***

### status

> **status**: [`TaskStatus`](../type-aliases/TaskStatus.md)

Defined in: [packages/core/src/types.ts:309](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L309)

***

### task\_id

> **task\_id**: `string`

Defined in: [packages/core/src/types.ts:308](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L308)

***

### updated\_at

> **updated\_at**: `number`

Defined in: [packages/core/src/types.ts:316](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L316)
