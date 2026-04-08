---
title: "Variable: TaskSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / TaskSchema

# Variable: TaskSchema

> `const` **TaskSchema**: `ZodObject`\<\{ `budget`: `ZodObject`\<\{ `detail_level`: `ZodEnum`\<\[`"minimal"`, `"compact"`, `"full"`\]\>; `max_tokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}, \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}\>; `desc`: `ZodString`; `id`: `ZodString`; `timeout_ms`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `budget`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `desc`: `string`; `id`: `string`; `timeout_ms`: `number`; \}, \{ `budget`: \{ `detail_level`: `"minimal"` \| `"compact"` \| `"full"`; `max_tokens`: `number`; \}; `desc`: `string`; `id`: `string`; `timeout_ms`: `number`; \}\>

Defined in: [packages/core/src/schema.ts:110](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L110)
