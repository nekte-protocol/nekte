---
title: "Interface: CapabilitySchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / CapabilitySchema

# Interface: CapabilitySchema

Defined in: [packages/core/src/types.ts:49](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L49)

L2: Full schema — ~120 tokens per capability

## Extends

- [`CapabilitySummary`](CapabilitySummary.md)

## Properties

### cat

> **cat**: `string`

Defined in: [packages/core/src/types.ts:32](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L32)

Category for filtering

#### Inherited from

[`CapabilitySummary`](CapabilitySummary.md).[`cat`](CapabilitySummary.md#cat)

***

### cost?

> `optional` **cost?**: `object`

Defined in: [packages/core/src/types.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L42)

Performance hints

#### avg\_ms?

> `optional` **avg\_ms?**: `number`

#### avg\_tokens?

> `optional` **avg\_tokens?**: `number`

#### Inherited from

[`CapabilitySummary`](CapabilitySummary.md).[`cost`](CapabilitySummary.md#cost)

***

### desc

> **desc**: `string`

Defined in: [packages/core/src/types.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L40)

Human-readable description with input/output hints

#### Inherited from

[`CapabilitySummary`](CapabilitySummary.md).[`desc`](CapabilitySummary.md#desc)

***

### examples?

> `optional` **examples?**: `object`[]

Defined in: [packages/core/src/types.ts:55](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L55)

Example input/output pairs

#### in

> **in**: `Record`\<`string`, `unknown`\>

#### out

> **out**: `Record`\<`string`, `unknown`\>

***

### h

> **h**: `string`

Defined in: [packages/core/src/types.ts:34](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L34)

Version hash — enables zero-schema invocation

#### Inherited from

[`CapabilitySummary`](CapabilitySummary.md).[`h`](CapabilitySummary.md#h)

***

### id

> **id**: `string`

Defined in: [packages/core/src/types.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L30)

Short capability identifier

#### Inherited from

[`CapabilitySummary`](CapabilitySummary.md).[`id`](CapabilitySummary.md#id)

***

### input

> **input**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/types.ts:51](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L51)

JSON Schema for input validation

***

### output

> **output**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/types.ts:53](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L53)

JSON Schema for output structure
