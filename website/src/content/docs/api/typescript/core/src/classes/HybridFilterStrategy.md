---
title: "Class: HybridFilterStrategy"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / HybridFilterStrategy

# Class: HybridFilterStrategy

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:24](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L24)

Port: filters capabilities given a query.
Strategies implement this to define ranking behavior.

## Implements

- [`CapabilityFilterStrategy`](../interfaces/CapabilityFilterStrategy.md)

## Constructors

### Constructor

> **new HybridFilterStrategy**(`config`): `HybridFilterStrategy`

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L30)

#### Parameters

##### config

[`HybridStrategyConfig`](../interfaces/HybridStrategyConfig.md)

#### Returns

`HybridFilterStrategy`

## Methods

### filter()

> **filter**(`capabilities`, `query`, `options?`): `Promise`\<[`FilteredCapability`](../interfaces/FilteredCapability.md)[]\>

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:41](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L41)

Filter and rank capabilities by relevance to query

#### Parameters

##### capabilities

[`FilterableCapability`](../interfaces/FilterableCapability.md)[]

##### query

`string`

##### options?

[`FilterOptions`](../interfaces/FilterOptions.md)

#### Returns

`Promise`\<[`FilteredCapability`](../interfaces/FilteredCapability.md)[]\>

#### Implementation of

[`CapabilityFilterStrategy`](../interfaces/CapabilityFilterStrategy.md).[`filter`](../interfaces/CapabilityFilterStrategy.md#filter)

***

### precompute()

> **precompute**(`capabilities`): `Promise`\<`void`\>

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:37](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L37)

Optional: precompute embeddings for a set of capabilities

#### Parameters

##### capabilities

[`FilterableCapability`](../interfaces/FilterableCapability.md)[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CapabilityFilterStrategy`](../interfaces/CapabilityFilterStrategy.md).[`precompute`](../interfaces/CapabilityFilterStrategy.md#precompute)
