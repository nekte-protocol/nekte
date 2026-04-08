---
title: "Function: createGrpcClientTransport()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / createGrpcClientTransport

# Function: createGrpcClientTransport()

> **createGrpcClientTransport**(`config`): `Promise`\<[`Transport`](../interfaces/Transport.md)\>

Defined in: [packages/client/src/grpc-transport.ts:63](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/grpc-transport.ts#L63)

Create a gRPC client transport.
Dynamically imports @grpc/grpc-js — it's an optional peer dependency.

## Parameters

### config

[`GrpcClientTransportConfig`](../interfaces/GrpcClientTransportConfig.md)

## Returns

`Promise`\<[`Transport`](../interfaces/Transport.md)\>
