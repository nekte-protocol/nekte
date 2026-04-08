---
title: "Interface: DelegateStream"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / DelegateStream

# Interface: DelegateStream

Defined in: [packages/client/src/transport.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L50)

A delegate stream with lifecycle control.

Returned by `client.delegateStream()`. Iterate `events` to consume
SSE events; call `cancel()` to abort the task server-side.

## Example

```ts
const stream = client.delegateStream(task);
for await (const event of stream.events) {
  if (shouldAbort) await stream.cancel('user requested');
}
```

## Properties

### events

> `readonly` **events**: `AsyncGenerator`\<`SseEvent`\>

Defined in: [packages/client/src/transport.ts:52](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L52)

The async generator yielding SSE events

***

### taskId

> `readonly` **taskId**: `string`

Defined in: [packages/client/src/transport.ts:56](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L56)

The task ID being tracked

## Methods

### cancel()

> **cancel**(`reason?`): `Promise`\<`void`\>

Defined in: [packages/client/src/transport.ts:54](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L54)

Cancel the task server-side and close the stream

#### Parameters

##### reason?

`string`

#### Returns

`Promise`\<`void`\>
