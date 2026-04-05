# NEKTE Protocol

[![CI](https://github.com/nekte-protocol/nekte/actions/workflows/ci.yml/badge.svg)](https://github.com/nekte-protocol/nekte/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NEKTE v0.2](https://img.shields.io/badge/NEKTE-v0.2-00f5ff)](https://github.com/nekte-protocol/nekte)

> **"El protocolo que no quema tu contexto."**

NEKTE *(del griego nektós — unido, vinculado)* is an open agent-to-agent coordination protocol designed with **token efficiency as a first-class architectural principle**.

---

## The Problem

MCP serializes **all** tool schemas into every conversation turn. With 30 tools, that's ~3,600 tokens/turn burned on definitions alone. At enterprise scale (100+ tools), **72% of the context window is consumed before the model reads a single user message**.

> Every token wasted on protocol overhead is a token stolen from the model's reasoning.

## The Solution: 5 Primitives

| Primitive | What it does | Token cost |
|-----------|-------------|------------|
| `nekte.discover` | Progressive discovery (L0/L1/L2) | ~8 tok/cap (L0) |
| `nekte.invoke` | Zero-schema invocation via version hash | 0 extra tokens |
| `nekte.delegate` | Task delegation with contracts | Budget-aware |
| `nekte.context` | Context envelopes with permissions + TTL | Compressed |
| `nekte.verify` | Result verification with proofs | On-demand |

## Token Savings

```
                MCP native    mcp2cli     NEKTE       vs MCP
              ──────────────────────────────────────────────
  5 tools       3,025          655        345         -89%
 15 tools      18,150        1,390        730         -96%
 30 tools      54,450        2,205      1,155         -98%
 50 tools     121,000        3,100      1,620         -99%
100 tools     302,500        4,475      2,325         -99%
200 tools     726,000        6,650      3,430        ~100%
```

**Enterprise impact** (50 tools x 20 turns x 1,000 conv/day):
- MCP: **$10,890/month** | NEKTE: **$146/month** | Savings: **$10,744/month**

## The Bridge: Trojan Horse

Don't rewrite your 10,000+ MCP servers. Drop `@nekte/bridge` in front:

```
Agent  <── NEKTE -->  nekte-bridge  <-- MCP -->  MCP Server(s)
                          |
                    cache + hash
                    + compression
```

90%+ token savings. Zero backend changes. Day 1.

## Quick Start

```bash
# Install & build
pnpm install && pnpm build

# Run the two-agent demo
pnpm demo

# Run token benchmarks
pnpm benchmark

# Run tests
pnpm test
```

### Use as a library

```typescript
import { NekteClient } from '@nekte/client';
import { NekteServer } from '@nekte/server';

// Client: progressive discovery + zero-schema invocation
const client = new NekteClient('http://localhost:4001');
const catalog = await client.catalog();           // L0: ~24 tokens for 3 caps
const result = await client.invoke('sentiment', {
  input: { text: 'Great product!' },
  budget: { max_tokens: 50, detail_level: 'minimal' },
});

// Server: register typed capabilities
const server = new NekteServer({ agent: 'nlp-worker' });
server.capability('sentiment', {
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ score: z.number() }),
  category: 'nlp',
  description: 'Analyze text sentiment',
  handler: async (input) => ({ score: 0.9 }),
  toMinimal: (out) => `positive ${out.score}`,
});
server.listen(4001);
```

### Bridge a MCP server

```bash
# Via CLI
npx nekte-bridge --mcp-url http://localhost:3000/mcp --name github --port 3100

# Via Docker
docker build -t nekte-bridge .
docker run -p 3100:3100 -v ./bridge.json:/app/bridge.json nekte-bridge
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@nekte/core` | Types, schemas, hashing, budget, codec, logger, SSE, MessagePack | Ready |
| `@nekte/client` | Lazy discovery, zero-schema cache, typed errors, SSE streaming | Ready |
| `@nekte/server` | Capability registry, HTTP/WebSocket transport, auth, SSE delegate | Ready |
| `@nekte/bridge` | MCP proxy with cache, hashing, compression, metrics (HTTP + stdio) | Ready |
| `@nekte/cli` | CLI: discover, invoke, health, card, bench | Ready |

## Positioning

NEKTE **does not compete** with existing protocols — it complements them:

- **+ MCP**: MCP connects agents to tools. NEKTE connects agents to agents efficiently. The bridge enables instant adoption.
- **+ A2A**: Where A2A prioritizes enterprise governance, NEKTE prioritizes token efficiency. For startups, indie devs, and high-volume apps.
- **+ RTK**: RTK compresses CLI output. NEKTE compresses protocol overhead. Different layers, fully combinable.

## Roadmap

| Phase | Scope | Timeline |
|-------|-------|----------|
| **v0.2** | Spec + TypeScript SDK (`discover`, `invoke`) + MCP Bridge | Months 1-2 |
| v0.3 | `delegate` + `context` + multi-framework demo | Months 3-4 |
| v0.4 | `verify` + public benchmarks + independent comparison | Months 5-6 |
| v1.0 | Stable spec + Python/Go SDKs + agent registry | Months 7-9 |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## Specification

- Full protocol specification: [docs/SPEC.md](./docs/SPEC.md)
- Getting started tutorial: [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)
- Protocol flow diagrams: [docs/PROTOCOL_FLOWS.md](./docs/PROTOCOL_FLOWS.md)

## License

MIT — [BaronTech Labs](https://barontech.io)
