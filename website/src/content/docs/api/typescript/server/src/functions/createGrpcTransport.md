---
title: "Function: createGrpcTransport()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / createGrpcTransport

# Function: createGrpcTransport()

> **createGrpcTransport**(`nekteServer`, `config`): `Promise`\<[`GrpcTransport`](../interfaces/GrpcTransport.md)\>

Defined in: [packages/server/src/grpc-transport.ts:72](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L72)

Create a gRPC transport adapter for a NekteServer.

Requires @grpc/grpc-js and @grpc/proto-loader as peer dependencies.
These are dynamically imported to keep the dependency optional.

## Parameters

### nekteServer

[`NekteServer`](../classes/NekteServer.md)

### config

[`GrpcTransportConfig`](../interfaces/GrpcTransportConfig.md)

## Returns

`Promise`\<[`GrpcTransport`](../interfaces/GrpcTransport.md)\>
