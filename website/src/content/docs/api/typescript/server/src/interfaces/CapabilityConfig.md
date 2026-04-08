---
title: "Interface: CapabilityConfig<TIn, TOut>"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / CapabilityConfig

# Interface: CapabilityConfig\<TIn, TOut\>

Defined in: [packages/server/src/capability.ts:37](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L37)

## Type Parameters

### TIn

`TIn` = `unknown`

### TOut

`TOut` = `unknown`

## Properties

### category

> **category**: `string`

Defined in: [packages/server/src/capability.ts:43](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L43)

Category for discovery filtering

***

### cost?

> `optional` **cost?**: `object`

Defined in: [packages/server/src/capability.ts:53](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L53)

Performance hints

#### avg\_ms?

> `optional` **avg\_ms?**: `number`

#### avg\_tokens?

> `optional` **avg\_tokens?**: `number`

***

### description

> **description**: `string`

Defined in: [packages/server/src/capability.ts:45](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L45)

Human-readable description (used in L1 discovery)

***

### examples?

> `optional` **examples?**: `object`[]

Defined in: [packages/server/src/capability.ts:58](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L58)

Example input/output pairs

#### in

> **in**: `TIn`

#### out

> **out**: `TOut`

***

### handler

> **handler**: [`CapabilityHandler`](../type-aliases/CapabilityHandler.md)\<`TIn`, `TOut`\>

Defined in: [packages/server/src/capability.ts:47](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L47)

The handler function

***

### inputSchema

> **inputSchema**: `ZodType`\<`TIn`\>

Defined in: [packages/server/src/capability.ts:39](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L39)

Zod schema for input validation

***

### outputSchema

> **outputSchema**: `ZodType`\<`TOut`\>

Defined in: [packages/server/src/capability.ts:41](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L41)

Zod schema for output validation

***

### toCompact?

> `optional` **toCompact?**: (`output`) => `Record`\<`string`, `unknown`\>

Defined in: [packages/server/src/capability.ts:51](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L51)

Generate compact representation of output

#### Parameters

##### output

`TOut`

#### Returns

`Record`\<`string`, `unknown`\>

***

### toMinimal?

> `optional` **toMinimal?**: (`output`) => `string`

Defined in: [packages/server/src/capability.ts:49](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L49)

Generate minimal string representation of output

#### Parameters

##### output

`TOut`

#### Returns

`string`
