---
title: "Type Alias: TaskRegistryEvent"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / TaskRegistryEvent

# Type Alias: TaskRegistryEvent

> **TaskRegistryEvent** = \{ `entry`: `TaskEntry`; `type`: `"registered"`; \} \| \{ `entry`: `TaskEntry`; `from`: `TaskStatus`; `reason?`: `string`; `to`: `TaskStatus`; `type`: `"transitioned"`; \} \| \{ `entry`: `TaskEntry`; `reason?`: `string`; `type`: `"cancelled"`; \} \| \{ `entry`: `TaskEntry`; `type`: `"suspended"`; \} \| \{ `entry`: `TaskEntry`; `fromCheckpoint`: `boolean`; `type`: `"resumed"`; \} \| \{ `entry`: `TaskEntry`; `type`: `"checkpoint"`; \} \| \{ `count`: `number`; `type`: `"cleaned"`; \}

Defined in: [packages/server/src/task-registry.ts:40](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L40)
