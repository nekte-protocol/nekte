---
title: "Function: resolveBudget()"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [core/src](../index.md) / resolveBudget

# Function: resolveBudget()

> **resolveBudget**\<`TMin`, `TCom`, `TFul`\>(`result`, `budget?`): `object`

Defined in: [packages/core/src/budget.ts:30](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/core/src/budget.ts#L30)

Resolve which detail level to return based on budget.
Falls back to a less detailed level if the requested one exceeds the budget.

## Type Parameters

### TMin

`TMin`

### TCom

`TCom`

### TFul

`TFul`

## Parameters

### result

[`MultiLevelResult`](../interfaces/MultiLevelResult.md)\<`TMin`, `TCom`, `TFul`\>

### budget?

[`TokenBudget`](../interfaces/TokenBudget.md)

## Returns

`object`

### data

> **data**: `TMin` \| `TCom` \| `TFul`

### level

> **level**: [`DetailLevel`](../type-aliases/DetailLevel.md)
