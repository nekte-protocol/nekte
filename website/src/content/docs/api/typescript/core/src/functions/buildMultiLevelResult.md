---
title: "Function: buildMultiLevelResult()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / buildMultiLevelResult

# Function: buildMultiLevelResult()

> **buildMultiLevelResult**\<`T`\>(`full`, `options?`): [`MultiLevelResult`](../interfaces/MultiLevelResult.md)\<`string`, `Record`\<`string`, `unknown`\>, `T`\>

Defined in: [packages/core/src/codec.ts:57](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/codec.ts#L57)

Helper to build a multi-level result from a handler's output.
The handler provides a `compress` function that knows how to
generate each detail level.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Parameters

### full

`T`

### options?

#### toCompact?

(`data`) => `Record`\<`string`, `unknown`\>

Generate a compact representation

#### toMinimal?

(`data`) => `string`

Generate a minimal string representation

## Returns

[`MultiLevelResult`](../interfaces/MultiLevelResult.md)\<`string`, `Record`\<`string`, `unknown`\>, `T`\>
