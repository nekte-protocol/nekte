---
title: "Interface: NekteServerConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / NekteServerConfig

# Interface: NekteServerConfig

Defined in: [packages/server/src/server.ts:68](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L68)

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

## Properties

### agent

> **agent**: `string`

Defined in: [packages/server/src/server.ts:70](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L70)

Agent name

***

### auth?

> `optional` **auth?**: `"bearer"` \| `"apikey"` \| `"none"`

Defined in: [packages/server/src/server.ts:74](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L74)

Auth method advertised in agent card

***

### authHandler?

> `optional` **authHandler?**: [`AuthHandler`](../type-aliases/AuthHandler.md)

Defined in: [packages/server/src/server.ts:78](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L78)

Auth handler for HTTP requests. Default: noAuth()

***

### filterStrategy?

> `optional` **filterStrategy?**: `CapabilityFilterStrategy`

Defined in: [packages/server/src/server.ts:80](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L80)

Capability filter strategy. Default: keyword matching

***

### logLevel?

> `optional` **logLevel?**: `LogLevel`

Defined in: [packages/server/src/server.ts:76](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L76)

Log level. Default: 'info'

***

### version?

> `optional` **version?**: `string`

Defined in: [packages/server/src/server.ts:72](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/server.ts#L72)

Agent version
