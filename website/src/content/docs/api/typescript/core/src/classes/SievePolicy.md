---
title: "Class: SievePolicy<K>"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SievePolicy

# Class: SievePolicy\<K\>

Defined in: [packages/core/src/cache/sieve-policy.ts:22](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L22)

@nekte/core/cache — Cache Domain Layer

Pure domain logic for cache policies. No I/O, no side effects.
Used by client-side cache adapters.

## Type Parameters

### K

`K`

## Constructors

### Constructor

> **new SievePolicy**\<`K`\>(): `SievePolicy`\<`K`\>

#### Returns

`SievePolicy`\<`K`\>

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/core/src/cache/sieve-policy.ts:28](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L28)

##### Returns

`number`

## Methods

### access()

> **access**(`key`): `void`

Defined in: [packages/core/src/cache/sieve-policy.ts:33](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L33)

Record an access — mark visited (no reordering)

#### Parameters

##### key

`K`

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [packages/core/src/cache/sieve-policy.ts:94](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L94)

Clear all state

#### Returns

`void`

***

### delete()

> **delete**(`key`): `void`

Defined in: [packages/core/src/cache/sieve-policy.ts:88](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L88)

Remove a specific key from the policy

#### Parameters

##### key

`K`

#### Returns

`void`

***

### evict()

> **evict**(): `K` \| `undefined`

Defined in: [packages/core/src/cache/sieve-policy.ts:57](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L57)

Evict one entry using the SIEVE hand. Returns the evicted key, or undefined if empty.

#### Returns

`K` \| `undefined`

***

### has()

> **has**(`key`): `boolean`

Defined in: [packages/core/src/cache/sieve-policy.ts:101](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L101)

#### Parameters

##### key

`K`

#### Returns

`boolean`

***

### insert()

> **insert**(`key`): `void`

Defined in: [packages/core/src/cache/sieve-policy.ts:39](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/cache/sieve-policy.ts#L39)

Insert a new key at the tail

#### Parameters

##### key

`K`

#### Returns

`void`
