---
title: "Interface: TaskRegistryConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / TaskRegistryConfig

# Interface: TaskRegistryConfig

Defined in: [packages/server/src/task-registry.ts:96](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L96)

## Properties

### cleanupIntervalMs?

> `optional` **cleanupIntervalMs?**: `number`

Defined in: [packages/server/src/task-registry.ts:100](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L100)

Auto-cleanup interval in ms. 0 = disabled. Default: 60_000 (1 min)

***

### staleMaxAgeMs?

> `optional` **staleMaxAgeMs?**: `number`

Defined in: [packages/server/src/task-registry.ts:98](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L98)

Max age in ms before terminal tasks are cleaned up. Default: 300_000 (5 min)
