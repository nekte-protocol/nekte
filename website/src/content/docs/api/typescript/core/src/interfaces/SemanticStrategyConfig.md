---
title: "Interface: SemanticStrategyConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / SemanticStrategyConfig

# Interface: SemanticStrategyConfig

Defined in: [packages/core/src/filtering/semantic-strategy.ts:18](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L18)

## Extended by

- [`HybridStrategyConfig`](HybridStrategyConfig.md)

## Properties

### provider

> **provider**: [`EmbeddingProvider`](EmbeddingProvider.md)

Defined in: [packages/core/src/filtering/semantic-strategy.ts:19](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L19)

***

### thresholdDefault?

> `optional` **thresholdDefault?**: `number`

Defined in: [packages/core/src/filtering/semantic-strategy.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L23)

Default threshold when not specified. Default: 0.3

***

### topKDefault?

> `optional` **topKDefault?**: `number`

Defined in: [packages/core/src/filtering/semantic-strategy.ts:21](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering/semantic-strategy.ts#L21)

Default top_k when not specified in filter call. Default: 10
