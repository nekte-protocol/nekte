---
title: "Function: parseSseEvent()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / parseSseEvent

# Function: parseSseEvent()

> **parseSseEvent**(`block`): [`SseEvent`](../type-aliases/SseEvent.md) \| `null`

Defined in: [packages/core/src/sse.ts:136](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L136)

Parse a single SSE event block from text/event-stream format.
Returns null if the block is incomplete or a comment.

## Parameters

### block

`string`

## Returns

[`SseEvent`](../type-aliases/SseEvent.md) \| `null`
