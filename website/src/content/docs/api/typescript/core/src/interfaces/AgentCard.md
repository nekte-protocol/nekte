---
title: "Interface: AgentCard"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / AgentCard

# Interface: AgentCard

Defined in: [packages/core/src/types.ts:67](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L67)

## Properties

### agent

> **agent**: `string`

Defined in: [packages/core/src/types.ts:71](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L71)

Agent identifier

***

### auth?

> `optional` **auth?**: `"bearer"` \| `"apikey"` \| `"none"`

Defined in: [packages/core/src/types.ts:77](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L77)

Auth method

***

### budget\_support?

> `optional` **budget\_support?**: `boolean`

Defined in: [packages/core/src/types.ts:79](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L79)

Whether this agent respects token budgets

***

### caps

> **caps**: `string`[]

Defined in: [packages/core/src/types.ts:75](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L75)

List of capability IDs (just names, details via discover)

***

### endpoint

> **endpoint**: `string`

Defined in: [packages/core/src/types.ts:73](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L73)

NEKTE endpoint URL

***

### nekte

> **nekte**: `string`

Defined in: [packages/core/src/types.ts:69](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/types.ts#L69)

Protocol version
