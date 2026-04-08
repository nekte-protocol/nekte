---
title: "Interface: CacheGetResult"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / CacheGetResult

# Interface: CacheGetResult

Defined in: [packages/client/src/cache-store.ts:32](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L32)

Result of a cache lookup, including freshness state

## Properties

### entry

> **entry**: [`CacheStoreEntry`](CacheStoreEntry.md)

Defined in: [packages/client/src/cache-store.ts:33](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L33)

***

### freshness

> **freshness**: `"fresh"` \| `"stale"`

Defined in: [packages/client/src/cache-store.ts:35](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L35)

'fresh' = within TTL, 'stale' = past TTL but within grace, 'expired' = past grace
