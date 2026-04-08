---
title: "Function: createWsTransport()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / createWsTransport

# Function: createWsTransport()

> **createWsTransport**(`server`, `config`): [`WsTransport`](../interfaces/WsTransport.md)

Defined in: [packages/server/src/ws-transport.ts:43](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/ws-transport.ts#L43)

Create a WebSocket transport for a NekteServer.
Each incoming message is treated as a JSON-RPC request
and dispatched to server.handleRequest().

## Parameters

### server

[`NekteServer`](../classes/NekteServer.md)

### config

[`WsTransportConfig`](../interfaces/WsTransportConfig.md)

## Returns

[`WsTransport`](../interfaces/WsTransport.md)
