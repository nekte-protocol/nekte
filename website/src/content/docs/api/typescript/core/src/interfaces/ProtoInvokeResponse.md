---
title: "Interface: ProtoInvokeResponse"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / ProtoInvokeResponse

# Interface: ProtoInvokeResponse

Defined in: [packages/core/src/grpc-types.ts:98](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L98)

Proto InvokeResponse message shape

## Properties

### error?

> `optional` **error?**: `object`

Defined in: [packages/core/src/grpc-types.ts:102](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L102)

#### code

> **code**: `number`

#### current\_hash?

> `optional` **current\_hash?**: `string`

#### message

> **message**: `string`

#### schema?

> `optional` **schema?**: [`ProtoCapabilityFull`](ProtoCapabilityFull.md)

***

### meta?

> `optional` **meta?**: `object`

Defined in: [packages/core/src/grpc-types.ts:101](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L101)

#### ms

> **ms**: `number`

#### tokens\_used

> **tokens\_used**: `number`

***

### output

> **output**: `Uint8Array`

Defined in: [packages/core/src/grpc-types.ts:99](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L99)

***

### resolved\_level?

> `optional` **resolved\_level?**: `string`

Defined in: [packages/core/src/grpc-types.ts:100](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L100)
