---
title: "Variable: InvokeParamsSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / InvokeParamsSchema

# Variable: InvokeParamsSchema

> `const` **InvokeParamsSchema**: `ZodObject`\<\{ `budget`: `ZodOptional`\<`ZodObject`\<\{ `detail_level`: `ZodEnum`\<\[`"minimal"`, `"compact"`, `"full"`\]\>; `max_tokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}\>\>; `cap`: `ZodString`; `h`: `ZodOptional`\<`ZodString`\>; `in`: `ZodRecord`\<`ZodString`, `ZodUnknown`\>; \}, `"strip"`, `ZodTypeAny`, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `cap`: `string`; `h?`: `string`; `in`: `Record`\<`string`, `unknown`\>; \}, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `cap`: `string`; `h?`: `string`; `in`: `Record`\<`string`, `unknown`\>; \}\>

Defined in: [packages/core/src/schema.ts:103](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L103)
