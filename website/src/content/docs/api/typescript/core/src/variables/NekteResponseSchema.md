---
title: "Variable: NekteResponseSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / NekteResponseSchema

# Variable: NekteResponseSchema

> `const` **NekteResponseSchema**: `ZodObject`\<\{ `error`: `ZodOptional`\<`ZodObject`\<\{ `code`: `ZodNumber`; `data`: `ZodOptional`\<`ZodUnknown`\>; `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `code`: `number`; `data?`: `unknown`; `message`: `string`; \}, \{ `code`: `number`; `data?`: `unknown`; `message`: `string`; \}\>\>; `id`: `ZodUnion`\<\[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `result`: `ZodOptional`\<`ZodUnknown`\>; \}, `"strip"`, `ZodTypeAny`, \{ `error?`: \{ `code`: `number`; `data?`: `unknown`; `message`: `string`; \}; `id`: `string` \| `number`; `jsonrpc`: `"2.0"`; `result?`: `unknown`; \}, \{ `error?`: \{ `code`: `number`; `data?`: `unknown`; `message`: `string`; \}; `id`: `string` \| `number`; `jsonrpc`: `"2.0"`; `result?`: `unknown`; \}\>

Defined in: [packages/core/src/schema.ts:183](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L183)
