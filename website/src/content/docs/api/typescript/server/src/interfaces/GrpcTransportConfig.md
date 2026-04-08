---
title: "Interface: GrpcTransportConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / GrpcTransportConfig

# Interface: GrpcTransportConfig

Defined in: [packages/server/src/grpc-transport.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L42)

## Properties

### hostname?

> `optional` **hostname?**: `string`

Defined in: [packages/server/src/grpc-transport.ts:46](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L46)

Optional hostname. Default: '0.0.0.0'

***

### logLevel?

> `optional` **logLevel?**: `LogLevel`

Defined in: [packages/server/src/grpc-transport.ts:48](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L48)

Log level. Default: 'info'

***

### port

> **port**: `number`

Defined in: [packages/server/src/grpc-transport.ts:44](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L44)

Port for gRPC server

***

### protoPath?

> `optional` **protoPath?**: `string`

Defined in: [packages/server/src/grpc-transport.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L50)

Path to .proto file. Default: auto-resolved from @nekte/core

***

### taskRegistry?

> `optional` **taskRegistry?**: [`TaskRegistry`](../classes/TaskRegistry.md)

Defined in: [packages/server/src/grpc-transport.ts:52](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/grpc-transport.ts#L52)

Task registry for lifecycle methods. Optional — lifecycle RPCs fail without it.
