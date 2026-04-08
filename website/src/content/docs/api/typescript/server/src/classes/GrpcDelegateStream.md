---
title: "Class: GrpcDelegateStream"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / GrpcDelegateStream

# Class: GrpcDelegateStream

Defined in: [packages/server/src/grpc-stream.ts:22](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L22)

## Constructors

### Constructor

> **new GrpcDelegateStream**(`stream`): `GrpcDelegateStream`

Defined in: [packages/server/src/grpc-stream.ts:26](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L26)

#### Parameters

##### stream

[`GrpcWritableStream`](../interfaces/GrpcWritableStream.md)

#### Returns

`GrpcDelegateStream`

## Accessors

### isClosed

#### Get Signature

> **get** **isClosed**(): `boolean`

Defined in: [packages/server/src/grpc-stream.ts:116](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L116)

Whether the stream has been closed

##### Returns

`boolean`

## Methods

### cancelled()

> **cancelled**(`taskId`, `previousStatus`, `reason?`): `void`

Defined in: [packages/server/src/grpc-stream.ts:69](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L69)

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

Defined in: [packages/server/src/grpc-stream.ts:109](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L109)

Close the gRPC stream

#### Returns

`void`

***

### complete()

> **complete**(`taskId`, `out`, `meta?`): `void`

Defined in: [packages/server/src/grpc-stream.ts:47](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L47)

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

Defined in: [packages/server/src/grpc-stream.ts:60](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L60)

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

Defined in: [packages/server/src/grpc-stream.ts:39](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L39)

Send a partial result

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

Defined in: [packages/server/src/grpc-stream.ts:31](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L31)

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

Defined in: [packages/server/src/grpc-stream.ts:86](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L86)

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

Defined in: [packages/server/src/grpc-stream.ts:102](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L102)

Send a raw SSE event (converted to proto)

#### Parameters

##### event

`SseEvent`

#### Returns

`void`

***

### statusChange()

> **statusChange**(`taskId`, `from`, `to`, `reason?`): `void`

Defined in: [packages/server/src/grpc-stream.ts:94](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L94)

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

Defined in: [packages/server/src/grpc-stream.ts:78](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L78)

Send a suspended event

#### Parameters

##### taskId

`string`

##### checkpointAvailable

`boolean`

#### Returns

`void`
