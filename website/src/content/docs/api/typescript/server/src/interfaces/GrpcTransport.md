---
title: "Interface: GrpcTransport"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / GrpcTransport

# Interface: GrpcTransport

Defined in: [packages/server/src/grpc-transport.ts:55](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L55)

## Properties

### server

> `readonly` **server**: `unknown`

Defined in: [packages/server/src/grpc-transport.ts:57](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L57)

The underlying gRPC server instance

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/server/src/grpc-transport.ts:59](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L59)

Gracefully close the transport

#### Returns

`Promise`\<`void`\>
