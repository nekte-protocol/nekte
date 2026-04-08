---
title: "Variable: VerifyParamsSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / VerifyParamsSchema

# Variable: VerifyParamsSchema

> `const` **VerifyParamsSchema**: `ZodObject`\<\{ `budget`: `ZodOptional`\<`ZodObject`\<\{ `detail_level`: `ZodEnum`\<\[`"minimal"`, `"compact"`, `"full"`\]\>; `max_tokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}\>\>; `checks`: `ZodArray`\<`ZodEnum`\<\[`"hash"`, `"sample"`, `"source"`\]\>, `"many"`\>; `task_id`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `checks`: (`"hash"` \| `"sample"` \| `"source"`)[]; `task_id`: `string`; \}, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `checks`: (`"hash"` \| `"sample"` \| `"source"`)[]; `task_id`: `string`; \}\>

Defined in: [packages/core/src/schema.ts:127](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L127)
