---
title: "Function: compressMessage()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / compressMessage

# Function: compressMessage()

> **compressMessage**(`msg`, `compact?`): `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/codec.ts:105](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/codec.ts#L105)

Compress a NEKTE message for wire transmission.
Replaces verbose field names with short aliases.

Only used when `detail_level` is 'minimal' or 'compact'.
At 'full' detail, standard JSON field names are used for readability.

## Parameters

### msg

`Record`\<`string`, `unknown`\>

### compact?

`boolean` = `true`

## Returns

`Record`\<`string`, `unknown`\>
