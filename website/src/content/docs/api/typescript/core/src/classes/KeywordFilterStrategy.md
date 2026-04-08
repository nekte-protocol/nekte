---
title: "Class: KeywordFilterStrategy"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / KeywordFilterStrategy

# Class: KeywordFilterStrategy

Defined in: [packages/core/src/filtering/keyword-strategy.ts:15](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/keyword-strategy.ts#L15)

Port: filters capabilities given a query.
Strategies implement this to define ranking behavior.

## Implements

- [`CapabilityFilterStrategy`](../interfaces/CapabilityFilterStrategy.md)

## Constructors

### Constructor

> **new KeywordFilterStrategy**(): `KeywordFilterStrategy`

#### Returns

`KeywordFilterStrategy`

## Methods

### filter()

> **filter**(`capabilities`, `query`, `options?`): `Promise`\<[`FilteredCapability`](../interfaces/FilteredCapability.md)[]\>

Defined in: [packages/core/src/filtering/keyword-strategy.ts:16](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/keyword-strategy.ts#L16)

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
