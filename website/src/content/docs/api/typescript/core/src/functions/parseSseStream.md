---
title: "Function: parseSseStream()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / parseSseStream

# Function: parseSseStream()

> **parseSseStream**(`text`): [`SseEvent`](../type-aliases/SseEvent.md)[]

Defined in: [packages/core/src/sse.ts:162](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/sse.ts#L162)

Parse a full SSE stream text into an array of events.
Handles the double-newline separator between events.

## Parameters

### text

`string`

## Returns

[`SseEvent`](../type-aliases/SseEvent.md)[]
