---
title: "Interface: SseProgressEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SseProgressEvent

# Interface: SseProgressEvent

Defined in: [packages/core/src/sse.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L30)

Progress update — how far along the task is

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:32](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L32)

#### message?

> `optional` **message?**: `string`

#### processed

> **processed**: `number`

#### total

> **total**: `number`

***

### event

> **event**: `"progress"`

Defined in: [packages/core/src/sse.ts:31](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L31)
