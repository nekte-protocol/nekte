---
title: "Variable: DiscoverParamsSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / DiscoverParamsSchema

# Variable: DiscoverParamsSchema

> `const` **DiscoverParamsSchema**: `ZodObject`\<\{ `filter`: `ZodOptional`\<`ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `query`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `category?`: `string`; `id?`: `string`; `query?`: `string`; \}, \{ `category?`: `string`; `id?`: `string`; `query?`: `string`; \}\>\>; `level`: `ZodUnion`\<\[`ZodLiteral`\<`0`\>, `ZodLiteral`\<`1`\>, `ZodLiteral`\<`2`\>\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `filter?`: \{ `category?`: `string`; `id?`: `string`; `query?`: `string`; \}; `level`: `0` \| `1` \| `2`; \}, \{ `filter?`: \{ `category?`: `string`; `id?`: `string`; `query?`: `string`; \}; `level`: `0` \| `1` \| `2`; \}\>

Defined in: [packages/core/src/schema.ts:92](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L92)
