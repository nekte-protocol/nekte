/**
 * NekteClient — NEKTE protocol client
 *
 * Connects to a NEKTE server (or bridge) with:
 * - Progressive discovery (L0 → L1 → L2 on demand)
 * - Zero-schema invocation (version hash cache)
 * - Token budget propagation
 */

import type {
  AgentCard,
  Capability,
  ContextEnvelope,
  DelegateParams,
  DiscoverParams,
  DiscoverResult,
  DiscoveryLevel,
  InvokeParams,
  InvokeResult,
  NekteRequest,
  NekteResponse,
  SseEvent,
  Task,
  TaskResult,
  TokenBudget,
  VerifyParams,
} from '@nekte/core';
import { createBudget, NEKTE_ERRORS, WELL_KNOWN_PATH, parseSseEvent } from '@nekte/core';
import { CapabilityCache, type CacheConfig } from './cache.js';
import type { SharedCache } from './shared-cache.js';

// ---------------------------------------------------------------------------
// Typed error
// ---------------------------------------------------------------------------

export class NekteProtocolError extends Error {
  readonly code: number;
  readonly nekteError: { code: number; message: string; data?: unknown };

  constructor(code: number, message: string, data?: unknown) {
    super(message);
    this.name = 'NekteProtocolError';
    this.code = code;
    this.nekteError = { code, message, data };
  }

  get isVersionMismatch(): boolean { return this.code === NEKTE_ERRORS.VERSION_MISMATCH; }
  get isCapabilityNotFound(): boolean { return this.code === NEKTE_ERRORS.CAPABILITY_NOT_FOUND; }
  get isBudgetExceeded(): boolean { return this.code === NEKTE_ERRORS.BUDGET_EXCEEDED; }
  get isContextExpired(): boolean { return this.code === NEKTE_ERRORS.CONTEXT_EXPIRED; }
  get isTaskTimeout(): boolean { return this.code === NEKTE_ERRORS.TASK_TIMEOUT; }
  get isTaskFailed(): boolean { return this.code === NEKTE_ERRORS.TASK_FAILED; }
}

// ---------------------------------------------------------------------------
// Client config
// ---------------------------------------------------------------------------

export interface NekteClientConfig {
  /** Cache configuration */
  cache?: CacheConfig;
  /** Shared cache for cross-agent cache sharing */
  sharedCache?: SharedCache;
  /** Default token budget for requests */
  defaultBudget?: Partial<TokenBudget>;
  /** HTTP headers to include in requests (e.g. auth) */
  headers?: Record<string, string>;
  /** Request timeout in ms. Default: 30000 */
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// NekteClient
// ---------------------------------------------------------------------------

export class NekteClient {
  readonly endpoint: string;
  readonly cache: CapabilityCache;
  private config: NekteClientConfig;
  private agentId: string | undefined;
  private requestId = 0;

  constructor(endpoint: string, config?: NekteClientConfig) {
    this.endpoint = endpoint.replace(/\/$/, '');
    this.config = config ?? {};

    // If shared cache is provided, use its store as the backing store
    const cacheConfig: CacheConfig = { ...config?.cache };
    if (config?.sharedCache) {
      cacheConfig.store = config.sharedCache.store();
    }
    this.cache = new CapabilityCache(cacheConfig);
  }

  // -----------------------------------------------------------------------
  // Agent Card
  // -----------------------------------------------------------------------

  /**
   * Fetch the Agent Card from the well-known endpoint.
   * Ultra-compact: ~50 tokens.
   */
  async agentCard(): Promise<AgentCard> {
    const res = await this.httpGet(`${this.endpoint}${WELL_KNOWN_PATH}`);
    const card = res as AgentCard;
    this.agentId = card.agent;
    return card;
  }

  // -----------------------------------------------------------------------
  // Discovery — progressive, never eager
  // -----------------------------------------------------------------------

  /**
   * Discover capabilities at the specified level.
   *
   * L0 (~8 tok/cap): Just IDs, categories, and version hashes
   * L1 (~40 tok/cap): + descriptions and cost hints
   * L2 (~120 tok/cap): + full JSON schemas and examples
   */
  async discover(params: DiscoverParams): Promise<DiscoverResult> {
    const result = await this.rpc<DiscoverResult>('nekte.discover', params);

    // Cache all returned capabilities
    if (this.agentId) {
      for (const cap of result.caps) {
        this.cache.set(this.agentId, cap, params.level);
      }
    }

    if (!this.agentId) {
      this.agentId = result.agent;
    }

    return result;
  }

  /**
   * Convenience: discover L0 catalog.
   */
  async catalog(filter?: DiscoverParams['filter']): Promise<DiscoverResult> {
    return this.discover({ level: 0, filter });
  }

  /**
   * Convenience: get L1 summary for a specific capability.
   */
  async describe(capId: string): Promise<DiscoverResult> {
    return this.discover({ level: 1, filter: { id: capId } });
  }

  /**
   * Convenience: get L2 full schema for a specific capability.
   */
  async schema(capId: string): Promise<DiscoverResult> {
    return this.discover({ level: 2, filter: { id: capId } });
  }

  // -----------------------------------------------------------------------
  // Invoke — zero-schema when possible
  // -----------------------------------------------------------------------

  /**
   * Invoke a capability.
   *
   * If a version hash is cached, sends it for zero-schema invocation.
   * If the hash is stale (VERSION_MISMATCH), automatically retries
   * with the updated schema — no extra round-trip needed.
   */
  async invoke(
    capId: string,
    options: {
      input: Record<string, unknown>;
      budget?: Partial<TokenBudget>;
    },
  ): Promise<InvokeResult> {
    const agentId = this.agentId ?? 'unknown';
    const cachedHash = this.cache.getHash(agentId, capId);
    const budget = createBudget(options.budget ?? this.config.defaultBudget);

    const params: InvokeParams = {
      cap: capId,
      h: cachedHash,
      in: options.input,
      budget,
    };

    try {
      return await this.rpc<InvokeResult>('nekte.invoke', params);
    } catch (err) {
      // Handle VERSION_MISMATCH — update cache and retry
      if (err instanceof NekteProtocolError && err.isVersionMismatch) {
        const data = err.nekteError.data as { schema?: Capability } | undefined;
        if (data?.schema) {
          this.cache.set(agentId, data.schema, 2);
        }

        // Retry without hash (force fresh)
        const retryParams: InvokeParams = {
          cap: capId,
          in: options.input,
          budget,
        };
        return this.rpc<InvokeResult>('nekte.invoke', retryParams);
      }

      throw err;
    }
  }

  // -----------------------------------------------------------------------
  // Delegate
  // -----------------------------------------------------------------------

  /**
   * Delegate a task to this agent.
   */
  async delegate(
    task: Omit<Task, 'budget'> & { budget?: Partial<TokenBudget> },
    context?: ContextEnvelope,
  ): Promise<TaskResult> {
    const params: DelegateParams = {
      task: {
        ...task,
        budget: createBudget(task.budget),
      },
      context,
    };

    return this.rpc<TaskResult>('nekte.delegate', params);
  }

  /**
   * Delegate a task with SSE streaming.
   * Returns an async iterator that yields SSE events as they arrive.
   *
   * @example
   * ```ts
   * for await (const event of client.delegateStream(task)) {
   *   if (event.event === 'progress') console.log(`${event.data.processed}/${event.data.total}`);
   *   if (event.event === 'complete') console.log('Done:', event.data.out);
   * }
   * ```
   */
  async *delegateStream(
    task: Omit<Task, 'budget'> & { budget?: Partial<TokenBudget> },
    context?: ContextEnvelope,
  ): AsyncGenerator<SseEvent> {
    const params: DelegateParams = {
      task: {
        ...task,
        budget: createBudget(task.budget),
      },
      context,
    };

    const request: NekteRequest = {
      jsonrpc: '2.0',
      method: 'nekte.delegate',
      id: ++this.requestId,
      params,
    };

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      task.timeout_ms ?? this.config.timeoutMs ?? 60_000,
    );

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new NekteProtocolError(-32000, `HTTP ${res.status}: ${res.statusText}`);
      }

      if (!res.body) {
        throw new NekteProtocolError(-32000, 'No response body for SSE stream');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by double newlines
        const parts = buffer.split('\n\n');
        buffer = parts.pop()!; // keep incomplete part

        for (const part of parts) {
          if (!part.trim()) continue;
          const event = parseSseEvent(part);
          if (event) yield event;
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        const event = parseSseEvent(buffer);
        if (event) yield event;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  // -----------------------------------------------------------------------
  // Verify
  // -----------------------------------------------------------------------

  /**
   * Verify a task result.
   */
  async verify(
    taskId: string,
    checks: VerifyParams['checks'] = ['hash', 'sample', 'source'],
    budget?: Partial<TokenBudget>,
  ): Promise<unknown> {
    return this.rpc('nekte.verify', {
      task_id: taskId,
      checks,
      budget: budget ? createBudget(budget) : undefined,
    });
  }

  // -----------------------------------------------------------------------
  // Transport
  // -----------------------------------------------------------------------

  private async rpc<T>(method: string, params: unknown): Promise<T> {
    const request: NekteRequest = {
      jsonrpc: '2.0',
      method: method as any,
      id: ++this.requestId,
      params,
    };

    const response = await this.httpPost(this.endpoint, request);
    const rpcResponse = response as NekteResponse<T>;

    if (rpcResponse.error) {
      throw new NekteProtocolError(
        rpcResponse.error.code,
        rpcResponse.error.message,
        rpcResponse.error.data,
      );
    }

    return rpcResponse.result as T;
  }

  private async httpPost(url: string, body: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs ?? 30_000,
    );

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  private async httpGet(url: string): Promise<unknown> {
    const res = await fetch(url, {
      headers: this.config.headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }
}
