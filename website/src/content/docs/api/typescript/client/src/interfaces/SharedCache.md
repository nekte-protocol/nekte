---
title: "Interface: SharedCache"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / SharedCache

# Interface: SharedCache

Defined in: [packages/client/src/shared-cache.ts:34](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L34)

Port: a shared cache that multiple clients can reference.

## Methods

### notifyInvalidation()

> **notifyInvalidation**(`key`): `void`

Defined in: [packages/client/src/shared-cache.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L40)

Notify all subscribers of an invalidation

#### Parameters

##### key

`string`

#### Returns

`void`

***

### onInvalidate()

> **onInvalidate**(`callback`): () => `void`

Defined in: [packages/client/src/shared-cache.ts:38](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L38)

Subscribe to invalidation events

#### Parameters

##### callback

(`key`) => `void`

#### Returns

() => `void`

***

### store()

> **store**(): [`CacheStore`](CacheStore.md)

Defined in: [packages/client/src/shared-cache.ts:36](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L36)

Get the shared backing store

#### Returns

[`CacheStore`](CacheStore.md)
