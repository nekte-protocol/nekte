---
title: "server/src"
---

[**nekte-protocol**](../../index.md)

***

[nekte-protocol](../../index.md) / server/src

# server/src

## Classes

- [CapabilityRegistry](classes/CapabilityRegistry.md)
- [GrpcDelegateStream](classes/GrpcDelegateStream.md)
- [NekteServer](classes/NekteServer.md)
- [SseStream](classes/SseStream.md)
- [TaskNotCancellableError](classes/TaskNotCancellableError.md)
- [TaskNotFoundError](classes/TaskNotFoundError.md)
- [TaskNotResumableError](classes/TaskNotResumableError.md)
- [TaskRegistry](classes/TaskRegistry.md)

## Interfaces

- [CapabilityConfig](interfaces/CapabilityConfig.md)
- [GrpcTransport](interfaces/GrpcTransport.md)
- [GrpcTransportConfig](interfaces/GrpcTransportConfig.md)
- [GrpcWritableStream](interfaces/GrpcWritableStream.md)
- [HandlerContext](interfaces/HandlerContext.md)
- [HttpTransport](interfaces/HttpTransport.md)
- [HttpTransportConfig](interfaces/HttpTransportConfig.md)
- [NekteServerConfig](interfaces/NekteServerConfig.md)
- [RegisteredCapability](interfaces/RegisteredCapability.md)
- [TaskRegistryConfig](interfaces/TaskRegistryConfig.md)
- [WsTransport](interfaces/WsTransport.md)
- [WsTransportConfig](interfaces/WsTransportConfig.md)

## Type Aliases

- [AuthHandler](type-aliases/AuthHandler.md)
- [AuthResult](type-aliases/AuthResult.md)
- [CapabilityHandler](type-aliases/CapabilityHandler.md)
- [DelegateHandler](type-aliases/DelegateHandler.md)
- [TaskRegistryEvent](type-aliases/TaskRegistryEvent.md)
- [TaskRegistryListener](type-aliases/TaskRegistryListener.md)

## Functions

- [apiKeyAuth](functions/apiKeyAuth.md)
- [bearerAuth](functions/bearerAuth.md)
- [createGrpcTransport](functions/createGrpcTransport.md)
- [createHttpTransport](functions/createHttpTransport.md)
- [createWsTransport](functions/createWsTransport.md)
- [noAuth](functions/noAuth.md)
