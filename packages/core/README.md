# @nekte/core

Core types, schemas, and utilities for the NEKTE protocol.

## What's included

- **Protocol types** — Discriminated unions for all 8 NEKTE primitives
- **Zod schemas** — Runtime validation for requests and responses
- **Hashing** — Version hashes for zero-schema invocation
- **Budget resolution** — Token budget enforcement and detail level mapping
- **Codec** — MessagePack serialization (~30% smaller than JSON)
- **SSE** — Server-Sent Events parser and emitter
- **Task state machine** — Validated state transitions for task lifecycle
- **gRPC types** — Proto type definitions for gRPC transport
- **Logger** — Structured logger (`createLogger`)

## Install

```bash
pnpm add @nekte/core
```

## Usage

```typescript
import { createVersionHash, resolveBudget, encode, decode } from '@nekte/core';

// Version hashing for zero-schema invocation
const hash = createVersionHash(schema);

// Budget resolution
const budget = resolveBudget({ max_tokens: 100, detail_level: 'minimal' });

// MessagePack encoding
const packed = encode(data);
const unpacked = decode(packed);
```

## Dependencies

- `zod` — Runtime schema validation
- `msgpackr` — MessagePack binary serialization

## License

MIT
