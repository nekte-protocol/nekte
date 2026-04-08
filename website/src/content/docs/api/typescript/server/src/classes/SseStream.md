---
title: "Class: SseStream"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / SseStream

# Class: SseStream

Defined in: [packages/server/src/sse-stream.ts:20](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L20)

## Constructors

### Constructor

> **new SseStream**(`res`): `SseStream`

Defined in: [packages/server/src/sse-stream.ts:24](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L24)

#### Parameters

##### res

`ServerResponse`

#### Returns

`SseStream`

## Accessors

### isClosed

#### Get Signature

> **get** **isClosed**(): `boolean`

Defined in: [packages/server/src/sse-stream.ts:125](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L125)

Whether the stream has been closed

##### Returns

`boolean`

## Methods

### cancelled()

> **cancelled**(`taskId`, `previousStatus`, `reason?`): `void`

Defined in: [packages/server/src/sse-stream.ts:73](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L73)

Send a cancelled event

#### Parameters

##### taskId

`string`

##### previousStatus

`TaskStatus`

##### reason?

`string`

#### Returns

`void`

***

### close()

> **close**(): `void`

Defined in: [packages/server/src/sse-stream.ts:118](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L118)

Close the stream

#### Returns

`void`

***

### complete()

> **complete**(`taskId`, `out`, `meta?`): `void`

Defined in: [packages/server/src/sse-stream.ts:51](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L51)

Send completion event and close the stream

#### Parameters

##### taskId

`string`

##### out

`MultiLevelResult`

##### meta?

###### ms?

`number`

###### tokens_used?

`number`

#### Returns

`void`

***

### error()

> **error**(`code`, `message`, `taskId?`): `void`

Defined in: [packages/server/src/sse-stream.ts:64](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L64)

Send error event and close the stream

#### Parameters

##### code

`number`

##### message

`string`

##### taskId?

`string`

#### Returns

`void`

***

### partial()

> **partial**(`out`, `resolvedLevel?`): `void`

Defined in: [packages/server/src/sse-stream.ts:43](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L43)

Send a partial result (preliminary data)

#### Parameters

##### out

`Record`\<`string`, `unknown`\>

##### resolvedLevel?

`DetailLevel`

#### Returns

`void`

***

### progress()

> **progress**(`processed`, `total`, `message?`): `void`

Defined in: [packages/server/src/sse-stream.ts:35](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L35)

Send a progress event

#### Parameters

##### processed

`number`

##### total

`number`

##### message?

`string`

#### Returns

`void`

***

### resumed()

> **resumed**(`taskId`, `fromCheckpoint`): `void`

Defined in: [packages/server/src/sse-stream.ts:90](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L90)

Send a resumed event

#### Parameters

##### taskId

`string`

##### fromCheckpoint

`boolean`

#### Returns

`void`

***

### send()

> **send**(`event`): `void`

Defined in: [packages/server/src/sse-stream.ts:106](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L106)

Send a raw SSE event with backpressure awareness

#### Parameters

##### event

`SseEvent`

#### Returns

`void`

***

### statusChange()

> **statusChange**(`taskId`, `from`, `to`, `reason?`): `void`

Defined in: [packages/server/src/sse-stream.ts:98](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L98)

Send a status change event

#### Parameters

##### taskId

`string`

##### from

`TaskStatus`

##### to

`TaskStatus`

##### reason?

`string`

#### Returns

`void`

***

### suspended()

> **suspended**(`taskId`, `checkpointAvailable`): `void`

Defined in: [packages/server/src/sse-stream.ts:82](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/sse-stream.ts#L82)

Send a suspended event

#### Parameters

##### taskId

`string`

##### checkpointAvailable

`boolean`

#### Returns

`void`
