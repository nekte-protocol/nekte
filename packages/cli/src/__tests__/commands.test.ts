import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { NekteClient } from '@nekte/client';
import { cmdDiscover, cmdInvoke, cmdHealth, cmdCard, cmdBench, printCapability } from '../index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockClient(overrides: Partial<Record<keyof NekteClient, unknown>> = {}): NekteClient {
  return {
    discover: vi.fn().mockResolvedValue({
      agent: 'test-agent',
      v: '1.0',
      caps: [{ id: 'echo', cat: 'util', h: 'abcd1234' }],
    }),
    invoke: vi.fn().mockResolvedValue({
      out: { result: 'ok' },
      resolved_level: 'compact',
      meta: { ms: 5 },
    }),
    agentCard: vi.fn().mockResolvedValue({
      nekte: '0.2.0',
      agent: 'test-agent',
      endpoint: 'http://localhost:4001',
      caps: ['echo'],
      auth: 'none',
      budget_support: true,
    }),
    ...overrides,
  } as unknown as NekteClient;
}

let logSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error('process.exit');
  }) as never);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// cmdDiscover
// ---------------------------------------------------------------------------

describe('cmdDiscover', () => {
  it('calls client.discover with default level 0', async () => {
    const client = mockClient();
    await cmdDiscover(client, []);

    expect(client.discover).toHaveBeenCalledWith({
      level: 0,
      filter: undefined,
    });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('test-agent'));
  });

  it('passes level and filter options', async () => {
    const client = mockClient();
    await cmdDiscover(client, ['--level', '2', '--filter', 'nlp', '--category', 'util']);

    expect(client.discover).toHaveBeenCalledWith({
      level: 2,
      filter: { query: 'nlp', category: 'util' },
    });
  });

  it('outputs capability count', async () => {
    const client = mockClient();
    await cmdDiscover(client, []);

    expect(logSpy).toHaveBeenCalledWith('Capabilities: 1');
  });
});

// ---------------------------------------------------------------------------
// cmdInvoke
// ---------------------------------------------------------------------------

describe('cmdInvoke', () => {
  it('invokes capability with parsed JSON input', async () => {
    const client = mockClient();
    await cmdInvoke(client, ['echo', '--input', '{"msg":"hello"}']);

    expect(client.invoke).toHaveBeenCalledWith('echo', {
      input: { msg: 'hello' },
      budget: { max_tokens: 500, detail_level: 'compact' },
    });
  });

  it('passes custom budget and detail level', async () => {
    const client = mockClient();
    await cmdInvoke(client, ['echo', '--input', '{"msg":"hi"}', '--budget', '100', '--detail', 'minimal']);

    expect(client.invoke).toHaveBeenCalledWith('echo', {
      input: { msg: 'hi' },
      budget: { max_tokens: 100, detail_level: 'minimal' },
    });
  });

  it('exits with error when capability ID missing', async () => {
    const client = mockClient();
    await expect(cmdInvoke(client, [])).rejects.toThrow('process.exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('capability ID'));
  });

  it('exits with error when --input missing', async () => {
    const client = mockClient();
    await expect(cmdInvoke(client, ['echo'])).rejects.toThrow('process.exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--input is required'));
  });

  it('exits with error on invalid JSON input', async () => {
    const client = mockClient();
    await expect(cmdInvoke(client, ['echo', '--input', '{bad}'])).rejects.toThrow('process.exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('valid JSON'));
  });
});

// ---------------------------------------------------------------------------
// cmdHealth
// ---------------------------------------------------------------------------

describe('cmdHealth', () => {
  it('fetches health endpoint and logs result', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', uptime: 1234 }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await cmdHealth('http://localhost:3100');

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3100/health');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('ok'));
  });

  it('exits on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(cmdHealth('http://localhost:3100')).rejects.toThrow('process.exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('503'));
  });

  it('strips trailing slash from URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await cmdHealth('http://localhost:3100/');
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3100/health');
  });
});

// ---------------------------------------------------------------------------
// cmdCard
// ---------------------------------------------------------------------------

describe('cmdCard', () => {
  it('fetches and logs agent card as JSON', async () => {
    const client = mockClient();
    await cmdCard(client);

    expect(client.agentCard).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('test-agent'));
  });
});

// ---------------------------------------------------------------------------
// cmdBench
// ---------------------------------------------------------------------------

describe('cmdBench', () => {
  it('runs discover and logs wire format comparison', async () => {
    const client = mockClient();
    await cmdBench(client);

    expect(client.discover).toHaveBeenCalledWith({ level: 0 });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Wire format'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('JSON'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('MessagePack'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Savings'));
  });
});

// ---------------------------------------------------------------------------
// printCapability
// ---------------------------------------------------------------------------

describe('printCapability', () => {
  it('prints id, category and hash for L0', () => {
    printCapability({ id: 'echo', cat: 'util', h: 'abc123' }, 0);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('echo'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('util'));
  });

  it('prints description for L1', () => {
    printCapability({ id: 'echo', cat: 'util', h: 'abc123', desc: 'Echo back', cost: { avg_ms: 5 } }, 1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Echo back'));
  });

  it('prints input properties for L2', () => {
    printCapability(
      {
        id: 'echo',
        cat: 'util',
        h: 'abc123',
        desc: 'Echo back',
        input: { properties: { msg: { type: 'string' } } },
        output: { properties: { echo: { type: 'string' } } },
      },
      2,
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('msg'));
  });
});
