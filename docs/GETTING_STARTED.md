# Getting Started with NEKTE

This guide walks you through building two agents that communicate via the NEKTE protocol, then adding a bridge in front of an MCP server.

## Prerequisites

- Node.js 20+
- pnpm 9+

## 1. Create a NEKTE Server (Agent)

```typescript
// server.ts
import { z } from 'zod';
import { NekteServer } from '@nekte/server';

const server = new NekteServer({
  agent: 'weather-agent',
  version: '1.0.0',
});

// Register a capability with typed schemas
server.capability('get-weather', {
  inputSchema: z.object({
    city: z.string(),
    units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
  outputSchema: z.object({
    temp: z.number(),
    condition: z.string(),
  }),
  category: 'weather',
  description: 'Get current weather for a city',
  handler: async (input) => ({
    temp: 22,
    condition: 'sunny',
  }),
  // Multi-level result compression
  toMinimal: (out) => `${out.temp}° ${out.condition}`,
  toCompact: (out) => ({ t: out.temp, c: out.condition }),
});

server.listen(4001);
```

Run it:
```bash
npx tsx server.ts
```

## 2. Create a NEKTE Client

```typescript
// client.ts
import { NekteClient } from '@nekte/client';

const client = new NekteClient('http://localhost:4001');

// Step 1: Discover what the agent can do (~8 tokens per capability)
const catalog = await client.catalog();
console.log('Capabilities:', catalog.caps.map(c => c.id));

// Step 2: Get details about a specific capability (~40 tokens)
const detail = await client.describe('get-weather');
console.log('Description:', (detail.caps[0] as any).desc);

// Step 3: Invoke with a token budget
const result = await client.invoke('get-weather', {
  input: { city: 'Madrid' },
  budget: { max_tokens: 50, detail_level: 'minimal' },
});
console.log('Result:', result.out);
// → { text: "22° sunny" }

// Step 4: Second invocation — zero-schema (0 extra tokens!)
const result2 = await client.invoke('get-weather', {
  input: { city: 'Tokyo' },
});
console.log('Result2:', result2.out);
```

Run it:
```bash
npx tsx client.ts
```

## 3. Bridge an MCP Server

If you have existing MCP servers, drop the bridge in front:

```bash
# Via CLI
npx nekte-bridge --mcp-url http://localhost:3000/mcp --name my-mcp --port 3100

# Or with a config file
npx nekte-bridge --config bridge.json
```

Example `bridge.json`:
```json
{
  "name": "my-bridge",
  "mcpServers": [
    {
      "name": "github",
      "url": "http://localhost:3000/mcp",
      "category": "dev"
    },
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      "category": "fs"
    }
  ],
  "port": 3100
}
```

Now your NEKTE client talks to the bridge, which translates to MCP behind the scenes:

```typescript
const client = new NekteClient('http://localhost:3100');
const catalog = await client.catalog(); // All MCP tools as NEKTE capabilities
```

## 4. Add Authentication

```typescript
import { NekteServer, bearerAuth } from '@nekte/server';

const server = new NekteServer({
  agent: 'secure-agent',
  auth: 'bearer',
  authHandler: bearerAuth(['my-secret-token']),
});
```

Clients send the token:
```typescript
const client = new NekteClient('http://localhost:4001', {
  headers: { Authorization: 'Bearer my-secret-token' },
});
```

## 5. Use WebSocket Transport

For low-latency, bidirectional communication:

```typescript
import { NekteServer, createWsTransport } from '@nekte/server';

const server = new NekteServer({ agent: 'realtime-agent' });
// ... register capabilities ...

// HTTP for discovery
server.listen(4001);

// WebSocket for invocations
const ws = createWsTransport(server, { port: 4002 });
```

## Key Concepts

| Concept | What it means |
|---------|--------------|
| **L0/L1/L2** | Discovery levels: catalog (8 tok) → summary (40 tok) → full schema (120 tok) |
| **Version hash** | 8-char hash of a capability's contract. If unchanged, skip schema reload |
| **Token budget** | `{ max_tokens, detail_level }` — the receiver adapts response granularity |
| **Multi-level result** | Same data in minimal/compact/full representations |

## Next Steps

- Read the [full protocol specification](./SPEC.md)
- Run `pnpm demo` to see the two-agent demo
- Run `pnpm benchmark` to see token savings numbers
- Check the [CONTRIBUTING guide](../CONTRIBUTING.md) to contribute
