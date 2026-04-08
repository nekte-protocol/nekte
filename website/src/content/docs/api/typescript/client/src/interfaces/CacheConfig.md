---
title: "Interface: CacheConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / CacheConfig

# Interface: CacheConfig

Defined in: [packages/client/src/cache.ts:34](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L34)

## Properties

### defaultTtlMs?

> `optional` **defaultTtlMs?**: `number`

Defined in: [packages/client/src/cache.ts:36](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L36)

Default TTL for cache entries (ms). Default: 5 minutes

***

### maxEntries?

> `optional` **maxEntries?**: `number`

Defined in: [packages/client/src/cache.ts:38](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L38)

Maximum number of entries. Default: 1000

***

### namespace?

> `optional` **namespace?**: `string`

Defined in: [packages/client/src/cache.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L42)

Key namespace prefix (for multi-environment shared stores)

***

### negativeTtlMs?

> `optional` **negativeTtlMs?**: `number`

Defined in: [packages/client/src/cache.ts:44](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L44)

TTL for negative cache entries (ms). Default: 60_000 (1 minute)

***

### store?

> `optional` **store?**: [`CacheStore`](CacheStore.md)

Defined in: [packages/client/src/cache.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L40)

Pluggable backing store. Default: InMemoryCacheStore
