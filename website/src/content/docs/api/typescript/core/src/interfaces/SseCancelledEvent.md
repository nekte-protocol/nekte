---
title: "Interface: SseCancelledEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SseCancelledEvent

# Interface: SseCancelledEvent

Defined in: [packages/core/src/sse.ts:73](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L73)

Task was cancelled

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:75](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L75)

#### previous\_status

> **previous\_status**: [`TaskStatus`](../type-aliases/TaskStatus.md)

#### reason?

> `optional` **reason?**: `string`

#### task\_id

> **task\_id**: `string`

***

### event

> **event**: `"cancelled"`

Defined in: [packages/core/src/sse.ts:74](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L74)
