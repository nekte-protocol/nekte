---
title: "Class: NekteClient"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / NekteClient

# Class: NekteClient

Defined in: [packages/client/src/client.ts:108](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L108)

@nekte/client — NEKTE Protocol Client

Client library for interacting with NEKTE agents.
Features progressive discovery (L0/L1/L2), zero-schema
invocation via version hash caching, and budget-aware requests.

## Example

```ts
const client = new NekteClient('http://localhost:4001');
const catalog = await client.catalog();
const result = await client.invoke('sentiment', {
  input: { text: 'Great product!' },
  budget: { max_tokens: 50, detail_level: 'minimal' },
});
```

## Constructors

### Constructor

> **new NekteClient**(`endpoint`, `config?`): `NekteClient`

Defined in: [packages/client/src/client.ts:116](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L116)

#### Parameters

##### endpoint

`string`

##### config?

[`NekteClientConfig`](../interfaces/NekteClientConfig.md)

#### Returns

`NekteClient`

## Properties

### cache

> `readonly` **cache**: [`CapabilityCache`](CapabilityCache.md)

Defined in: [packages/client/src/client.ts:110](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L110)

***

### endpoint

> `readonly` **endpoint**: `string`

Defined in: [packages/client/src/client.ts:109](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L109)

## Methods

### agentCard()

> **agentCard**(): `Promise`\<`AgentCard`\>

Defined in: [packages/client/src/client.ts:160](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L160)

#### Returns

`Promise`\<`AgentCard`\>

***

### cancelTask()

> **cancelTask**(`taskId`, `reason?`): `Promise`\<`TaskLifecycleResult`\>

Defined in: [packages/client/src/client.ts:279](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L279)

#### Parameters

##### taskId

`string`

##### reason?

`string`

#### Returns

`Promise`\<`TaskLifecycleResult`\>

***

### catalog()

> **catalog**(`filter?`): `Promise`\<`DiscoverResult`\>

Defined in: [packages/client/src/client.ts:186](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L186)

#### Parameters

##### filter?

###### category?

`string`

###### id?

`string`

###### query?

`string`

###### threshold?

`number`

Minimum relevance score 0.0-1.0 (for ranked/semantic filtering)

###### top_k?

`number`

Max results to return (for ranked/semantic filtering)

#### Returns

`Promise`\<`DiscoverResult`\>

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/client/src/client.ts:333](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L333)

#### Returns

`Promise`\<`void`\>

***

### delegateStream()

> **delegateStream**(`task`, `context?`): [`DelegateStream`](../interfaces/DelegateStream.md)

Defined in: [packages/client/src/client.ts:254](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L254)

Delegate a task with streaming and lifecycle control.

Returns a DelegateStream: iterate `events` to consume SSE events,
call `cancel()` to abort the task server-side.

#### Parameters

##### task

`Omit`\<`Task`, `"budget"`\> & `object`

##### context?

`ContextEnvelope`

#### Returns

[`DelegateStream`](../interfaces/DelegateStream.md)

#### Example

```ts
const stream = client.delegateStream(task);
for await (const event of stream.events) {
  if (event.event === 'progress') console.log(`${event.data.processed}/${event.data.total}`);
  if (event.event === 'complete') console.log('Done:', event.data.out);
  if (shouldAbort) await stream.cancel('user requested');
}
```

***

### describe()

> **describe**(`capId`): `Promise`\<`DiscoverResult`\>

Defined in: [packages/client/src/client.ts:190](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L190)

#### Parameters

##### capId

`string`

#### Returns

`Promise`\<`DiscoverResult`\>

***

### discover()

> **discover**(`params`): `Promise`\<`DiscoverResult`\>

Defined in: [packages/client/src/client.ts:170](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L170)

#### Parameters

##### params

`DiscoverParams`

#### Returns

`Promise`\<`DiscoverResult`\>

***

### invoke()

> **invoke**(`capId`, `options`): `Promise`\<`InvokeResult`\>

Defined in: [packages/client/src/client.ts:202](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L202)

#### Parameters

##### capId

`string`

##### options

###### budget?

`Partial`\<`TokenBudget`\>

###### input

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`InvokeResult`\>

***

### resumeTask()

> **resumeTask**(`taskId`, `budget?`): `Promise`\<`TaskLifecycleResult`\>

Defined in: [packages/client/src/client.ts:286](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L286)

#### Parameters

##### taskId

`string`

##### budget?

`Partial`\<`TokenBudget`\>

#### Returns

`Promise`\<`TaskLifecycleResult`\>

***

### schema()

> **schema**(`capId`): `Promise`\<`DiscoverResult`\>

Defined in: [packages/client/src/client.ts:194](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L194)

#### Parameters

##### capId

`string`

#### Returns

`Promise`\<`DiscoverResult`\>

***

### taskStatus()

> **taskStatus**(`taskId`): `Promise`\<`TaskStatusResult`\>

Defined in: [packages/client/src/client.ts:293](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L293)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`TaskStatusResult`\>

***

### verify()

> **verify**(`taskId`, `checks?`, `budget?`): `Promise`\<`unknown`\>

Defined in: [packages/client/src/client.ts:303](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/client.ts#L303)

#### Parameters

##### taskId

`string`

##### checks?

(`"hash"` \| `"sample"` \| `"source"`)[] = `...`

##### budget?

`Partial`\<`TokenBudget`\>

#### Returns

`Promise`\<`unknown`\>
