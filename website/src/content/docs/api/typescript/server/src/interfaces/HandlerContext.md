---
title: "Interface: HandlerContext"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / HandlerContext

# Interface: HandlerContext

Defined in: [packages/server/src/capability.ts:22](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L22)

## Properties

### budget

> **budget**: `TokenBudget`

Defined in: [packages/server/src/capability.ts:23](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L23)

***

### checkpoint?

> `optional` **checkpoint?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/server/src/capability.ts:29](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L29)

Checkpoint data from a previously suspended task (for resume)

***

### context?

> `optional` **context?**: `ContextEnvelope`

Defined in: [packages/server/src/capability.ts:24](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L24)

***

### signal

> **signal**: `AbortSignal`

Defined in: [packages/server/src/capability.ts:27](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L27)

AbortSignal for cooperative cancellation (from task lifecycle)

***

### taskId?

> `optional` **taskId?**: `string`

Defined in: [packages/server/src/capability.ts:25](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/capability.ts#L25)
