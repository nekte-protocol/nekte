---
title: "Variable: TaskResumeParamsSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / TaskResumeParamsSchema

# Variable: TaskResumeParamsSchema

> `const` **TaskResumeParamsSchema**: `ZodObject`\<\{ `budget`: `ZodOptional`\<`ZodObject`\<\{ `detail_level`: `ZodEnum`\<\[`"minimal"`, `"compact"`, `"full"`\]\>; `max_tokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}\>\>; `task_id`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `task_id`: `string`; \}, \{ `budget?`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `task_id`: `string`; \}\>

Defined in: [packages/core/src/schema.ts:146](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L146)
