# Changelog

All notable changes to NEKTE packages will be documented here.

This project uses [Changesets](https://github.com/changesets/changesets) for versioning.

## [Unreleased] — v0.3.0

### Added

- **gRPC Transport (native)**
  - Proto service definition with 8 RPCs in `core/proto/nekte.proto`
  - Server adapter: `createGrpcTransport()` with server-streaming for delegate
  - Client adapter: `createGrpcClientTransport()` with pluggable Transport port
  - Anti-corruption layer with bidirectional proto <-> domain converters

- **Task Lifecycle Management**
  - State machine: pending -> accepted -> running -> completed/failed/cancelled/suspended
  - `nekte.task.cancel`: fires AbortSignal for cooperative cancellation
  - `nekte.task.resume`: resumes from checkpoint
  - `nekte.task.status`: query lifecycle state
  - TaskRegistry domain service with auto-cleanup and domain events

- **Advanced Cache Architecture**
  - SIEVE eviction (NSDI 2024): scan-resistant, O(1) amortized
  - GDSF token-cost weighting: L2 schemas survive over L0
  - Stale-while-revalidate: serve stale, refresh in background
  - Negative caching, TTL jitter, request coalescing

- **Protocol Improvements**
  - `nekte.context`: full implementation with TTL enforcement and permission checks
  - `nekte.verify`: real hash verification, sampling, and source tracking

### Breaking Changes

- `DelegateHandler` signal parameter is now required (was optional)
- `HandlerContext.signal` is now required (was optional)
- `delegateStream()` returns `DelegateStream { events, cancel(), taskId }`
- `Transport.close()` is now required (was optional)
- `CacheStore.get()` returns `CacheGetResult` (was `CacheStoreEntry`)
- `CacheStoreEntry` has new required fields: `accessCount`, `tokenCost`
- Removed: `delegate()` unary, `delegateStreamWithControl()`

## v0.2.0

Initial public release.

- 8 protocol primitives: discover, invoke, delegate, context, verify, task.cancel, task.resume, task.status
- TypeScript SDK with `@nekte/core`, `@nekte/client`, `@nekte/server`, `@nekte/bridge`, `@nekte/cli`
- Hexagonal Architecture with HTTP/SSE, WebSocket, and gRPC transports
- MCP Bridge for zero-change token savings
- Progressive discovery (L0/L1/L2) and zero-schema invocation
- Token budget enforcement with detail levels (minimal/compact/full)
- MessagePack wire format support
