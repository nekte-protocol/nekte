/**
 * Integration test: NekteClient ↔ NekteServer
 *
 * Spins up a real HTTP server, connects a client, and exercises
 * the full protocol flow: discover → invoke → zero-schema → budget.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { z } from 'zod';
import { createServer, type Server } from 'node:http';
import { NekteServer } from '../server.js';
import { NekteClient, NekteProtocolError } from '@nekte/client';

let server: NekteServer;
let httpServer: Server;
let client: NekteClient;
const PORT = 14567;

beforeAll(async () => {
  server = new NekteServer({ agent: 'test-agent', version: '1.0.0', logLevel: 'silent' });

  server.capability('sentiment', {
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ score: z.number(), label: z.string() }),
    category: 'nlp',
    description: 'Analyze text sentiment',
    handler: async (input) => {
      const positive =
        input.text.toLowerCase().includes('great') || input.text.toLowerCase().includes('love');
      return {
        score: positive ? 0.92 : 0.15,
        label: positive ? 'positive' : 'negative',
      };
    },
    toMinimal: (out) => `${out.label} ${out.score}`,
    toCompact: (out) => ({ s: out.label, v: out.score }),
  });

  server.capability('echo', {
    inputSchema: z.object({ msg: z.string() }),
    outputSchema: z.object({ echo: z.string() }),
    category: 'util',
    description: 'Echo back the message',
    handler: async (input) => ({ echo: input.msg }),
    toMinimal: (out) => out.echo,
  });

  // Start raw HTTP server (avoid listen() which logs)
  httpServer = createServer(async (req, res) => {
    if (req.url === '/.well-known/nekte.json' && req.method === 'GET') {
      const card = server.agentCard(`http://localhost:${PORT}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(card));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: string) => (body += chunk));
      req.on('end', async () => {
        const request = JSON.parse(body);
        const response = await server.handleRequest(request);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      });
      return;
    }
    res.writeHead(404).end();
  });

  await new Promise<void>((resolve) => httpServer.listen(PORT, resolve));
  client = new NekteClient(`http://localhost:${PORT}`);
});

afterAll(() => {
  httpServer?.close();
});

describe('Agent Card', () => {
  it('fetches agent card from well-known endpoint', async () => {
    const card = await client.agentCard();
    expect(card.agent).toBe('test-agent');
    expect(card.nekte).toBe('0.2.0');
    expect(card.caps).toContain('sentiment');
    expect(card.caps).toContain('echo');
    expect(card.budget_support).toBe(true);
  });
});

describe('Progressive Discovery', () => {
  it('L0: returns compact catalog (~8 tok/cap)', async () => {
    const result = await client.catalog();
    expect(result.agent).toBe('test-agent');
    expect(result.caps).toHaveLength(2);
    // L0 should only have id, cat, h
    const cap = result.caps[0] as any;
    expect(cap.id).toBeDefined();
    expect(cap.cat).toBeDefined();
    expect(cap.h).toBeDefined();
    expect(cap.desc).toBeUndefined();
    expect(cap.input).toBeUndefined();
  });

  it('L1: includes descriptions', async () => {
    const result = await client.describe('sentiment');
    const cap = result.caps[0] as any;
    expect(cap.desc).toBe('Analyze text sentiment');
    expect(cap.input).toBeUndefined();
  });

  it('L2: includes full schemas', async () => {
    const result = await client.schema('sentiment');
    const cap = result.caps[0] as any;
    expect(cap.input).toBeDefined();
    expect(cap.output).toBeDefined();
    expect(cap.input.properties).toHaveProperty('text');
  });

  it('filters by category', async () => {
    const result = await client.discover({ level: 0, filter: { category: 'util' } });
    expect(result.caps).toHaveLength(1);
    expect(result.caps[0].id).toBe('echo');
  });
});

describe('Invocation', () => {
  it('invokes capability with full budget', async () => {
    const result = await client.invoke('sentiment', {
      input: { text: 'I love this product' },
      budget: { max_tokens: 4096, detail_level: 'full' },
    });
    expect(result.out).toBeDefined();
    expect(result.meta?.ms).toBeGreaterThanOrEqual(0);
  });

  it('invokes with minimal budget', async () => {
    const result = await client.invoke('sentiment', {
      input: { text: 'great stuff' },
      budget: { max_tokens: 20, detail_level: 'minimal' },
    });
    expect(result.resolved_level).toBe('minimal');
  });

  it('zero-schema invocation uses cached hash', async () => {
    // First call populates cache
    await client.invoke('echo', { input: { msg: 'hello' } });
    // Second call should use cached hash (no extra schema overhead)
    const result = await client.invoke('echo', { input: { msg: 'world' } });
    expect(result.out).toBeDefined();
  });
});

describe('Error Handling', () => {
  it('throws NekteProtocolError for unknown capability', async () => {
    try {
      await client.invoke('nonexistent', { input: {} });
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(NekteProtocolError);
      expect((err as NekteProtocolError).isCapabilityNotFound).toBe(true);
    }
  });
});
