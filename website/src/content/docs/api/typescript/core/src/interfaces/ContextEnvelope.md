---
title: "Interface: ContextEnvelope"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / ContextEnvelope

# Interface: ContextEnvelope

Defined in: [packages/core/src/types.ts:97](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L97)

## Properties

### budget\_hint?

> `optional` **budget\_hint?**: `number`

Defined in: [packages/core/src/types.ts:109](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L109)

Suggested tokens to represent this context

***

### compression

> **compression**: [`ContextCompression`](../type-aliases/ContextCompression.md)

Defined in: [packages/core/src/types.ts:103](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L103)

Compression strategy

***

### data

> **data**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/types.ts:101](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L101)

The actual context data

***

### id

> **id**: `string`

Defined in: [packages/core/src/types.ts:99](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L99)

Unique envelope identifier

***

### permissions

> **permissions**: [`ContextPermissions`](ContextPermissions.md)

Defined in: [packages/core/src/types.ts:105](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L105)

Access permissions

***

### ttl\_s

> **ttl\_s**: `number`

Defined in: [packages/core/src/types.ts:107](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L107)

Time-to-live in seconds
