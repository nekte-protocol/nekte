---
title: "Interface: GrpcWritableStream"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / GrpcWritableStream

# Interface: GrpcWritableStream

Defined in: [packages/server/src/grpc-stream.ts:17](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L17)

Minimal gRPC writable stream interface (no dependency on @grpc/grpc-js)

## Methods

### end()

> **end**(): `void`

Defined in: [packages/server/src/grpc-stream.ts:19](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L19)

#### Returns

`void`

***

### write()

> **write**(`message`): `boolean`

Defined in: [packages/server/src/grpc-stream.ts:18](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-stream.ts#L18)

#### Parameters

##### message

`unknown`

#### Returns

`boolean`
