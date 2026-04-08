---
title: "Function: projectCapability()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / projectCapability

# Function: projectCapability()

> **projectCapability**(`cap`, `level`): [`Capability`](../type-aliases/Capability.md)

Defined in: [packages/core/src/codec.ts:25](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/codec.ts#L25)

Project a full capability schema down to the requested discovery level.
This is the core of progressive discovery: only send what's needed.

## Parameters

### cap

[`CapabilitySchema`](../interfaces/CapabilitySchema.md)

### level

[`DiscoveryLevel`](../type-aliases/DiscoveryLevel.md)

## Returns

[`Capability`](../type-aliases/Capability.md)
