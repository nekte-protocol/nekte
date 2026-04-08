---
title: "Interface: CapabilityFilterStrategy"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / CapabilityFilterStrategy

# Interface: CapabilityFilterStrategy

Defined in: [packages/core/src/filtering.ts:61](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L61)

Port: filters capabilities given a query.
Strategies implement this to define ranking behavior.

## Methods

### filter()

> **filter**(`capabilities`, `query`, `options?`): `Promise`\<[`FilteredCapability`](FilteredCapability.md)[]\>

Defined in: [packages/core/src/filtering.ts:63](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L63)

Filter and rank capabilities by relevance to query

#### Parameters

##### capabilities

[`FilterableCapability`](FilterableCapability.md)[]

##### query

`string`

##### options?

[`FilterOptions`](FilterOptions.md)

#### Returns

`Promise`\<[`FilteredCapability`](FilteredCapability.md)[]\>

***

### precompute()?

> `optional` **precompute**(`capabilities`): `Promise`\<`void`\>

Defined in: [packages/core/src/filtering.ts:70](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L70)

Optional: precompute embeddings for a set of capabilities

#### Parameters

##### capabilities

[`FilterableCapability`](FilterableCapability.md)[]

#### Returns

`Promise`\<`void`\>
