---
title: "Interface: SseCompleteEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SseCompleteEvent

# Interface: SseCompleteEvent

Defined in: [packages/core/src/sse.ts:49](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L49)

Task completed successfully

## Properties

### data

> **data**: `object`

Defined in: [packages/core/src/sse.ts:51](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L51)

#### meta?

> `optional` **meta?**: `object`

##### meta.ms?

> `optional` **ms?**: `number`

##### meta.tokens\_used?

> `optional` **tokens\_used?**: `number`

#### out

> **out**: [`MultiLevelResult`](MultiLevelResult.md)

#### status

> **status**: `"completed"`

#### task\_id

> **task\_id**: `string`

***

### event

> **event**: `"complete"`

Defined in: [packages/core/src/sse.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L50)
