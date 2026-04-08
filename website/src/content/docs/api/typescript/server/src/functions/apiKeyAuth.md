---
title: "Function: apiKeyAuth()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / apiKeyAuth

# Function: apiKeyAuth()

> **apiKeyAuth**(`keys`): [`AuthHandler`](../type-aliases/AuthHandler.md)

Defined in: [packages/server/src/auth.ts:49](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/auth.ts#L49)

API key authentication.
Validates the X-API-Key header against one or more valid keys.

## Parameters

### keys

`string` \| `string`[]

## Returns

[`AuthHandler`](../type-aliases/AuthHandler.md)
