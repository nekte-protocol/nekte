# Plan: Python SDK (`nekte-python`)

> Goal: `pip install nekte` y tener un client funcional en 5 lineas de Python.

```python
from nekte import NekteClient

async with NekteClient("http://localhost:4001") as client:
    catalog = await client.catalog()
    result = await client.invoke("sentiment", input={"text": "Great product!"})
    print(result.out)
```

---

## 1. Repositorio

**Repositorio separado**: `nekte-protocol/nekte-python`

Razon: Python tiene su propio toolchain (pyproject.toml, uv/pip, pytest, mypy). El protocolo SPEC.md es el contrato — el SDK Python lo implementa, no el codigo TypeScript.

---

## 2. Arquitectura: Capas Explicitas

El SDK TypeScript tiene hexagonal implicita (los archivos estan en el lugar correcto pero no en carpetas separadas). El SDK Python lo hace explicito desde el dia 1:

```text
                ┌─────────────────────────────────┐
                │         Domain Layer             │
                │  types, errors, budget, hash,    │
                │  sse, task state machine,        │
                │  sieve policy, token cost        │
                │  (zero deps, zero I/O, puro)     │
                └──────────────┬──────────────────┘
                               │ depende de
                ┌──────────────┴──────────────────┐
                │          Ports Layer             │
                │  Transport, CacheStore,          │
                │  AuthHandler, DelegateHandler,   │
                │  StreamWriter                    │
                │  (Protocol classes, solo firmas) │
                └──────────────┬──────────────────┘
                               │ implementa
          ┌────────────────────┼─────────────────────┐
          │                    │                      │
  ┌───────▼────────┐  ┌───────▼────────┐  ┌─────────▼───────┐
  │  Application   │  │   Adapters     │  │   Adapters      │
  │  NekteClient   │  │   (inbound)    │  │   (outbound)    │
  │  NekteServer   │  │   HttpServer   │  │   HttpTransport │
  │  Cache         │  │   SseStream    │  │   GrpcTransport │
  │  TaskRegistry  │  │                │  │   MemoryCache   │
  │  CapRegistry   │  │                │  │                 │
  └────────────────┘  └────────────────┘  └─────────────────┘
```

**Regla de dependencia**: Domain no importa nada. Ports importa Domain. Application importa Domain + Ports. Adapters importa todo.

---

## 3. Estructura de Archivos

```text
nekte-python/
  pyproject.toml
  README.md
  LICENSE
  .github/
    workflows/
      ci.yml
      release.yml
  src/
    nekte/
      __init__.py                       # Re-exports publicos
      py.typed                          # PEP 561

      # ── Domain Layer (pura, zero deps, zero I/O) ──────────
      domain/
        __init__.py
        types.py                        # Value Objects: TokenBudget, CapabilityRef,
                                        # CapabilitySummary, CapabilitySchema, AgentCard,
                                        # ContextEnvelope, Task, MultiLevelResult,
                                        # InvokeResult, TaskStatus, NekteMethod...
                                        # (Pydantic BaseModel — serializable, immutable)
        errors.py                       # Domain Errors: NekteProtocolError,
                                        # TaskTransitionError, NEKTE_ERRORS dict
        budget.py                       # Value Object + pure logic:
                                        # resolve_budget(), estimate_tokens(), create_budget()
        hash.py                         # Pure functions:
                                        # canonicalize(), compute_version_hash()
        sse.py                          # Value Objects: SseProgressEvent, SseCompleteEvent,
                                        # SseCancelledEvent... + encode/parse (pure)
        task.py                         # Aggregate Root: TaskEntry
                                        # State Machine: TASK_TRANSITIONS, is_valid_transition(),
                                        # is_terminal(), transition_task(), save_checkpoint()
                                        # Value Object: TaskCheckpoint, TaskTransition
        cache/
          __init__.py
          sieve_policy.py              # Pure algorithm: SievePolicy[K]
                                        # (doubly-linked list + hand pointer + visited bit)
          token_cost.py                 # Value Object: TOKEN_COST, token_cost_for_level()

      # ── Ports Layer (Protocol classes, solo firmas) ────────
      ports/
        __init__.py
        transport.py                    # Protocol: Transport
                                        #   rpc(method, params) -> NekteResponse
                                        #   stream(method, params) -> AsyncIterator[SseEvent]
                                        #   get(url) -> Any
                                        #   close() -> None
        cache_store.py                  # Protocol: CacheStore
                                        #   get(key) -> CacheGetResult | None
                                        #   set(key, entry) -> None
                                        #   delete(key) -> bool
                                        #   keys() -> Iterator[str]
                                        #   size: int
                                        #   clear() -> None
                                        # + CacheStoreEntry, CacheGetResult (Value Objects)
        auth.py                         # Protocol: AuthHandler
                                        #   authenticate(request) -> AuthResult
        delegate_handler.py             # Protocol: DelegateHandler
                                        #   __call__(task, stream, context, signal) -> None
        stream_writer.py                # Protocol: StreamWriter
                                        #   progress(processed, total, message?)
                                        #   partial(out, resolved_level?)
                                        #   complete(task_id, out, meta?)
                                        #   error(code, message, task_id?)
                                        #   cancelled(task_id, previous_status, reason?)
                                        #   suspended(task_id, checkpoint_available)
                                        #   resumed(task_id, from_checkpoint)
                                        #   close()

      # ── Application Layer (orquesta domain + ports) ────────
      application/
        __init__.py
        client.py                       # NekteClient: Application Service
                                        # Depende de: Transport (port), CapabilityCache,
                                        # RequestCoalescer. NO sabe de HTTP ni gRPC.
        server.py                       # NekteServer: Application Service
                                        # Depende de: CapabilityRegistry, TaskRegistry,
                                        # DelegateHandler (port). NO sabe de Starlette.
        capability_registry.py          # Domain Service: CapabilityRegistry
                                        # register(), get(), all(), filter(), invoke()
        task_registry.py                # Domain Service + Repository: TaskRegistry
                                        # register(), cancel(), suspend(), resume(),
                                        # transition(), cleanup(), domain events
        cache.py                        # Application Service: CapabilityCache
                                        # Depende de: CacheStore (port). Orquesta
                                        # SWR, negative caching, revalidation.
        request_coalescer.py            # Application Service: RequestCoalescer
                                        # coalesce(key, fn) -> T
        delegate_stream.py              # Application concept: DelegateStream
                                        # { task_id, events: AsyncIterator, cancel() }
        cancellation.py                 # Application concept: CancellationToken
                                        # Reemplazo Pythonic de AbortController/AbortSignal

      # ── Adapters Layer (implementa ports) ──────────────────
      adapters/
        __init__.py
        # -- Outbound (client-side) --
        http_transport.py               # HttpTransport implements Transport
                                        # Usa httpx.AsyncClient
        grpc_transport.py               # GrpcTransport implements Transport
                                        # Usa grpcio (optional dep)
        memory_cache_store.py           # InMemoryCacheStore implements CacheStore
                                        # SIEVE + GDSF + TTL jitter + stale-while-revalidate
        # -- Inbound (server-side) --
        http_server.py                  # Starlette ASGI adapter
                                        # Routes HTTP requests -> NekteServer.handle_request()
        sse_stream_writer.py            # SseStreamWriter implements StreamWriter
                                        # Writes SSE events to ASGI response
        bearer_auth.py                  # BearerAuth implements AuthHandler
        apikey_auth.py                  # ApiKeyAuth implements AuthHandler

  tests/
    domain/
      test_types.py                     # Pydantic round-trip serialization
      test_hash.py                      # Cross-SDK conformance
      test_budget.py                    # Budget resolution logic
      test_task.py                      # State machine transitions
      test_sse.py                       # SSE encode/parse
      test_sieve.py                     # Scan resistance, edge cases
    ports/
      test_cache_store_contract.py      # Contract test: any CacheStore impl must pass
      test_transport_contract.py        # Contract test: any Transport impl must pass
    application/
      test_client.py                    # Mock transport, test orchestration
      test_server.py                    # Mock handlers, test dispatching
      test_cache.py                     # Negative, SWR, GDSF through CapabilityCache
      test_cache_store.py              # InMemoryCacheStore specific (SIEVE+GDSF+jitter)
      test_task_registry.py             # Domain events, cleanup, transitions
      test_request_coalescer.py         # Concurrent coalescing
    adapters/
      test_http_transport.py            # respx mocking
      test_grpc_transport.py            # grpcio mocking
      test_http_server.py               # Starlette test client
      test_sse_stream_writer.py         # SSE output verification
    integration/
      test_client_server.py             # Real HTTP client <-> server
      test_cross_sdk.py                 # Python client <-> TypeScript server
    conformance/
      hash_vectors.json                 # Shared with TS SDK
      budget_vectors.json
  examples/
    quickstart.py
    streaming_delegate.py
    task_lifecycle.py
    grpc_example.py
    server_with_capabilities.py
```

---

## 4. Dependencias

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "nekte"
version = "0.3.0"
requires-python = ">=3.10"
dependencies = [
    "httpx>=0.27,<1.0",
    "pydantic>=2.7,<3.0",
    "anyio>=4.4,<5.0",
]

[project.optional-dependencies]
grpc = ["grpcio>=1.65,<2.0", "grpcio-tools>=1.65,<2.0"]
server = ["starlette>=0.38,<1.0", "uvicorn>=0.30,<1.0"]
all = ["nekte[grpc,server]"]
dev = ["pytest>=8.0", "pytest-asyncio>=0.24", "respx>=0.21", "mypy>=1.11", "ruff>=0.5", "coverage>=7.0"]
```

---

## 5. API Publica

### 5.1 NekteClient (Application Service)

```python
class NekteClient:
    """Orquesta Transport (port) + CapabilityCache + RequestCoalescer.
    No sabe de HTTP ni gRPC — eso es responsabilidad del adapter inyectado."""

    def __init__(self, endpoint: str, *, transport: Transport | None = None, ...) -> None
    async def __aenter__(self) -> NekteClient
    async def __aexit__(self, *exc) -> None

    # Discovery
    async def agent_card(self) -> AgentCard
    async def discover(self, params: DiscoverParams) -> DiscoverResult
    async def catalog(self, filter: dict | None = None) -> DiscoverResult
    async def describe(self, cap_id: str) -> DiscoverResult
    async def schema(self, cap_id: str) -> DiscoverResult

    # Invoke (auto version hash + retry on VERSION_MISMATCH)
    async def invoke(self, cap_id: str, *, input: dict, budget: TokenBudget | None = None) -> InvokeResult

    # Delegate (streaming + cancel)
    def delegate_stream(self, task: Task, context: ContextEnvelope | None = None) -> DelegateStream

    # Task lifecycle
    async def cancel_task(self, task_id: str, reason: str | None = None) -> TaskLifecycleResult
    async def resume_task(self, task_id: str) -> TaskLifecycleResult
    async def task_status(self, task_id: str) -> TaskStatusResult

    # Verify
    async def verify(self, task_id: str, checks: list[str] | None = None) -> dict

    async def close(self) -> None
```

### 5.2 NekteServer (Application Service)

```python
class NekteServer:
    """Orquesta CapabilityRegistry + TaskRegistry + DelegateHandler (port).
    No sabe de Starlette ni HTTP — eso es responsabilidad del adapter."""

    def __init__(self, agent: str, *, version: str | None = None) -> None

    # Decorator registration (Pythonic)
    def capability(self, id: str, *, input_model, output_model, category, description, ...) -> Callable

    # Delegate handler
    def on_delegate(self, handler: DelegateHandler) -> None

    # Core dispatch (transport-agnostic)
    async def handle_request(self, request: NekteRequest) -> NekteResponse

    # Convenience: start HTTP server (imports adapter lazily)
    async def serve(self, port: int, host: str = "0.0.0.0") -> None
```

### 5.3 Transport (Port)

```python
class Transport(Protocol):
    """Port: outbound communication. Adapters: HttpTransport, GrpcTransport."""

    async def rpc(self, method: NekteMethod, params: Any) -> NekteResponse: ...
    def stream(self, method: NekteMethod, params: Any) -> AsyncIterator[SseEvent]: ...
    async def get(self, url: str) -> Any: ...
    async def close(self) -> None: ...
```

### 5.4 CacheStore (Port)

```python
class CacheStore(Protocol):
    """Port: cache backing store. Adapters: InMemoryCacheStore, RedisCacheStore."""

    def get(self, key: str) -> CacheGetResult | None: ...
    def set(self, key: str, entry: CacheStoreEntry) -> None: ...
    def delete(self, key: str) -> bool: ...
    def keys(self) -> Iterator[str]: ...
    @property
    def size(self) -> int: ...
    def clear(self) -> None: ...
```

### 5.5 DelegateHandler (Port)

```python
class DelegateHandler(Protocol):
    """Port: inbound delegate handling. signal es required (CancellationToken)."""

    async def __call__(
        self, task: Task, stream: StreamWriter, context: ContextEnvelope | None, signal: CancellationToken,
    ) -> None: ...
```

### 5.6 StreamWriter (Port)

```python
class StreamWriter(Protocol):
    """Port: streaming output. Adapters: SseStreamWriter, GrpcStreamWriter."""

    def progress(self, processed: int, total: int, message: str | None = None) -> None: ...
    def partial(self, out: dict, resolved_level: str | None = None) -> None: ...
    def complete(self, task_id: str, out: MultiLevelResult, meta: dict | None = None) -> None: ...
    def error(self, code: int, message: str, task_id: str | None = None) -> None: ...
    def cancelled(self, task_id: str, previous_status: str, reason: str | None = None) -> None: ...
    def close(self) -> None: ...
    @property
    def is_closed(self) -> bool: ...
```

---

## 6. DDD: Aggregates, Value Objects, Domain Services

| Patron DDD | Python Implementation | Capa |
|------------|----------------------|------|
| **Value Object** | `TokenBudget`, `CapabilityRef`, `TaskCheckpoint`, `SseEvent` (Pydantic, inmutables) | Domain |
| **Aggregate Root** | `TaskEntry` (encapsula estado + transiciones validadas) | Domain |
| **Domain Error** | `NekteProtocolError`, `TaskTransitionError` | Domain |
| **Domain Service** | `CapabilityRegistry` (register, invoke, filter), `TaskRegistry` (lifecycle + events) | Application |
| **Application Service** | `NekteClient` (orquesta transport + cache), `NekteServer` (orquesta registries + dispatch) | Application |
| **Port** | `Transport`, `CacheStore`, `AuthHandler`, `DelegateHandler`, `StreamWriter` (Protocol classes) | Ports |
| **Adapter** | `HttpTransport`, `GrpcTransport`, `InMemoryCacheStore`, `HttpServer`, `SseStreamWriter` | Adapters |
| **Pure Algorithm** | `SievePolicy`, `canonicalize()`, `resolve_budget()` | Domain |

---

## 7. Adaptaciones Python-especificas

| TypeScript | Python | Capa |
|-----------|--------|------|
| `AbortController` / `AbortSignal` | `CancellationToken` con `asyncio.Event` | Application |
| `setTimeout` para cooldown | `asyncio.get_event_loop().call_later()` + `weakref` | Application |
| `Map` insertion order | `dict` (ordered desde 3.7) | Adapters |
| `Promise.all` | `asyncio.gather()` | Application |
| Zod schemas | Pydantic `BaseModel` | Domain |
| `AsyncGenerator<SseEvent>` | `AsyncIterator[SseEvent]` | Ports |

---

## 8. Testing por Capa

| Capa | Tests | Estrategia |
|------|-------|-----------|
| **Domain** | test_types, test_hash, test_budget, test_task, test_sse, test_sieve | Puros, sin mocks, sin I/O. Rapidos. |
| **Ports** | test_cache_store_contract, test_transport_contract | Contract tests: definen el contrato que cualquier adapter debe cumplir. Se ejecutan contra cada adapter. |
| **Application** | test_client, test_server, test_cache, test_task_registry, test_coalescer | Mock de ports. Verifican orquestacion. |
| **Adapters** | test_http_transport, test_grpc_transport, test_http_server, test_sse_writer | Mocking de I/O (respx para httpx). |
| **Integration** | test_client_server, test_cross_sdk | Real HTTP. Python client <-> Python server. Python client <-> TypeScript server. |
| **Conformance** | hash_vectors.json, budget_vectors.json | JSON shared con TS SDK. Mismos inputs → mismos outputs. |

---

## 9. Conformance Cross-SDK

```json
// tests/conformance/hash_vectors.json
[
  {
    "input": {"type": "object", "properties": {"text": {"type": "string"}}},
    "output": {"type": "object", "properties": {"score": {"type": "number"}}},
    "expected_hash": "a1b2c3d4"
  }
]
```

El MISMO fichero se usa en TS y Python. Si los hashes divergen, el test falla. Esto garantiza interoperabilidad cross-SDK.

---

## 10. Fases de Implementacion

| Fase | Capa | Archivos | Esfuerzo | Deps |
|------|------|----------|----------|------|
| **F1: Domain** | domain/ | types.py, errors.py, budget.py, hash.py, sse.py, task.py, cache/ | 2-3 dias | Ninguna |
| **F2: Ports** | ports/ | transport.py, cache_store.py, auth.py, delegate_handler.py, stream_writer.py | 1 dia | F1 |
| **F3: Application** | application/ | client.py, server.py, cache.py, capability_registry.py, task_registry.py, request_coalescer.py, delegate_stream.py, cancellation.py | 3-4 dias | F1+F2 |
| **F4: Adapters (outbound)** | adapters/ | http_transport.py, grpc_transport.py, memory_cache_store.py | 2-3 dias | F1+F2 |
| **F5: Adapters (inbound)** | adapters/ | http_server.py, sse_stream_writer.py, bearer_auth.py, apikey_auth.py | 2-3 dias | F1+F2 |
| **F6: Tests domain+ports** | tests/domain/, tests/ports/ | Todos los test_*.py de domain y contract tests | 2 dias | F1+F2 |
| **F7: Tests app+adapters+integration** | tests/application/, tests/adapters/, tests/integration/ | Todos los test_*.py restantes + conformance | 3 dias | F3+F4+F5 |
| **F8: CI + Release** | .github/, examples/, README | ci.yml, release.yml, pyproject.toml | 1-2 dias | F1-F7 |

**Total: ~17-22 dias.**

---

## 11. Criterios de Exito

- `pip install nekte` funciona
- 5 lineas para un client funcional
- Cross-SDK: mismos hashes que TypeScript
- >90% test coverage
- Mypy strict sin errores
- Client Python conecta a server TypeScript y viceversa
- **Regla de dependencia respetada**: domain/ no importa nada externo, ports/ solo importa domain/, application/ solo importa domain/ + ports/, adapters/ puede importar todo
- **Cada port tiene al menos 1 adapter y 1 contract test**
