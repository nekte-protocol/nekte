---
title: "Class: CapabilityCache"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / CapabilityCache

# Class: CapabilityCache

Defined in: [packages/client/src/cache.ts:58](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L58)

## Constructors

### Constructor

> **new CapabilityCache**(`config?`): `CapabilityCache`

Defined in: [packages/client/src/cache.ts:73](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L73)

#### Parameters

##### config?

[`CacheConfig`](../interfaces/CacheConfig.md)

#### Returns

`CapabilityCache`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/client/src/cache.ts:191](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L191)

#### Returns

`void`

***

### get()

> **get**(`agentId`, `capId`, `level`): `Capability` \| `undefined`

Defined in: [packages/client/src/cache.ts:135](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L135)

Get a cached capability at a specific level.

#### Parameters

##### agentId

`string`

##### capId

`string`

##### level

`DiscoveryLevel`

#### Returns

`Capability` \| `undefined`

***

### getHash()

> **getHash**(`agentId`, `capId`): `string` \| `undefined`

Defined in: [packages/client/src/cache.ts:127](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L127)

Get the version hash for a capability.
Supports stale-while-revalidate: stale entries trigger background refresh.

#### Parameters

##### agentId

`string`

##### capId

`string`

#### Returns

`string` \| `undefined`

***

### invalidate()

> **invalidate**(`agentId`, `capId`): `void`

Defined in: [packages/client/src/cache.ts:177](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L177)

#### Parameters

##### agentId

`string`

##### capId

`string`

#### Returns

`void`

***

### invalidateAgent()

> **invalidateAgent**(`agentId`): `void`

Defined in: [packages/client/src/cache.ts:181](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L181)

#### Parameters

##### agentId

`string`

#### Returns

`void`

***

### isNegative()

> **isNegative**(`agentId`, `capId`): `boolean`

Defined in: [packages/client/src/cache.ts:162](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L162)

Check if a capability is negatively cached (known not to exist).

#### Parameters

##### agentId

`string`

##### capId

`string`

#### Returns

`boolean`

***

### isValid()

> **isValid**(`agentId`, `capId`, `hash`): `boolean`

Defined in: [packages/client/src/cache.ts:143](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L143)

Check if a version hash is still valid.

#### Parameters

##### agentId

`string`

##### capId

`string`

##### hash

`string`

#### Returns

`boolean`

***

### onRevalidate()

> **onRevalidate**(`fn`): `void`

Defined in: [packages/client/src/cache.ts:85](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L85)

Register the background revalidation function.
Wired by NekteClient to trigger discover() for stale entries.

#### Parameters

##### fn

[`RevalidationFn`](../type-aliases/RevalidationFn.md)

#### Returns

`void`

***

### set()

> **set**(`agentId`, `cap`, `level`, `ttlMs?`): `void`

Defined in: [packages/client/src/cache.ts:93](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L93)

Store a capability at a given discovery level.
Clears any negative cache entry for this capability.

#### Parameters

##### agentId

`string`

##### cap

`Capability`

##### level

`DiscoveryLevel`

##### ttlMs?

`number`

#### Returns

`void`

***

### setNegative()

> **setNegative**(`agentId`, `capId`): `void`

Defined in: [packages/client/src/cache.ts:155](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L155)

Record that a capability does NOT exist at an agent.
Subsequent lookups return undefined without hitting the store.

#### Parameters

##### agentId

`string`

##### capId

`string`

#### Returns

`void`

***

### stats()

> **stats**(): `object`

Defined in: [packages/client/src/cache.ts:197](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/cache.ts#L197)

#### Returns

`object`

##### agents

> **agents**: `number`

##### negatives

> **negatives**: `number`

##### size

> **size**: `number`
