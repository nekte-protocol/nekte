---
title: "Interface: SseStatusChangeEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SseStatusChangeEvent

# Interface: SseStatusChangeEvent

Defined in: [packages/core/src/sse.ts:101](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L101)

Task status changed (generic lifecycle event)

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:103](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L103)

#### from

> **from**: [`TaskStatus`](../type-aliases/TaskStatus.md)

#### reason?

> `optional` **reason?**: `string`

#### task\_id

> **task\_id**: `string`

#### to

> **to**: [`TaskStatus`](../type-aliases/TaskStatus.md)

***

### event

> **event**: `"status_change"`

Defined in: [packages/core/src/sse.ts:102](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L102)
