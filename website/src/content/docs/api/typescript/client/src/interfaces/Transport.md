---
title: "Interface: Transport"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / Transport

# Interface: Transport

Defined in: [packages/client/src/transport.ts:18](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L18)

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/client/src/transport.ts:29](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L29)

Close the transport and release resources.

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**\<`T`\>(`url`): `Promise`\<`T`\>

Defined in: [packages/client/src/transport.ts:26](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L26)

Perform a plain GET request (e.g., Agent Card discovery).

#### Type Parameters

##### T

`T`

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`T`\>

***

### rpc()

> **rpc**\<`T`\>(`method`, `params`): `Promise`\<`NekteResponse`\<`T`\>\>

Defined in: [packages/client/src/transport.ts:20](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L20)

Send a JSON-RPC request and receive the parsed response.

#### Type Parameters

##### T

`T`

#### Parameters

##### method

`NekteMethod`

##### params

`unknown`

#### Returns

`Promise`\<`NekteResponse`\<`T`\>\>

***

### stream()

> **stream**(`method`, `params`): `AsyncGenerator`\<`SseEvent`\>

Defined in: [packages/client/src/transport.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/transport.ts#L23)

Send a request and receive a stream of SSE events.

#### Parameters

##### method

`NekteMethod`

##### params

`unknown`

#### Returns

`AsyncGenerator`\<`SseEvent`\>
