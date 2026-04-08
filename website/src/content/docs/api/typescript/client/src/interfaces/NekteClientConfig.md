---
title: "Interface: NekteClientConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / NekteClientConfig

# Interface: NekteClientConfig

Defined in: [packages/client/src/client.ts:89](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L89)

@nekte/client — NEKTE Protocol Client

Client library for interacting with NEKTE agents.
Features progressive discovery (L0/L1/L2), zero-schema
invocation via version hash caching, and budget-aware requests.

## Example

```ts
const client = new NekteClient('http://localhost:4001');
const catalog = await client.catalog();
const result = await client.invoke('sentiment', {
  input: { text: 'Great product!' },
  budget: { max_tokens: 50, detail_level: 'minimal' },
});
```

## Properties

### cache?

> `optional` **cache?**: [`CacheConfig`](CacheConfig.md)

Defined in: [packages/client/src/client.ts:91](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L91)

Cache configuration

***

### defaultBudget?

> `optional` **defaultBudget?**: `Partial`\<`TokenBudget`\>

Defined in: [packages/client/src/client.ts:95](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L95)

Default token budget for requests

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/client/src/client.ts:97](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L97)

HTTP headers to include in requests (e.g. auth)

***

### sharedCache?

> `optional` **sharedCache?**: [`SharedCache`](SharedCache.md)

Defined in: [packages/client/src/client.ts:93](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L93)

Shared cache for cross-agent cache sharing

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/client/src/client.ts:99](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L99)

Request timeout in ms. Default: 30000

***

### transport?

> `optional` **transport?**: [`Transport`](Transport.md)

Defined in: [packages/client/src/client.ts:101](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L101)

Pluggable transport adapter. Default: HttpTransport.
