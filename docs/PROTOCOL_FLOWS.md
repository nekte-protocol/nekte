# NEKTE Protocol Flows

Visual diagrams of the core protocol interactions.

## 1. Progressive Discovery (L0 → L1 → L2)

```mermaid
sequenceDiagram
    participant A as Agent A (Client)
    participant B as Agent B (Server)

    Note over A,B: L0 — Catalog (~8 tok/cap)
    A->>B: nekte.discover { level: 0 }
    B-->>A: { caps: [{ id, cat, h }, ...] }

    Note over A: Agent decides it needs more info on "sentiment"

    Note over A,B: L1 — Summary (~40 tok/cap)
    A->>B: nekte.discover { level: 1, filter: { id: "sentiment" } }
    B-->>A: { caps: [{ id, cat, h, desc, cost }] }

    Note over A: Agent decides to invoke — requests full schema

    Note over A,B: L2 — Full Schema (~120 tok/cap)
    A->>B: nekte.discover { level: 2, filter: { id: "sentiment" } }
    B-->>A: { caps: [{ id, cat, h, desc, input, output, examples }] }
```

## 2. Zero-Schema Invocation

```mermaid
sequenceDiagram
    participant A as Agent A (Client)
    participant B as Agent B (Server)

    Note over A,B: First invocation (includes version hash)
    A->>B: nekte.invoke { cap: "sentiment", h: "a1b2c3d4", in: {...} }
    Note over B: Hash matches → execute directly
    B-->>A: { out: {...}, resolved_level: "compact" }

    Note over A: Client caches hash "a1b2c3d4"

    Note over A,B: Second invocation (zero-schema — 0 extra tokens)
    A->>B: nekte.invoke { cap: "sentiment", h: "a1b2c3d4", in: {...} }
    B-->>A: { out: {...} }

    Note over A,B: Schema changed → VERSION_MISMATCH
    A->>B: nekte.invoke { cap: "sentiment", h: "a1b2c3d4", in: {...} }
    B-->>A: error: VERSION_MISMATCH { current_hash: "e5f6g7h8", schema: {...} }
    Note over A: Client updates cache, retries
    A->>B: nekte.invoke { cap: "sentiment", in: {...} }
    B-->>A: { out: {...} }
```

## 3. MCP Bridge Flow

```mermaid
sequenceDiagram
    participant A as Agent
    participant BR as NEKTE Bridge
    participant MCP as MCP Server

    Note over BR,MCP: Startup: bridge connects to MCP
    BR->>MCP: initialize + tools/list
    MCP-->>BR: [tool1, tool2, tool3, ...]
    Note over BR: Build catalog, compute hashes

    Note over A,BR: Agent discovers via NEKTE
    A->>BR: nekte.discover { level: 0 }
    BR-->>A: { caps: [{ id, cat, h }, ...] }
    Note right of BR: From cache<br/>~24 tokens

    Note over A,BR: Agent invokes via NEKTE
    A->>BR: nekte.invoke { cap: "tool1", h: "abc123", in: {...}, budget: { max_tokens: 50 } }
    BR->>MCP: tools/call { name: "tool1", arguments: {...} }
    MCP-->>BR: { content: [{ type: "text", text: "..." }] }
    Note over BR: Compress result<br/>according to budget
    BR-->>A: { out: { text: "..." }, resolved_level: "minimal" }
```

## 4. Token Budget Resolution

```mermaid
flowchart TD
    A[Handler produces result] --> B{Budget detail_level?}
    B -->|full| C[Try full representation]
    B -->|compact| D[Try compact representation]
    B -->|minimal| E[Return minimal]

    C --> F{Fits in max_tokens?}
    F -->|yes| G[Return full]
    F -->|no| D

    D --> H{Fits in max_tokens?}
    H -->|yes| I[Return compact]
    H -->|no| E

    style G fill:#00ff88,color:#000
    style I fill:#ffee00,color:#000
    style E fill:#ff00aa,color:#fff
```

## 5. Task Delegation

```mermaid
sequenceDiagram
    participant O as Orchestrator
    participant W as Worker Agent

    O->>W: nekte.delegate { task: { id, desc, timeout, budget }, context: { data, permissions, ttl } }
    Note over W: Match capability to task
    Note over W: Execute with budget constraints
    W-->>O: { task_id, status: "completed", out: { minimal, compact, full } }

    Note over O: Optionally verify result
    O->>W: nekte.verify { task_id, checks: ["hash", "sample"] }
    W-->>O: { hash_valid: true, sample: {...} }
```

## 6. Wire Format Options

```mermaid
flowchart LR
    A[NEKTE Message] --> B{Transport}
    B --> C[HTTP POST<br/>JSON]
    B --> D[HTTP POST<br/>MessagePack]
    B --> E[WebSocket<br/>JSON]
    B --> F[WebSocket<br/>MessagePack]
    B --> G[stdio<br/>JSON-RPC]
    B --> H[NATS<br/>MessagePack]

    style C fill:#0a0f1e,stroke:#00f5ff,color:#00f5ff
    style D fill:#0a0f1e,stroke:#ff00aa,color:#ff00aa
    style E fill:#0a0f1e,stroke:#00f5ff,color:#00f5ff
    style F fill:#0a0f1e,stroke:#ff00aa,color:#ff00aa
    style G fill:#0a0f1e,stroke:#ffee00,color:#ffee00
    style H fill:#0a0f1e,stroke:#00ff88,color:#00ff88
```
