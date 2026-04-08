---
title: "Class: RequestCoalescer"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / RequestCoalescer

# Class: RequestCoalescer

Defined in: [packages/client/src/request-coalescer.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/request-coalescer.ts#L23)

Request Coalescer — Infrastructure Service

Prevents thundering herd / cache stampede by deduplicating
concurrent requests for the same key. If a refresh is in-flight
for key K, subsequent callers wait for the same Promise instead
of launching duplicate network requests.

## Example

```ts
const coalescer = new RequestCoalescer();

// These 3 concurrent calls produce only 1 actual fetch:
const [r1, r2, r3] = await Promise.all([
  coalescer.coalesce('key', () => fetch('/api/data')),
  coalescer.coalesce('key', () => fetch('/api/data')),
  coalescer.coalesce('key', () => fetch('/api/data')),
]);
// r1 === r2 === r3 (same resolved value)
```

## Constructors

### Constructor

> **new RequestCoalescer**(): `RequestCoalescer`

#### Returns

`RequestCoalescer`

## Accessors

### pending

#### Get Signature

> **get** **pending**(): `number`

Defined in: [packages/client/src/request-coalescer.ts:43](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/request-coalescer.ts#L43)

Number of in-flight requests

##### Returns

`number`

## Methods

### coalesce()

> **coalesce**\<`T`\>(`key`, `fn`): `Promise`\<`T`\>

Defined in: [packages/client/src/request-coalescer.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/request-coalescer.ts#L30)

Execute `fn` for `key`, or join an in-flight request if one exists.
The Promise is removed from the map once resolved (success or failure).

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
