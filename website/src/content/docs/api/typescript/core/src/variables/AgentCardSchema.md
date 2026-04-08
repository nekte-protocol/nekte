---
title: "Variable: AgentCardSchema"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / AgentCardSchema

# Variable: AgentCardSchema

> `const` **AgentCardSchema**: `ZodObject`\<\{ `agent`: `ZodString`; `auth`: `ZodOptional`\<`ZodEnum`\<\[`"bearer"`, `"apikey"`, `"none"`\]\>\>; `budget_support`: `ZodOptional`\<`ZodBoolean`\>; `caps`: `ZodArray`\<`ZodString`, `"many"`\>; `endpoint`: `ZodString`; `nekte`: `ZodDefault`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `agent`: `string`; `auth?`: `"bearer"` \| `"apikey"` \| `"none"`; `budget_support?`: `boolean`; `caps`: `string`[]; `endpoint`: `string`; `nekte`: `string`; \}, \{ `agent`: `string`; `auth?`: `"bearer"` \| `"apikey"` \| `"none"`; `budget_support?`: `boolean`; `caps`: `string`[]; `endpoint`: `string`; `nekte?`: `string`; \}\>

Defined in: [packages/core/src/schema.ts:60](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/schema.ts#L60)
