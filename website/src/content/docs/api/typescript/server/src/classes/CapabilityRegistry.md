---
title: "Class: CapabilityRegistry"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / CapabilityRegistry

# Class: CapabilityRegistry

Defined in: [packages/server/src/capability.ts:72](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L72)

## Constructors

### Constructor

> **new CapabilityRegistry**(): `CapabilityRegistry`

#### Returns

`CapabilityRegistry`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/server/src/capability.ts:129](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L129)

Number of registered capabilities

##### Returns

`number`

## Methods

### all()

> **all**(): [`RegisteredCapability`](../interfaces/RegisteredCapability.md)[]

Defined in: [packages/server/src/capability.ts:119](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L119)

Get all registered capabilities.
Returns the Map's values iterator to avoid copying the full array on every call.

#### Returns

[`RegisteredCapability`](../interfaces/RegisteredCapability.md)[]

***

### filter()

> **filter**(`opts?`): [`RegisteredCapability`](../interfaces/RegisteredCapability.md)[]

Defined in: [packages/server/src/capability.ts:136](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L136)

Filter capabilities by category or query.

#### Parameters

##### opts?

###### category?

`string`

###### id?

`string`

###### query?

`string`

#### Returns

[`RegisteredCapability`](../interfaces/RegisteredCapability.md)[]

***

### get()

> **get**(`id`): [`RegisteredCapability`](../interfaces/RegisteredCapability.md) \| `undefined`

Defined in: [packages/server/src/capability.ts:111](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L111)

Get a registered capability by ID.

#### Parameters

##### id

`string`

#### Returns

[`RegisteredCapability`](../interfaces/RegisteredCapability.md) \| `undefined`

***

### invoke()

> **invoke**(`id`, `input`, `ctx`): `Promise`\<`MultiLevelResult`\<`string`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>\>

Defined in: [packages/server/src/capability.ts:161](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L161)

Invoke a capability with input and budget context.

#### Parameters

##### id

`string`

##### input

`unknown`

##### ctx

[`HandlerContext`](../interfaces/HandlerContext.md)

#### Returns

`Promise`\<`MultiLevelResult`\<`string`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>\>

***

### register()

> **register**\<`TIn`, `TOut`\>(`id`, `config`): [`RegisteredCapability`](../interfaces/RegisteredCapability.md)

Defined in: [packages/server/src/capability.ts:78](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L78)

Register a new capability.

#### Type Parameters

##### TIn

`TIn`

##### TOut

`TOut`

#### Parameters

##### id

`string`

##### config

[`CapabilityConfig`](../interfaces/CapabilityConfig.md)\<`TIn`, `TOut`\>

#### Returns

[`RegisteredCapability`](../interfaces/RegisteredCapability.md)

***

### values()

> **values**(): `IterableIterator`\<[`RegisteredCapability`](../interfaces/RegisteredCapability.md)\>

Defined in: [packages/server/src/capability.ts:124](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L124)

Iterate capabilities without allocating an array copy

#### Returns

`IterableIterator`\<[`RegisteredCapability`](../interfaces/RegisteredCapability.md)\>
