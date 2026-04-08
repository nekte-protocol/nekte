# @nekte/core

## 0.3.0

### Minor Changes

- a37d3bd: NEKTE v0.3.0 — gRPC transport, task lifecycle, advanced cache

  **gRPC Transport (native)**
  - Proto service definition with 8 RPCs in `core/proto/nekte.proto`
  - Server adapter: `createGrpcTransport()` with server-streaming for delegate
  - Client adapter: `createGrpcClientTransport()` with pluggable Transport port
  - Anti-corruption layer with bidirectional proto <-> domain converters

  **Task Lifecycle Management (A2A-inspired)**
  - State machine: pending -> accepted -> running -> completed/failed/cancelled/suspended
  - `nekte.task.cancel`: fires AbortSignal for cooperative cancellation
  - `nekte.task.resume`: resumes from checkpoint
  - `nekte.task.status`: query lifecycle state
  - TaskRegistry domain service with auto-cleanup and domain events

  **Advanced Cache Architecture (CPU-inspired)**
  - SIEVE eviction (NSDI 2024): scan-resistant, O(1) amortized
  - GDSF token-cost weighting: L2 schemas (120 tok) survive over L0 (8 tok)
  - Stale-while-revalidate: serve stale, refresh in background
  - Negative caching: remember "capability doesn't exist"
  - TTL jitter: prevent cache stampedes
  - Request coalescing: N concurrent refreshes -> 1 network call

  **Protocol Improvements**
  - `nekte.context`: full implementation with TTL enforcement and permission checks
  - `nekte.verify`: real hash verification, sampling, and source tracking

  **Breaking Changes**
  - `DelegateHandler` signal parameter is required (was optional)
  - `HandlerContext.signal` is required (was optional)
  - `delegateStream()` returns `DelegateStream { events, cancel(), taskId }`
  - `Transport.close()` is required (was optional)
  - `CacheStore.get()` returns `CacheGetResult` (was `CacheStoreEntry`)
  - `CacheStoreEntry` has new required fields: `accessCount`, `tokenCost`
  - Removed: `delegate()` unary, `delegateStreamWithControl()`
