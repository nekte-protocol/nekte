---
title: "Interface: ProtoContextEnvelope"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / ProtoContextEnvelope

# Interface: ProtoContextEnvelope

Defined in: [packages/core/src/grpc-types.ts:125](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L125)

Proto ContextEnvelope message shape

## Properties

### budget\_hint?

> `optional` **budget\_hint?**: `number`

Defined in: [packages/core/src/grpc-types.ts:131](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L131)

***

### compression

> **compression**: `string`

Defined in: [packages/core/src/grpc-types.ts:128](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L128)

***

### data

> **data**: `Uint8Array`

Defined in: [packages/core/src/grpc-types.ts:127](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L127)

***

### id

> **id**: `string`

Defined in: [packages/core/src/grpc-types.ts:126](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L126)

***

### permissions

> **permissions**: `object`

Defined in: [packages/core/src/grpc-types.ts:129](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L129)

#### derive

> **derive**: `boolean`

#### forward

> **forward**: `boolean`

#### persist

> **persist**: `boolean`

***

### ttl\_s

> **ttl\_s**: `number`

Defined in: [packages/core/src/grpc-types.ts:130](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L130)
