---
title: "Interface: WsTransport"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / WsTransport

# Interface: WsTransport

Defined in: [packages/server/src/ws-transport.ts:29](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/ws-transport.ts#L29)

## Properties

### connections

> `readonly` **connections**: `number`

Defined in: [packages/server/src/ws-transport.ts:33](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/ws-transport.ts#L33)

Number of connected clients

***

### wss

> **wss**: `WebSocketServer`

Defined in: [packages/server/src/ws-transport.ts:31](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/ws-transport.ts#L31)

The underlying WebSocketServer

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/server/src/ws-transport.ts:35](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/ws-transport.ts#L35)

Gracefully close the transport

#### Returns

`Promise`\<`void`\>
