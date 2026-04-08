---
title: "Interface: SsePartialEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SsePartialEvent

# Interface: SsePartialEvent

Defined in: [packages/core/src/sse.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L40)

Partial result — early/preliminary data before completion

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L42)

#### out

> **out**: `Record`\<`string`, `unknown`\>

#### resolved\_level?

> `optional` **resolved\_level?**: [`DetailLevel`](../type-aliases/DetailLevel.md)

***

### event

> **event**: `"partial"`

Defined in: [packages/core/src/sse.ts:41](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L41)
