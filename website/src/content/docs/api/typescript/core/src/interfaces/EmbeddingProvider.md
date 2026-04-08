---
title: "Interface: EmbeddingProvider"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / EmbeddingProvider

# Interface: EmbeddingProvider

Defined in: [packages/core/src/filtering.ts:50](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L50)

Port: computes embeddings for text.
Users implement this with their preferred provider (OpenAI, Voyage, local model, etc.)

## Methods

### dimensions()

> **dimensions**(): `number`

Defined in: [packages/core/src/filtering.ts:54](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L54)

Embedding dimensionality

#### Returns

`number`

***

### embed()

> **embed**(`texts`): `Promise`\<[`Embedding`](../type-aliases/Embedding.md)[]\>

Defined in: [packages/core/src/filtering.ts:52](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/filtering.ts#L52)

Compute embeddings for one or more texts

#### Parameters

##### texts

`string`[]

#### Returns

`Promise`\<[`Embedding`](../type-aliases/Embedding.md)[]\>
