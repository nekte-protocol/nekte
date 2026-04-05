# NEKTE Protocol Specification v0.2

> **"The protocol that doesn't burn your context."**

**NEKTE** — from the Greek *nektós* (joined, linked) — is an open agent-to-agent communication protocol designed with token efficiency as a fundamental architectural principle.

---

## 1. Problem

Current AI agent communication protocols (MCP, A2A) prioritize expressiveness over efficiency. The result:

- **MCP** serializes all tool schemas into every conversation turn. With 30 tools, ~3,600 tokens per turn are burned on definitions alone — regardless of whether they're used. In enterprise scenarios (100+ tools), 72% of the context window is consumed before the model sees the first user message.
- **A2A** (Google) solves agent-to-agent coordination but inherits the same verbose schema pattern via JSON and full Agent Cards in every interaction.
- **Every token wasted on protocol overhead is a token stolen from the model's reasoning.** Protocol efficiency is not an optimization — it's a precondition for system intelligence.

### Reference Data

| Metric | MCP native | mcp2cli | NEKTE (target) |
|--------|-----------|---------|----------------|
| Cost per tool (discovery) | ~121 tokens/turn | ~16 tokens (once) | ~8 tokens (once) |
| Cost per invocation | ~121 tokens + payload | ~120 tokens (first time) | 0 tokens (cached) |
| 30 tools x 10 turns | 36,310 tokens | 1,734 tokens | <800 tokens |
| 120 tools x 25 turns | 362,000 tokens | ~5,000 tokens | <2,000 tokens |

### Detailed Benchmarks by Scenario

| Scenario | MCP native | mcp2cli | NEKTE | vs MCP |
|----------|-----------|---------|-------|--------|
| 5 tools x 5 turns | 3,025 | 655 | 345 | -89% |
| 15 tools x 10 turns | 18,150 | 1,390 | 730 | -96% |
| 30 tools x 15 turns | 54,450 | 2,205 | 1,155 | -98% |
| 50 tools x 20 turns | 121,000 | 3,100 | 1,620 | -99% |
| 100 tools x 25 turns | 302,500 | 4,475 | 2,325 | -99% |
| 200 tools x 30 turns | 726,000 | 6,650 | 3,430 | ~100% |

---

## 2. Competitive Landscape

### MCP (Anthropic, 2024)

Agent-to-Tool. De facto standard for connecting LLMs to external tools. 10K+ servers, 97M SDK downloads. Problem: eager schema loading, immature security, unsustainable overhead at scale.

### A2A (Google · Linux Foundation, 2025)

Agent-to-Agent. 100+ partners (Salesforce, SAP, AWS). Under Linux Foundation governance. Covers discovery, delegation, peer-to-peer coordination. Enterprise critical mass. Does not address token efficiency.

### RTK (rtk-ai, 2026)

CLI proxy that compresses terminal output before it reaches the agent's context. 17K+ GitHub stars. 60-90% reduction in command output tokens. Operates at the shell level, not the protocol level.

### mcp2cli / CLIHub (Open Source, 2026)

Converts MCP servers to CLI with on-demand discovery. 96-99% savings on schema tokens. Proves that lazy discovery works, but as a hack — not a formal protocol.

### Comparison

| Feature | MCP | A2A | RTK | NEKTE |
|---------|-----|-----|-----|-------|
| Focus | Agent-to-Tool | Agent-to-Agent | CLI output | Agent-to-Agent (efficient) |
| Discovery | Eager (all upfront) | Full Agent Card | N/A | Progressive L0/L1/L2 |
| Zero-schema invocation | No | No | N/A | Yes (version hash) |
| Native token budget | No | No | N/A | Yes (first-class) |
| Result compression | No | No | Yes (CLI) | Yes (minimal/compact/full) |
| Context permissions | No | Limited | N/A | Envelopes with TTL |
| Verification | No | No | N/A | Native primitive |
| MCP Bridge | N/A | N/A | N/A | @nekte/bridge |

---

## 3. Design Principles

### 3.1 Token Budget as a First-Class Citizen

Every NEKTE message includes a `budget` field indicating the tokens available for the response. The receiving agent MUST respect this budget, adapting the granularity of its response.

```jsonc
{
  "budget": {
    "max_tokens": 500,      // tokens available for response
    "detail_level": "compact" // "minimal" | "compact" | "full"
  }
}
```

### 3.2 Lazy Discovery (Progressive Discovery)

No agent loads full schemas by default. Discovery occurs at three resolution levels, and the consuming agent decides how much it needs:

| Level | What you get | Estimated cost |
|-------|-------------|----------------|
| L0 — Catalog | List of names + categories | ~8 tokens/agent |
| L1 — Summary | Description + main inputs/outputs | ~40 tokens/capability |
| L2 — Full Schema | Typed JSON Schema with examples | ~120 tokens/capability |

### 3.3 Zero-Schema Invocation

If an agent already knows a capability from a previous interaction, it can invoke it directly using a version hash. The receiver validates the hash — if it matches, it executes without re-sending the schema.

```jsonc
{
  "method": "nekte.invoke",
  "params": {
    "capability": "analyze-sentiment",
    "version_hash": "a1b2c3d4",  // hash of the known schema
    "input": { "text": "..." }
  }
}
```

If the hash doesn't match (the capability has evolved), the receiver responds with the updated schema in the same response — no additional round-trip.

### 3.4 Semantic Result Compression

Results are returned at the detail level requested by the `budget`. The same result can have multiple representations:

```jsonc
{
  "result": {
    "minimal": "positive 0.87",                    // ~4 tokens
    "compact": { "sentiment": "positive", "score": 0.87, "confidence": "high" }, // ~12 tokens
    "full": { /* complete analysis with explanation */ }  // ~200 tokens
  },
  "resolved_level": "compact"  // level used based on budget
}
```

### 3.5 Transport Agnostic, Format Opinionated

NEKTE is transport agnostic (HTTP, WebSocket, NATS, stdio) but opinionated about format:

- **JSON-RPC 2.0** as the envelope (compatible with existing ecosystem)
- **Compact fields**: short field names by default, expandable only with `detail_level: "full"`
- **No schemas on the wire by default**: only transmitted when explicitly requested

---

## 4. Protocol Primitives

NEKTE defines five primitives. Each is designed to minimize token overhead in the common case.

### 4.1 `nekte.discover` — Progressive Discovery

Replaces A2A's "full Agent Card" pattern and MCP's "tool listing".

**Request:**
```jsonc
{
  "jsonrpc": "2.0",
  "method": "nekte.discover",
  "id": 1,
  "params": {
    "level": 0,          // 0=catalog, 1=summary, 2=full schema
    "filter": {          // optional: filter by category or keyword
      "category": "nlp",
      "query": "sentiment"
    }
  }
}
```

**Response L0 (catalog):**
```jsonc
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "agent": "nlp-worker",
    "v": "1.2.0",
    "caps": [
      { "id": "sentiment", "cat": "nlp", "h": "a1b2c3d4" },
      { "id": "summarize", "cat": "nlp", "h": "e5f6g7h8" },
      { "id": "translate", "cat": "nlp", "h": "i9j0k1l2" }
    ]
  }
}
// Total cost: ~24 tokens for 3 capabilities
```

**Response L1 (summary) — only when requested:**
```jsonc
{
  "result": {
    "agent": "nlp-worker",
    "caps": [
      {
        "id": "sentiment",
        "h": "a1b2c3d4",
        "desc": "Analyzes text sentiment. Input: text(string). Output: score(float), label(string).",
        "cost": { "avg_ms": 200, "avg_tokens": 50 }
      }
    ]
  }
}
// Cost: ~40 tokens per capability
```

**Response L2 (full schema) — only when requested:**
```jsonc
{
  "result": {
    "caps": [{
      "id": "sentiment",
      "h": "a1b2c3d4",
      "input": {
        "type": "object",
        "properties": {
          "text": { "type": "string", "maxLength": 10000 },
          "lang": { "type": "string", "default": "auto" }
        },
        "required": ["text"]
      },
      "output": {
        "type": "object",
        "properties": {
          "label": { "type": "string", "enum": ["positive", "negative", "neutral"] },
          "score": { "type": "number", "minimum": 0, "maximum": 1 },
          "explanation": { "type": "string" }
        }
      },
      "examples": [
        { "in": { "text": "I love it" }, "out": { "label": "positive", "score": 0.95 } }
      ]
    }]
  }
}
// Cost: ~120 tokens per capability
```

### 4.2 `nekte.invoke` — Efficient Invocation

Invokes a capability. The `version_hash` enables zero-schema invocation.

**Request:**
```jsonc
{
  "jsonrpc": "2.0",
  "method": "nekte.invoke",
  "id": 2,
  "params": {
    "cap": "sentiment",         // capability ID
    "h": "a1b2c3d4",           // version hash (skip schema validation if matched)
    "in": { "text": "The product is excellent but shipping was slow" },
    "budget": { "max_tokens": 100, "detail_level": "compact" }
  }
}
```

**Response:**
```jsonc
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "out": { "label": "mixed", "score": 0.62 },
    "meta": { "ms": 180, "tokens_used": 45 }
  }
}
```

**If the hash doesn't match** (capability updated):
```jsonc
{
  "jsonrpc": "2.0",
  "id": 2,
  "error": {
    "code": -32001,
    "message": "VERSION_MISMATCH",
    "data": {
      "current_hash": "m3n4o5p6",
      "schema": { /* updated L2 schema */ }
    }
  }
}
// The agent can retry immediately with the updated schema — no extra round-trip
```

### 4.3 `nekte.delegate` — Task Delegation

An agent delegates a complete task to another, with an explicit contract.

**Request:**
```jsonc
{
  "jsonrpc": "2.0",
  "method": "nekte.delegate",
  "id": 3,
  "params": {
    "task": {
      "id": "task-001",
      "desc": "Analyze sentiment of 500 reviews and generate executive summary",
      "timeout_ms": 30000,
      "budget": { "max_tokens": 500, "detail_level": "compact" }
    },
    "context": {                // context envelope (see 4.4)
      "data": { "reviews_url": "s3://bucket/reviews.jsonl" },
      "permissions": ["read"],  // receiver CANNOT forward this context
      "ttl_s": 3600             // context expires in 1 hour
    }
  }
}
```

**Response (can stream via SSE):**
```jsonc
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "task_id": "task-001",
    "status": "completed",
    "out": {
      "minimal": "65% positive, 20% neutral, 15% negative. Top complaint: shipping.",
      "compact": { /* structured summary */ },
      "full": { /* complete analysis */ }
    },
    "proof": {                  // verification (see 4.5)
      "hash": "sha256:abc123",
      "samples": 3,            // number of reviews included as evidence
      "evidence": [ /* 3 representative reviews */ ]
    }
  }
}
```

### 4.4 `nekte.context` — Context Envelopes

Shared context management between agents with explicit permissions and built-in efficiency.

```jsonc
{
  "jsonrpc": "2.0",
  "method": "nekte.context",
  "id": 4,
  "params": {
    "action": "share",          // "share" | "request" | "revoke"
    "envelope": {
      "id": "ctx-001",
      "data": { /* context data */ },
      "compression": "semantic", // "none" | "semantic" | "reference"
      "permissions": {
        "forward": false,        // cannot forward to other agents
        "persist": false,        // cannot store beyond this session
        "derive": true           // can generate derived data
      },
      "ttl_s": 3600,
      "budget_hint": 200         // suggested tokens to represent this context
    }
  }
}
```

**Compression modes:**
- `"none"` — raw data as-is
- `"semantic"` — sender includes a token-optimized summary alongside full data; receiver uses the summary if budget is limited
- `"reference"` — only a URI/reference to the data; receiver fetches on-demand if needed

### 4.5 `nekte.verify` — Result Verification

Allows an agent to request evidence that a result is reliable.

```jsonc
{
  "jsonrpc": "2.0",
  "method": "nekte.verify",
  "id": 5,
  "params": {
    "task_id": "task-001",
    "checks": ["hash", "sample", "source"],
    "budget": { "max_tokens": 200 }
  }
}
```

**Response:**
```jsonc
{
  "result": {
    "hash_valid": true,
    "sample": {
      "input_sample": { "text": "Shipping took 3 weeks..." },
      "output_sample": { "label": "negative", "score": 0.12 }
    },
    "source": {
      "model": "claude-sonnet-4-20250514",
      "processed": 500,
      "errors": 2
    }
  }
}
```

---

## 5. Agent Card Format (Minimal)

Unlike A2A, the NEKTE Agent Card is ultra-compact by default. Detail is resolved via `nekte.discover`.

```jsonc
// .well-known/nekte.json — Minimal Agent Card (~50 tokens)
{
  "nekte": "0.2",
  "agent": "nlp-worker",
  "endpoint": "https://nlp.example.com/nekte",
  "caps": ["sentiment", "summarize", "translate"],
  "auth": "bearer",
  "budget_support": true    // this agent respects token budgets
}
```

---

## 6. Transport

NEKTE is transport agnostic. The spec defines message format, not how they're transmitted.

**Recommended transports:**

| Transport | Use case | Streaming |
|-----------|----------|-----------|
| HTTP POST | Simple request-response, serverless | No |
| SSE (Server-Sent Events) | Long-running tasks, delegation | Yes |
| WebSocket | Low latency, bidirectional | Yes |
| NATS/JetStream | High throughput, microservices | Yes |
| stdio | Local agents (CLI, IDE) | No |

---

## 7. The Bridge: Trojan Horse

Nobody is going to rewrite their 10,000+ MCP servers. But a proxy that speaks NEKTE to agents and MCP to servers changes the entire game. 90%+ savings with zero backend changes.

```text
Agent  <---- NEKTE ---->  nekte-bridge  <---- MCP ---->  MCP Server
                                |
                          cache + hash
                         + compression
```

### What the bridge does

- **On startup:** Connects to MCP servers, downloads schemas, computes version hashes, builds L0/L1/L2 catalog
- **nekte.discover(L0):** Returns compact catalog from cache — never touches the MCP server
- **nekte.invoke:** Translates to MCP call, executes, compresses response according to agent's budget
- **Unified catalog:** 30 tools from 3 MCP servers appear as a single catalog with semantic categories
- **Periodic refresh:** Detects schema changes and invalidates hashes automatically

---

## 8. Economic Impact

### Enterprise Scenario: 50 tools x 20 turns x 1,000 conv/day

| Protocol | Tokens/day | Cost/day | Cost/month |
|----------|-----------|----------|------------|
| MCP native | 121.0M | $363 | $10,890 |
| NEKTE | 1.62M | $4.86 | $146 |
| **Savings** | **119.4M** | **$358** | **$10,744** |

*Based on Claude Sonnet 4.6 @ $3/MTok input. Benchmark run with real data from the NEKTE monorepo.*

---

## 9. Reference Implementation

| Package | Description | Status |
|---------|-------------|--------|
| `@nekte/core` | Types, Zod schemas, hashing, budget resolution, codec | BUILD OK |
| `@nekte/client` | Lazy discovery, zero-schema cache, budget-aware invocation | BUILD OK |
| `@nekte/server` | Capability registry, multi-level results, HTTP transport | BUILD OK |
| `@nekte/bridge` | MCP-to-NEKTE proxy with cache, hashing, and compression | BUILD OK |

---

## 10. Reference SDK (TypeScript)

```typescript
import { NekteClient, NekteServer } from '@nekte/core';

// --- Client ---
const client = new NekteClient('https://nlp.example.com/nekte');

// L0: What can you do? (~24 tokens)
const catalog = await client.discover({ level: 0 });

// L1: Tell me more about sentiment (~40 tokens)
const detail = await client.discover({
  level: 1,
  filter: { id: 'sentiment' }
});

// Invoke with limited budget
const result = await client.invoke('sentiment', {
  input: { text: 'The product is great' },
  budget: { max_tokens: 50, detail_level: 'minimal' }
});

// Second invocation — zero-schema (0 extra tokens)
const result2 = await client.invoke('sentiment', {
  input: { text: 'Terrible service' }
  // Client reuses version_hash automatically
});

// --- Server ---
const server = new NekteServer({
  agent: 'nlp-worker',
  version: '1.2.0'
});

server.capability('sentiment', {
  handler: async (input, context) => {
    const score = await analyzeSentiment(input.text);
    return {
      minimal: `${score.label} ${score.value}`,
      compact: { label: score.label, score: score.value },
      full: { ...score, explanation: score.reasoning }
    };
  },
  schema: sentimentSchema,  // Zod schema, auto-hashed
});

server.listen(3000);
```

---

## 11. Comparison with Existing Protocols

| Feature | MCP | A2A (Google) | RTK | NEKTE |
|---------|-----|-------------|-----|-------|
| Primary focus | Agent-to-Tool | Agent-to-Agent | CLI output | Agent-to-Agent (efficient) |
| Discovery | Eager (all upfront) | Full Agent Card | N/A | Progressive (L0/L1/L2) |
| Token overhead per turn | ~121 tokens/tool | Variable (verbose) | N/A | ~8 tokens/capability (L0) |
| Zero-schema invocation | No | No | N/A | Yes (version hash) |
| Native token budget | No | No | N/A | Yes (first-class) |
| Result compression | No | No | Yes (CLI) | Yes (minimal/compact/full) |
| Context permissions | No | Limited | N/A | Yes (envelopes with TTL) |
| Result verification | No | No | N/A | Yes (native primitive) |
| MCP Bridge | N/A | N/A | N/A | @nekte/bridge |
| Transport | Streamable HTTP, stdio | HTTP, gRPC | stdio | Agnostic |
| Governance | Anthropic | Linux Foundation | Open source | Open source (MIT) |

---

## 12. Strategic Positioning

NEKTE **does not compete** — it complements:

- **Complementary to MCP**: MCP connects agents to tools. NEKTE connects agents to each other efficiently. The bridge enables immediate adoption without rewriting existing MCP servers.
- **Efficient alternative to A2A**: Where A2A prioritizes enterprise governance and corporate adoption, NEKTE prioritizes token efficiency and simplicity. For startups, indie devs, and high-volume applications.
- **Complementary to RTK**: RTK compresses CLI output. NEKTE compresses protocol overhead. Different layers, fully combinable.

### Tagline

> **NEKTE: Agent coordination that doesn't waste your context window.**

---

## 13. Roadmap

| Phase | Scope | Timeline |
|-------|-------|----------|
| v0.2 | Spec + TypeScript SDK (`discover`, `invoke`) + MCP Bridge | Months 1-2 |
| v0.3 | `delegate` + `context` + SSE streaming + interoperable demo | Months 3-4 |
| v0.4 | `verify` + public efficiency benchmarks | Months 5-6 |
| v1.0 | Stable spec + Python/Go SDKs + agent registry | Months 7-9 |

---

## 14. Contributing

- **Spec**: `github.com/nekte-protocol/spec` (RFC-style, Markdown)
- **SDK**: `github.com/nekte-protocol/sdk` (TypeScript + Zod)
- **Demo**: `github.com/nekte-protocol/demo` (two agents coordinating)

License: MIT

---

*NEKTE is a project by [BaronTech Labs](https://barontech.io).*
