---
title: "Interface: DiscoverParams"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / DiscoverParams

# Interface: DiscoverParams

Defined in: [packages/core/src/types.ts:234](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L234)

## Properties

### filter?

> `optional` **filter?**: `object`

Defined in: [packages/core/src/types.ts:236](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L236)

#### category?

> `optional` **category?**: `string`

#### id?

> `optional` **id?**: `string`

#### query?

> `optional` **query?**: `string`

#### threshold?

> `optional` **threshold?**: `number`

Minimum relevance score 0.0-1.0 (for ranked/semantic filtering)

#### top\_k?

> `optional` **top\_k?**: `number`

Max results to return (for ranked/semantic filtering)

***

### level

> **level**: [`DiscoveryLevel`](../type-aliases/DiscoveryLevel.md)

Defined in: [packages/core/src/types.ts:235](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L235)
