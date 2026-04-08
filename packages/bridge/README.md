# @nekte/bridge

MCP-to-NEKTE proxy — get 90%+ token savings without changing your MCP servers.

## How it works

```
Agent  <── NEKTE ──>  nekte-bridge  <── MCP ──>  MCP Server(s)
                          |
                    cache + hash
                    + compression
```

Drop the bridge in front of any existing MCP server. Agents talk NEKTE (token-efficient), the bridge translates to MCP. Zero backend changes.

## Features

- **SIEVE cache** — Scan-resistant eviction (NSDI 2024), O(1) amortized
- **GDSF weighting** — Token-cost-aware cache prioritization
- **Version hashing** — Zero-schema invocation after first discovery
- **Compression** — MessagePack wire format (~30% smaller)
- **Metrics** — Cache hit rates, token savings, latency
- **Stale-while-revalidate** — Serve stale, refresh in background
- **HTTP + stdio** — Connect to MCP servers via HTTP or subprocess

## Install

```bash
pnpm add @nekte/bridge
```

## Usage

### CLI

```bash
npx nekte-bridge --mcp-url http://localhost:3000/mcp --name github --port 3100
```

### Docker

```bash
docker build -t nekte-bridge .
docker run -p 3100:3100 -v ./bridge.json:/app/bridge.json nekte-bridge
```

### Programmatic

```typescript
import { NekteBridge } from '@nekte/bridge';

const bridge = new NekteBridge({
  name: 'github',
  mcpUrl: 'http://localhost:3000/mcp',
  port: 3100,
});

await bridge.start();
```

## License

MIT
