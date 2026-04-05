# NEKTE Protocol

> Agent-to-Agent coordination that doesn't waste your context window.

## Quick Start

```bash
pnpm install
pnpm build        # Build all packages
pnpm test         # Run tests (vitest, 111 tests)
pnpm demo         # Run two-agent demo
pnpm benchmark    # Run token comparison benchmarks
```

## Monorepo Structure

```text
packages/
  core/       @nekte/core     — Types, schemas, hashing, budget, codec, logger, SSE, MessagePack, task state machine, gRPC types
  client/     @nekte/client   — Transport port, HTTP/gRPC adapters, discovery cache, streaming + cancel, task lifecycle
  server/     @nekte/server   — Capability registry, task registry (DDD), HTTP/WS/gRPC transports, auth, SSE + gRPC streaming
  bridge/     @nekte/bridge   — MCP->NEKTE proxy with cache, hashing, compression, metrics
  cli/        @nekte/cli      — CLI tool: discover, invoke, health, card, bench
benchmarks/                   — Token cost comparison scenarios
demo/                         — Two-agent end-to-end demo
docs/                         — Spec, Getting Started, Protocol Flow diagrams (Mermaid)
```

## Package Dependency Graph

```text
core <- client <- cli
core <- server <- bridge
```

Always build `core` first. `pnpm build` handles ordering automatically.

## Architecture

- **Hexagonal Architecture**: Ports (Transport, DelegateHandler, GrpcWritableStream) + Adapters (HttpTransport, GrpcTransport, SseStream, GrpcDelegateStream)
- **DDD**: TaskEntry (Aggregate Root), TaskRegistry (Domain Service + Repository), CapabilityRegistry (Domain Service)
- **Strong typing**: Discriminated unions for SSE events, branded status types, `as const` transitions

## Key Concepts

- **Lazy Discovery (L0/L1/L2):** Capabilities are discovered progressively, not eagerly loaded
- **Zero-Schema Invocation:** Version hashes allow invoking without re-sending schemas
- **Token Budget:** Every message can specify max_tokens and detail_level (minimal/compact/full)
- **MCP Bridge:** Proxy that translates MCP->NEKTE, enabling 90%+ token savings with zero backend changes
- **SSE Streaming:** `nekte.delegate` streams progress/partial/complete events via Server-Sent Events
- **gRPC Transport:** Native gRPC with server-streaming for delegate, proto definitions in `core/proto/`
- **Task Lifecycle:** Cancel, suspend, resume tasks with AbortSignal + checkpoint support
- **MessagePack:** Optional binary wire format (~30% smaller than JSON)
- **Auth:** Pluggable authentication (bearer, API key, custom)

## Conventions

- TypeScript strict mode, ES2022 target
- Zod for runtime validation
- pnpm workspaces with `workspace:*` references
- Each package builds to `dist/` with declarations and source maps
- Tests use vitest
- ESLint + Prettier for code style
- Changesets for versioning and npm publishing
- Structured logger (`createLogger`) instead of raw console.log
- `@grpc/grpc-js` and `@grpc/proto-loader` are optional peer dependencies

## Protocol Primitives

1. `nekte.discover` — Progressive capability discovery (L0/L1/L2)
2. `nekte.invoke` — Zero-schema invocation with version hash
3. `nekte.delegate` — Task delegation with streaming (SSE or gRPC server-streaming)
4. `nekte.context` — Context envelopes with permissions/TTL (stub, v0.3)
5. `nekte.verify` — Result verification (stub, v0.4)
6. `nekte.task.cancel` — Cancel a running or suspended task
7. `nekte.task.resume` — Resume a suspended task from checkpoint
8. `nekte.task.status` — Query current task lifecycle state

## Task Lifecycle State Machine

```text
pending -> accepted -> running -> completed
                    -> suspended -> running (resume)
(any non-terminal) -> cancelled | failed
```

- DelegateHandler signature: `(task, stream, context, signal) => Promise<void>` — signal is required
- HandlerContext.signal is required — every invocation gets an AbortSignal
- `delegateStream()` returns `DelegateStream { events, cancel(), taskId }`

## Transports

- **HTTP** — Default, request-response
- **SSE** — Streaming for delegate (progress -> partial -> complete -> cancelled/suspended/resumed)
- **gRPC** — Native transport with server-streaming for delegate (`createGrpcTransport`)
- **WebSocket** — Low-latency bidirectional (`createWsTransport`)
- **stdio** — MCP servers via subprocess (bridge)

## CLI

```bash
nekte discover http://localhost:4001          # L0 catalog
nekte discover http://localhost:4001 -l 2     # L2 full schemas
nekte invoke http://localhost:4001 sentiment -i '{"text":"Great!"}'
nekte health http://localhost:3100            # Bridge health + metrics
nekte card http://localhost:4001              # Agent Card
nekte bench http://localhost:4001             # JSON vs MessagePack sizes
```
