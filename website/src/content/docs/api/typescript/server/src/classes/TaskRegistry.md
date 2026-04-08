---
title: "Class: TaskRegistry"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [server/src](../index.md) / TaskRegistry

# Class: TaskRegistry

Defined in: [packages/server/src/task-registry.ts:103](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L103)

## Constructors

### Constructor

> **new TaskRegistry**(`config?`): `TaskRegistry`

Defined in: [packages/server/src/task-registry.ts:109](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L109)

#### Parameters

##### config?

[`TaskRegistryConfig`](../interfaces/TaskRegistryConfig.md)

#### Returns

`TaskRegistry`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/server/src/task-registry.ts:180](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L180)

Total number of tracked tasks

##### Returns

`number`

## Methods

### active()

> **active**(): `TaskEntry`[]

Defined in: [packages/server/src/task-registry.ts:170](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L170)

Get all active (non-terminal) tasks

#### Returns

`TaskEntry`[]

***

### all()

> **all**(): `TaskEntry`[]

Defined in: [packages/server/src/task-registry.ts:175](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L175)

Get all tasks (for monitoring)

#### Returns

`TaskEntry`[]

***

### cancel()

> **cancel**(`taskId`, `reason?`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:204](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L204)

Cancel a task. Fires the AbortController signal.
Throws TaskNotCancellableError if the task cannot be cancelled.

#### Parameters

##### taskId

`string`

##### reason?

`string`

#### Returns

`TaskEntry`

***

### cleanup()

> **cleanup**(`maxAgeMs?`): `number`

Defined in: [packages/server/src/task-registry.ts:288](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L288)

Remove terminal tasks older than maxAge. Returns count removed.

#### Parameters

##### maxAgeMs?

`number`

#### Returns

`number`

***

### dispose()

> **dispose**(): `void`

Defined in: [packages/server/src/task-registry.ts:307](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L307)

Stop the auto-cleanup timer

#### Returns

`void`

***

### get()

> **get**(`taskId`): `TaskEntry` \| `undefined`

Defined in: [packages/server/src/task-registry.ts:158](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L158)

Get a task entry by ID

#### Parameters

##### taskId

`string`

#### Returns

`TaskEntry` \| `undefined`

***

### getOrThrow()

> **getOrThrow**(`taskId`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:163](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L163)

Get a task entry or throw TaskNotFoundError

#### Parameters

##### taskId

`string`

#### Returns

`TaskEntry`

***

### on()

> **on**(`listener`): () => `void`

Defined in: [packages/server/src/task-registry.ts:126](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L126)

Subscribe to registry events (transport-agnostic)

#### Parameters

##### listener

[`TaskRegistryListener`](../type-aliases/TaskRegistryListener.md)

#### Returns

() => `void`

***

### register()

> **register**(`task`, `context?`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:146](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L146)

Register a new task in 'pending' state.
Returns the entry with its AbortController for cancellation signaling.

#### Parameters

##### task

`Task`

##### context?

`ContextEnvelope`

#### Returns

`TaskEntry`

***

### resume()

> **resume**(`taskId`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:236](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L236)

Resume a suspended task.
Transitions back to 'running' and returns the entry (with checkpoint if available).
Throws TaskNotResumableError if the task cannot be resumed.

#### Parameters

##### taskId

`string`

#### Returns

`TaskEntry`

***

### saveCheckpoint()

> **saveCheckpoint**(`taskId`, `data`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:251](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L251)

Save a checkpoint on a running/suspended task.

#### Parameters

##### taskId

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

`TaskEntry`

***

### suspend()

> **suspend**(`taskId`, `checkpointData?`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:218](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L218)

Suspend a running task with optional checkpoint data.

#### Parameters

##### taskId

`string`

##### checkpointData?

`Record`\<`string`, `unknown`\>

#### Returns

`TaskEntry`

***

### toLifecycleResult()

> **toLifecycleResult**(`entry`, `previousStatus`): `TaskLifecycleResult`

Defined in: [packages/server/src/task-registry.ts:275](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L275)

Build a TaskLifecycleResult after a cancel/resume

#### Parameters

##### entry

`TaskEntry`

##### previousStatus

`TaskStatus`

#### Returns

`TaskLifecycleResult`

***

### toStatusResult()

> **toStatusResult**(`taskId`): `TaskStatusResult`

Defined in: [packages/server/src/task-registry.ts:263](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L263)

Build a TaskStatusResult for the protocol response

#### Parameters

##### taskId

`string`

#### Returns

`TaskStatusResult`

***

### transition()

> **transition**(`taskId`, `to`, `reason?`): `TaskEntry`

Defined in: [packages/server/src/task-registry.ts:192](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/server/src/task-registry.ts#L192)

Transition a task to a new status with validation.
Throws TaskTransitionError if the transition is invalid.

#### Parameters

##### taskId

`string`

##### to

`TaskStatus`

##### reason?

`string`

#### Returns

`TaskEntry`
