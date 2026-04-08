---
title: "Class: SharedInMemoryCache"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / SharedInMemoryCache

# Class: SharedInMemoryCache

Defined in: [packages/client/src/shared-cache.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L50)

In-memory shared cache with invalidation notifications.

## Implements

- [`SharedCache`](../interfaces/SharedCache.md)

## Constructors

### Constructor

> **new SharedInMemoryCache**(`config?`): `SharedInMemoryCache`

Defined in: [packages/client/src/shared-cache.ts:54](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L54)

#### Parameters

##### config?

`InMemoryStoreConfig`

#### Returns

`SharedInMemoryCache`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/client/src/shared-cache.ts:74](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L74)

Current store size

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/client/src/shared-cache.ts:79](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L79)

Clear the entire shared store

#### Returns

`void`

***

### notifyInvalidation()

> **notifyInvalidation**(`key`): `void`

Defined in: [packages/client/src/shared-cache.ts:67](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L67)

Notify all subscribers of an invalidation

#### Parameters

##### key

`string`

#### Returns

`void`

#### Implementation of

[`SharedCache`](../interfaces/SharedCache.md).[`notifyInvalidation`](../interfaces/SharedCache.md#notifyinvalidation)

***

### onInvalidate()

> **onInvalidate**(`callback`): () => `void`

Defined in: [packages/client/src/shared-cache.ts:62](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L62)

Subscribe to invalidation events

#### Parameters

##### callback

(`key`) => `void`

#### Returns

() => `void`

#### Implementation of

[`SharedCache`](../interfaces/SharedCache.md).[`onInvalidate`](../interfaces/SharedCache.md#oninvalidate)

***

### store()

> **store**(): [`CacheStore`](../interfaces/CacheStore.md)

Defined in: [packages/client/src/shared-cache.ts:58](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/shared-cache.ts#L58)

Get the shared backing store

#### Returns

[`CacheStore`](../interfaces/CacheStore.md)

#### Implementation of

[`SharedCache`](../interfaces/SharedCache.md).[`store`](../interfaces/SharedCache.md#store)
