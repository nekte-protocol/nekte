---
title: "Interface: SseSuspendedEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SseSuspendedEvent

# Interface: SseSuspendedEvent

Defined in: [packages/core/src/sse.ts:83](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L83)

Task was suspended (checkpoint saved, can resume)

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:85](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L85)

#### checkpoint\_available

> **checkpoint\_available**: `boolean`

#### task\_id

> **task\_id**: `string`

***

### event

> **event**: `"suspended"`

Defined in: [packages/core/src/sse.ts:84](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L84)
