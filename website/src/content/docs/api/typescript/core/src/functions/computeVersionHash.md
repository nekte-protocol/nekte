---
title: "Function: computeVersionHash()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / computeVersionHash

# Function: computeVersionHash()

> **computeVersionHash**(`input`, `output`): `string`

Defined in: [packages/core/src/hash.ts:41](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/hash.ts#L41)

Compute a version hash for a capability's contract.
Only input and output schemas affect the hash.

## Parameters

### input

`Record`\<`string`, `unknown`\>

### output

`Record`\<`string`, `unknown`\>

## Returns

`string`

8-character hex hash (32 bits — sufficient for version comparison)
