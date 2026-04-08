---
title: "Interface: HttpTransportConfig"
---

[**nekte-protocol**](../../../index.md)

***

[nekte-protocol](../../../index.md) / [client/src](../index.md) / HttpTransportConfig

# Interface: HttpTransportConfig

Defined in: [packages/client/src/http-transport.ts:15](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/http-transport.ts#L15)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [packages/client/src/http-transport.ts:17](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/http-transport.ts#L17)

Base endpoint URL

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/client/src/http-transport.ts:19](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/http-transport.ts#L19)

HTTP headers to include (e.g., auth tokens)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/client/src/http-transport.ts:21](https://github.com/nekte-protocol/nekte/blob/0db92e2a0bcb8fe03621c258c0031f25656c48fd/packages/client/src/http-transport.ts#L21)

Request timeout in ms. Default: 30_000
