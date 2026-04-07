#!/usr/bin/env node

/**
 * nekte — NEKTE Protocol CLI
 *
 * Interact with NEKTE agents from the command line.
 *
 * Usage:
 *   nekte discover <url> [--level 0|1|2] [--filter <query>]
 *   nekte invoke <url> <capability> --input '{"key":"value"}' [--budget <tokens>]
 *   nekte health <url>
 *   nekte card <url>
 *   nekte bench <url>
 */

import { NekteClient } from '@nekte/client';
import { estimateTokens, compareSizes } from '@nekte/core';
import type { DiscoveryLevel, Capability, CapabilitySummary, CapabilitySchema } from '@nekte/core';

const HELP = `
nekte — NEKTE Protocol CLI v0.2

Usage:
  nekte discover <url> [options]    Progressive capability discovery
  nekte invoke <url> <cap> [opts]   Invoke a capability
  nekte health <url>                Check bridge/agent health
  nekte card <url>                  Fetch Agent Card
  nekte bench <url>                 Compare JSON vs MessagePack sizes

Options (discover):
  --level, -l <0|1|2>    Discovery level (default: 0)
  --filter, -f <query>   Filter capabilities by keyword
  --category, -c <cat>   Filter by category

Options (invoke):
  --input, -i <json>     Input data as JSON string (required)
  --budget, -b <tokens>  Max tokens for response (default: 500)
  --detail, -d <level>   Detail level: minimal|compact|full (default: compact)

Examples:
  nekte discover http://localhost:4001
  nekte discover http://localhost:4001 -l 1 -c nlp
  nekte invoke http://localhost:4001 sentiment -i '{"text":"Great!"}'
  nekte invoke http://localhost:4001 sentiment -i '{"text":"Bad"}' -b 20 -d minimal
  nekte health http://localhost:3100
`.trim();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  const command = args[0];
  const url = args[1];

  if (!url) {
    console.error('Error: URL is required');
    console.error('Run: nekte --help');
    process.exit(1);
  }

  const client = new NekteClient(url);

  try {
    switch (command) {
      case 'discover':
        await cmdDiscover(client, args.slice(2));
        break;
      case 'invoke':
        await cmdInvoke(client, args.slice(2));
        break;
      case 'health':
        await cmdHealth(url);
        break;
      case 'card':
        await cmdCard(client);
        break;
      case 'bench':
        await cmdBench(client);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run: nekte --help');
        process.exit(1);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${msg}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdDiscover(client: NekteClient, args: string[]) {
  const level = (parseArg(args, '--level', '-l') ?? '0') as string;
  const filter = parseArg(args, '--filter', '-f');
  const category = parseArg(args, '--category', '-c');

  const result = await client.discover({
    level: parseInt(level) as DiscoveryLevel,
    filter:
      filter || category
        ? { query: filter ?? undefined, category: category ?? undefined }
        : undefined,
  });

  console.log(`Agent: ${result.agent}${result.v ? ` v${result.v}` : ''}`);
  console.log(`Capabilities: ${result.caps.length}`);
  console.log(`Discovery level: L${level}`);
  console.log('---');

  for (const cap of result.caps) {
    printCapability(cap, parseInt(level) as DiscoveryLevel);
  }

  console.log(`\n~${estimateTokens(result)} tokens`);
}

async function cmdInvoke(client: NekteClient, args: string[]) {
  const capId = args[0];
  if (!capId) {
    console.error('Error: capability ID is required');
    process.exit(1);
  }

  const inputStr = parseArg(args.slice(1), '--input', '-i');
  if (!inputStr) {
    console.error('Error: --input is required');
    process.exit(1);
  }

  const budgetStr = parseArg(args.slice(1), '--budget', '-b');
  const detailStr = parseArg(args.slice(1), '--detail', '-d');

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(inputStr);
  } catch {
    console.error('Error: --input must be valid JSON');
    process.exit(1);
  }

  const result = await client.invoke(capId, {
    input,
    budget: {
      max_tokens: budgetStr ? parseInt(budgetStr) : 500,
      detail_level: (detailStr as 'minimal' | 'compact' | 'full') ?? 'compact',
    },
  });

  console.log(`Capability: ${capId}`);
  console.log(`Level: ${result.resolved_level ?? 'unknown'}`);
  if (result.meta?.ms !== undefined) console.log(`Time: ${result.meta.ms}ms`);
  console.log('---');
  console.log(JSON.stringify(result.out, null, 2));
  console.log(`\n~${estimateTokens(result.out)} tokens`);
}

async function cmdHealth(url: string) {
  const res = await fetch(`${url.replace(/\/$/, '')}/health`);
  if (!res.ok) {
    console.error(`Health check failed: HTTP ${res.status}`);
    process.exit(1);
  }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

async function cmdCard(client: NekteClient) {
  const card = await client.agentCard();
  console.log(JSON.stringify(card, null, 2));
}

async function cmdBench(client: NekteClient) {
  const result = await client.discover({ level: 0 });
  const sizes = compareSizes(result as unknown as Record<string, unknown>);

  console.log('Wire format comparison for L0 discover response:');
  console.log(`  JSON:        ${sizes.json_bytes} bytes`);
  console.log(`  MessagePack: ${sizes.msgpack_bytes} bytes`);
  console.log(`  Savings:     ${sizes.savings_pct}%`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseArg(args: string[], long: string, short: string): string | null {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === long || args[i] === short) {
      return args[i + 1] ?? null;
    }
  }
  return null;
}

function printCapability(cap: Capability, level: DiscoveryLevel) {
  console.log(`  ${cap.id}  [${cap.cat}]  h:${cap.h}`);
  if (level >= 1 && 'desc' in cap) {
    console.log(`    ${(cap as CapabilitySummary).desc}`);
    const cost = (cap as CapabilitySummary).cost;
    if (cost) console.log(`    cost: ${cost.avg_ms ?? '?'}ms, ${cost.avg_tokens ?? '?'} tokens`);
  }
  if (level >= 2 && 'input' in cap) {
    const schema = cap as CapabilitySchema;
    const props = (schema.input as Record<string, unknown>)?.properties as
      | Record<string, unknown>
      | undefined;
    if (props) {
      const inputs = Object.keys(props).join(', ');
      console.log(`    input: { ${inputs} }`);
    }
  }
}

main();
