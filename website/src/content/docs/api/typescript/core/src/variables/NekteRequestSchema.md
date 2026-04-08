---
title: "Variable: NekteRequestSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / NekteRequestSchema

# Variable: NekteRequestSchema

> `const` **NekteRequestSchema**: `ZodObject`\<\{ `id`: `ZodUnion`\<\[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodEnum`\<\[`"nekte.discover"`, `"nekte.invoke"`, `"nekte.delegate"`, `"nekte.context"`, `"nekte.verify"`, `"nekte.task.cancel"`, `"nekte.task.resume"`, `"nekte.task.status"`\]\>; `params`: `ZodUnknown`; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string` \| `number`; `jsonrpc`: `"2.0"`; `method`: `"nekte.discover"` \| `"nekte.invoke"` \| `"nekte.delegate"` \| `"nekte.context"` \| `"nekte.verify"` \| `"nekte.task.cancel"` \| `"nekte.task.resume"` \| `"nekte.task.status"`; `params?`: `unknown`; \}, \{ `id`: `string` \| `number`; `jsonrpc`: `"2.0"`; `method`: `"nekte.discover"` \| `"nekte.invoke"` \| `"nekte.delegate"` \| `"nekte.context"` \| `"nekte.verify"` \| `"nekte.task.cancel"` \| `"nekte.task.resume"` \| `"nekte.task.status"`; `params?`: `unknown`; \}\>

Defined in: [packages/core/src/schema.ts:170](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L170)
