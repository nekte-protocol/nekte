---
title: "Interface: CacheStoreEntry"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / CacheStoreEntry

# Interface: CacheStoreEntry

Defined in: [packages/client/src/cache-store.ts:21](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L21)

Entry stored in the cache

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/client/src/cache-store.ts:26](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L26)

Number of times this entry has been accessed (for GDSF weighting)

***

### cachedAt

> **cachedAt**: `number`

Defined in: [packages/client/src/cache-store.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L23)

***

### data

> **data**: `unknown`

Defined in: [packages/client/src/cache-store.ts:22](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L22)

***

### tokenCost

> **tokenCost**: `number`

Defined in: [packages/client/src/cache-store.ts:28](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L28)

Token cost to re-fetch this entry (for GDSF weighting)

***

### ttlMs

> **ttlMs**: `number`

Defined in: [packages/client/src/cache-store.ts:24](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L24)
