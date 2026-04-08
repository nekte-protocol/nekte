---
title: "Class: NekteServer"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / NekteServer

# Class: NekteServer

Defined in: [packages/server/src/server.ts:87](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L87)

@nekte/server — NEKTE Protocol Server

Server library for building NEKTE agents. Register typed
capabilities with Zod schemas, auto-generate version hashes,
and serve via HTTP with multi-level result compression.

## Example

```ts
const server = new NekteServer({ agent: 'nlp-worker', version: '1.0.0' });
server.capability('sentiment', {
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ score: z.number() }),
  category: 'nlp',
  description: 'Analyze text sentiment',
  handler: async (input) => ({ score: 0.9 }),
});
server.listen(4001);
```

## Constructors

### Constructor

> **new NekteServer**(`config`): `NekteServer`

Defined in: [packages/server/src/server.ts:106](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L106)

#### Parameters

##### config

[`NekteServerConfig`](../interfaces/NekteServerConfig.md)

#### Returns

`NekteServer`

## Properties

### config

> `readonly` **config**: [`NekteServerConfig`](../interfaces/NekteServerConfig.md)

Defined in: [packages/server/src/server.ts:88](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L88)

***

### delegateHandler?

> `optional` **delegateHandler?**: [`DelegateHandler`](../type-aliases/DelegateHandler.md)

Defined in: [packages/server/src/server.ts:95](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L95)

**`Internal`**

Used by HTTP/gRPC transport for streaming delegation

***

### log

> `readonly` **log**: `Logger`

Defined in: [packages/server/src/server.ts:92](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L92)

***

### registry

> `readonly` **registry**: [`CapabilityRegistry`](CapabilityRegistry.md)

Defined in: [packages/server/src/server.ts:89](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L89)

***

### tasks

> `readonly` **tasks**: [`TaskRegistry`](TaskRegistry.md)

Defined in: [packages/server/src/server.ts:91](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L91)

Task lifecycle registry — tracks active tasks, enables cancel/resume

## Methods

### agentCard()

> **agentCard**(`endpoint`): `AgentCard`

Defined in: [packages/server/src/server.ts:156](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L156)

Generate the Agent Card for this server.

#### Parameters

##### endpoint

`string`

#### Returns

`AgentCard`

***

### capability()

> **capability**\<`TIn`, `TOut`\>(`id`, `config`): `this`

Defined in: [packages/server/src/server.ts:139](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L139)

Register a capability with typed schemas.

#### Type Parameters

##### TIn

`TIn`

##### TOut

`TOut`

#### Parameters

##### id

`string`

##### config

[`CapabilityConfig`](../interfaces/CapabilityConfig.md)\<`TIn`, `TOut`\>

#### Returns

`this`

***

### handleRequest()

> **handleRequest**(`request`): `Promise`\<`NekteResponse`\<`unknown`\>\>

Defined in: [packages/server/src/server.ts:170](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L170)

Handle a NEKTE JSON-RPC request.

#### Parameters

##### request

`NekteRequest`

#### Returns

`Promise`\<`NekteResponse`\<`unknown`\>\>

***

### listen()

> **listen**(`port`, `hostname?`): `Promise`\<`void`\>

Defined in: [packages/server/src/server.ts:554](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L554)

Start an HTTP server for this NEKTE agent.
Convenience wrapper around createHttpTransport().

#### Parameters

##### port

`number`

##### hostname?

`string` = `'0.0.0.0'`

#### Returns

`Promise`\<`void`\>

***

### onDelegate()

> **onDelegate**(`handler`): `this`

Defined in: [packages/server/src/server.ts:148](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L148)

Register a streaming delegate handler.
When set, `nekte.delegate` uses SSE to stream progress/results.

#### Parameters

##### handler

[`DelegateHandler`](../type-aliases/DelegateHandler.md)

#### Returns

`this`
