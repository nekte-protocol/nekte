---
title: "Interface: CapabilitySummary"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / CapabilitySummary

# Interface: CapabilitySummary

Defined in: [packages/core/src/types.ts:38](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L38)

L1: Summary — ~40 tokens per capability

## Extends

- [`CapabilityRef`](CapabilityRef.md)

## Extended by

- [`CapabilitySchema`](CapabilitySchema.md)

## Properties

### cat

> **cat**: `string`

Defined in: [packages/core/src/types.ts:32](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L32)

Category for filtering

#### Inherited from

[`CapabilityRef`](CapabilityRef.md).[`cat`](CapabilityRef.md#cat)

***

### cost?

> `optional` **cost?**: `object`

Defined in: [packages/core/src/types.ts:42](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L42)

Performance hints

#### avg\_ms?

> `optional` **avg\_ms?**: `number`

#### avg\_tokens?

> `optional` **avg\_tokens?**: `number`

***

### desc

> **desc**: `string`

Defined in: [packages/core/src/types.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L40)

Human-readable description with input/output hints

***

### h

> **h**: `string`

Defined in: [packages/core/src/types.ts:34](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L34)

Version hash — enables zero-schema invocation

#### Inherited from

[`CapabilityRef`](CapabilityRef.md).[`h`](CapabilityRef.md#h)

***

### id

> **id**: `string`

Defined in: [packages/core/src/types.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L30)

Short capability identifier

#### Inherited from

[`CapabilityRef`](CapabilityRef.md).[`id`](CapabilityRef.md#id)
