---
title: "Interface: HybridStrategyConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / HybridStrategyConfig

# Interface: HybridStrategyConfig

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:17](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L17)

## Extends

- [`SemanticStrategyConfig`](SemanticStrategyConfig.md)

## Properties

### keywordWeight?

> `optional` **keywordWeight?**: `number`

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:19](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L19)

Weight for keyword score (0.0-1.0). Default: 0.3

***

### provider

> **provider**: [`EmbeddingProvider`](EmbeddingProvider.md)

Defined in: [packages/core/src/filtering/semantic-strategy.ts:19](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L19)

#### Inherited from

[`SemanticStrategyConfig`](SemanticStrategyConfig.md).[`provider`](SemanticStrategyConfig.md#provider)

***

### semanticWeight?

> `optional` **semanticWeight?**: `number`

Defined in: [packages/core/src/filtering/hybrid-strategy.ts:21](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/hybrid-strategy.ts#L21)

Weight for semantic score (0.0-1.0). Default: 0.7

***

### thresholdDefault?

> `optional` **thresholdDefault?**: `number`

Defined in: [packages/core/src/filtering/semantic-strategy.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L23)

Default threshold when not specified. Default: 0.3

#### Inherited from

[`SemanticStrategyConfig`](SemanticStrategyConfig.md).[`thresholdDefault`](SemanticStrategyConfig.md#thresholddefault)

***

### topKDefault?

> `optional` **topKDefault?**: `number`

Defined in: [packages/core/src/filtering/semantic-strategy.ts:21](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L21)

Default top_k when not specified in filter call. Default: 10

#### Inherited from

[`SemanticStrategyConfig`](SemanticStrategyConfig.md).[`topKDefault`](SemanticStrategyConfig.md#topkdefault)
