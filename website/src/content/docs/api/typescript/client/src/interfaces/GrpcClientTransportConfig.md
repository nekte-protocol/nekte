---
title: "Interface: GrpcClientTransportConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / GrpcClientTransportConfig

# Interface: GrpcClientTransportConfig

Defined in: [packages/client/src/grpc-transport.ts:33](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/grpc-transport.ts#L33)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [packages/client/src/grpc-transport.ts:35](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/grpc-transport.ts#L35)

gRPC server address (host:port)

***

### protoPath?

> `optional` **protoPath?**: `string`

Defined in: [packages/client/src/grpc-transport.ts:37](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/grpc-transport.ts#L37)

Path to .proto file. Default: auto-resolved from @nekte/core
