---
title: "Interface: ProtoDelegateEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / ProtoDelegateEvent

# Interface: ProtoDelegateEvent

Defined in: [packages/core/src/grpc-types.ts:135](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L135)

Proto DelegateEvent message shape

## Properties

### cancelled?

> `optional` **cancelled?**: `object`

Defined in: [packages/core/src/grpc-types.ts:144](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L144)

#### previous\_status

> **previous\_status**: `string`

#### reason?

> `optional` **reason?**: `string`

#### task\_id

> **task\_id**: `string`

***

### complete?

> `optional` **complete?**: `object`

Defined in: [packages/core/src/grpc-types.ts:138](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L138)

#### meta?

> `optional` **meta?**: `object`

##### meta.ms

> **ms**: `number`

##### meta.tokens\_used

> **tokens\_used**: `number`

#### output

> **output**: `object`

##### output.compact?

> `optional` **compact?**: `Uint8Array`\<`ArrayBufferLike`\>

##### output.full?

> `optional` **full?**: `Uint8Array`\<`ArrayBufferLike`\>

##### output.minimal?

> `optional` **minimal?**: `string`

#### task\_id

> **task\_id**: `string`

***

### error?

> `optional` **error?**: `object`

Defined in: [packages/core/src/grpc-types.ts:143](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L143)

#### code

> **code**: `number`

#### message

> **message**: `string`

#### task\_id?

> `optional` **task\_id?**: `string`

***

### partial?

> `optional` **partial?**: `object`

Defined in: [packages/core/src/grpc-types.ts:137](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L137)

#### output

> **output**: `Uint8Array`

#### resolved\_level?

> `optional` **resolved\_level?**: `string`

***

### progress?

> `optional` **progress?**: `object`

Defined in: [packages/core/src/grpc-types.ts:136](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L136)

#### message?

> `optional` **message?**: `string`

#### processed

> **processed**: `number`

#### total

> **total**: `number`

***

### resumed?

> `optional` **resumed?**: `object`

Defined in: [packages/core/src/grpc-types.ts:146](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L146)

#### from\_checkpoint

> **from\_checkpoint**: `boolean`

#### task\_id

> **task\_id**: `string`

***

### status\_change?

> `optional` **status\_change?**: `object`

Defined in: [packages/core/src/grpc-types.ts:147](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L147)

#### from\_status

> **from\_status**: `string`

#### reason?

> `optional` **reason?**: `string`

#### task\_id

> **task\_id**: `string`

#### to\_status

> **to\_status**: `string`

***

### suspended?

> `optional` **suspended?**: `object`

Defined in: [packages/core/src/grpc-types.ts:145](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/grpc-types.ts#L145)

#### checkpoint\_available

> **checkpoint\_available**: `boolean`

#### task\_id

> **task\_id**: `string`
