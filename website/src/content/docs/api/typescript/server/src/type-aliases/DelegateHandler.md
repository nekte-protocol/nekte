---
title: "Type Alias: DelegateHandler"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / DelegateHandler

# Type Alias: DelegateHandler

> **DelegateHandler** = (`task`, `stream`, `context`, `signal`) => `Promise`\<`void`\>

Defined in: [packages/server/src/server.ts:56](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L56)

DelegateHandler — the application-layer contract for task delegation.

Every handler receives an AbortSignal for cooperative cancellation.
The stream adapter (SSE or gRPC) is injected by the transport layer —
handlers are transport-agnostic.

## Parameters

### task

`Task`

### stream

[`SseStream`](../classes/SseStream.md)

### context

`ContextEnvelope` \| `undefined`

### signal

`AbortSignal`

## Returns

`Promise`\<`void`\>
