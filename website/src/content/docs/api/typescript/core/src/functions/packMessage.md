---
title: "Function: packMessage()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / packMessage

# Function: packMessage()

> **packMessage**(`msg`): `Uint8Array`

Defined in: [packages/core/src/msgpack.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/msgpack.ts#L40)

Encode a NEKTE message to MessagePack binary format.
Returns a Uint8Array suitable for sending over binary transports.

## Parameters

### msg

`Record`\<`string`, `unknown`\>

## Returns

`Uint8Array`
