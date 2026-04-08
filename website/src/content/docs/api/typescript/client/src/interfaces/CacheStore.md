---
title: "Interface: CacheStore"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / CacheStore

# Interface: CacheStore

Defined in: [packages/client/src/cache-store.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L42)

Port: backing store for cache entries.
Implement this to use Redis, shared memory, etc.

## Properties

### size

> `readonly` **size**: `number`

Defined in: [packages/client/src/cache-store.ts:51](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L51)

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/client/src/cache-store.ts:52](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L52)

#### Returns

`void`

***

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/client/src/cache-store.ts:49](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L49)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### get()

> **get**(`key`): [`CacheGetResult`](CacheGetResult.md) \| `undefined`

Defined in: [packages/client/src/cache-store.ts:47](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L47)

Get an entry. Returns undefined if not found or fully expired.
Returns { entry, freshness } where freshness indicates TTL state.

#### Parameters

##### key

`string`

#### Returns

[`CacheGetResult`](CacheGetResult.md) \| `undefined`

***

### keys()

> **keys**(): `IterableIterator`\<`string`\>

Defined in: [packages/client/src/cache-store.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L50)

#### Returns

`IterableIterator`\<`string`\>

***

### set()

> **set**(`key`, `entry`): `void`

Defined in: [packages/client/src/cache-store.ts:48](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache-store.ts#L48)

#### Parameters

##### key

`string`

##### entry

[`CacheStoreEntry`](CacheStoreEntry.md)

#### Returns

`void`
