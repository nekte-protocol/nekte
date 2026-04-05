# NEKTE Protocol

> Agent-to-Agent coordination that doesn't waste your context window.

## Quick Start

```bash
pnpm install
pnpm build        # Build all packages
pnpm test         # Run tests (vitest, 77 tests)
pnpm demo         # Run two-agent demo
pnpm benchmark    # Run token comparison benchmarks
```

## Monorepo Structure

```
packages/
  core/       @nekte/core     — Types, schemas, hashing, budget, codec, logger, SSE, MessagePack
  client/     @nekte/client   — Lazy discovery, zero-schema cache, typed errors, SSE streaming
  server/     @nekte/server   — Capability registry, HTTP/WebSocket transport, auth, SSE delegate
  bridge/     @nekte/bridge   — MCP→NEKTE proxy with cache, hashing, compression, metrics
  cli/        @nekte/cli      — CLI tool: discover, invoke, health, card, bench
benchmarks/                   — Token cost comparison scenarios
demo/                         — Two-agent end-to-end demo
docs/                         — Spec, Getting Started, Protocol Flow diagrams (Mermaid)
```

## Package Dependency Graph

```
core ← client ← cli
core ← server ← bridge
```

Always build `core` first. `pnpm build` handles ordering automatically.

## Key Concepts

- **Lazy Discovery (L0/L1/L2):** Capabilities are discovered progressively, not eagerly loaded
- **Zero-Schema Invocation:** Version hashes allow invoking without re-sending schemas
- **Token Budget:** Every message can specify max_tokens and detail_level (minimal/compact/full)
- **MCP Bridge:** Proxy that translates MCP→NEKTE, enabling 90%+ token savings with zero backend changes
- **SSE Streaming:** `nekte.delegate` streams progress/partial/complete events via Server-Sent Events
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

## Protocol Primitives

1. `nekte.discover` — Progressive capability discovery (L0/L1/L2)
2. `nekte.invoke` — Zero-schema invocation with version hash
3. `nekte.delegate` — Task delegation with SSE streaming
4. `nekte.context` — Context envelopes with permissions/TTL (stub, v0.3)
5. `nekte.verify` — Result verification (stub, v0.4)

## Transports

- **HTTP** — Default, request-response
- **SSE** — Streaming for delegate (progress → partial → complete)
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
