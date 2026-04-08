---
title: "Function: compareSizes()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / compareSizes

# Function: compareSizes()

> **compareSizes**(`msg`): `object`

Defined in: [packages/core/src/msgpack.ts:67](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/msgpack.ts#L67)

Measure the size difference between JSON and MessagePack for a message.
Useful for benchmarking.

## Parameters

### msg

`Record`\<`string`, `unknown`\>

## Returns

`object`

### json\_bytes

> **json\_bytes**: `number`

### msgpack\_bytes

> **msgpack\_bytes**: `number`

### savings\_pct

> **savings\_pct**: `number`
