#!/usr/bin/env node

/**
 * nekte-bridge CLI
 *
 * Usage:
 *   nekte-bridge --config bridge.json
 *   nekte-bridge --mcp-url https://mcp.example.com/sse --name my-tools
 *
 * Config file format (bridge.json):
 * {
 *   "name": "my-bridge",
 *   "port": 3100,
 *   "mcpServers": [
 *     { "name": "github", "url": "https://mcp-github.example.com/sse", "category": "dev" },
 *     { "name": "slack", "url": "https://mcp-slack.example.com/sse", "category": "comms" }
 *   ]
 * }
 */

import { readFileSync } from 'node:fs';
import { NekteBridge, type BridgeConfig } from './bridge.js';

async function main() {
  const args = process.argv.slice(2);

  let config: BridgeConfig;

  // Parse --config flag
  const configIdx = args.indexOf('--config');
  if (configIdx !== -1 && args[configIdx + 1]) {
    const configPath = args[configIdx + 1];
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  }
  // Parse inline --mcp-url
  else if (args.includes('--mcp-url')) {
    const urlIdx = args.indexOf('--mcp-url');
    const url = args[urlIdx + 1];
    const nameIdx = args.indexOf('--name');
    const name = nameIdx !== -1 ? args[nameIdx + 1] : 'mcp-server';
    const portIdx = args.indexOf('--port');
    const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 3100;

    config = {
      name: 'nekte-bridge',
      port,
      mcpServers: [{ name, url }],
    };
  } else {
    console.log(`
nekte-bridge — MCP-to-NEKTE proxy

Usage:
  nekte-bridge --config bridge.json
  nekte-bridge --mcp-url <url> [--name <name>] [--port <port>]

Options:
  --config <path>     Path to bridge configuration JSON
  --mcp-url <url>     MCP server URL (streamable HTTP)
  --name <name>       Name for the MCP server (default: mcp-server)
  --port <port>       Port for the bridge (default: 3100)

Example:
  nekte-bridge --mcp-url https://mcp.example.com/sse --name github --port 3100
    `);
    process.exit(0);
  }

  const bridge = new NekteBridge(config);
  await bridge.init();
  await bridge.listen();
}

main().catch((err) => {
  console.error('[nekte-bridge] Fatal:', err);
  process.exit(1);
});
