/**
 * NekteServer — NEKTE protocol server
 *
 * Register capabilities, handle discovery/invocation/delegation,
 * and serve over HTTP or other transports.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { z } from 'zod';
import {
  type AgentCard,
  type CapabilitySchema,
  type ContextEnvelope,
  type DelegateParams,
  type DiscoverParams,
  type DiscoverResult,
  type InvokeParams,
  type InvokeResult,
  type NekteError,
  type NekteMethod,
  type NekteRequest,
  type NekteResponse,
  type VerifyParams,
  NEKTE_ERRORS,
  NEKTE_VERSION,
  WELL_KNOWN_PATH,
  resolveBudget,
  createBudget,
  createLogger,
  type Logger,
  type LogLevel,
} from '@nekte/core';
import { projectCapability } from '@nekte/core';
import {
  CapabilityRegistry,
  type CapabilityConfig,
  type HandlerContext,
} from './capability.js';
import { noAuth, type AuthHandler } from './auth.js';
import type { CapabilityFilterStrategy, FilterableCapability } from '@nekte/core';
import { SseStream } from './sse-stream.js';

export type DelegateHandler = (
  task: import('@nekte/core').Task,
  stream: SseStream,
  context?: ContextEnvelope,
) => Promise<void>;

// ---------------------------------------------------------------------------
// Server config
// ---------------------------------------------------------------------------

export interface NekteServerConfig {
  /** Agent name */
  agent: string;
  /** Agent version */
  version?: string;
  /** Auth method advertised in agent card */
  auth?: 'bearer' | 'apikey' | 'none';
  /** Log level. Default: 'info' */
  logLevel?: LogLevel;
  /** Auth handler for HTTP requests. Default: noAuth() */
  authHandler?: AuthHandler;
  /** Capability filter strategy. Default: keyword matching */
  filterStrategy?: CapabilityFilterStrategy;
}

// ---------------------------------------------------------------------------
// NekteServer
// ---------------------------------------------------------------------------

export class NekteServer {
  readonly config: NekteServerConfig;
  readonly registry: CapabilityRegistry;
  readonly log: Logger;
  private readonly auth: AuthHandler;
  private delegateHandler?: DelegateHandler;
  private readonly filterStrategy?: CapabilityFilterStrategy;
  private contexts = new Map<string, ContextEnvelope>();
  private taskResults = new Map<string, unknown>();

  constructor(config: NekteServerConfig) {
    this.config = config;
    this.registry = new CapabilityRegistry();
    this.log = createLogger(`nekte:${config.agent}`, config.logLevel);
    this.auth = config.authHandler ?? noAuth();
    this.filterStrategy = config.filterStrategy;
  }

  /**
   * Register a capability with typed schemas.
   */
  capability<TIn, TOut>(
    id: string,
    config: CapabilityConfig<TIn, TOut>,
  ): this {
    this.registry.register(id, config);
    return this;
  }

  /**
   * Register a streaming delegate handler.
   * When set, `nekte.delegate` uses SSE to stream progress/results.
   */
  onDelegate(handler: DelegateHandler): this {
    this.delegateHandler = handler;
    return this;
  }

  /**
   * Generate the Agent Card for this server.
   */
  agentCard(endpoint: string): AgentCard {
    return {
      nekte: NEKTE_VERSION,
      agent: this.config.agent,
      endpoint,
      caps: this.registry.all().map((c) => c.id),
      auth: this.config.auth ?? 'none',
      budget_support: true,
    };
  }

  /**
   * Handle a NEKTE JSON-RPC request.
   */
  async handleRequest(request: NekteRequest): Promise<NekteResponse> {
    const { method, id, params } = request;

    try {
      switch (method) {
        case 'nekte.discover':
          return this.ok(id, await this.handleDiscover(params as DiscoverParams));
        case 'nekte.invoke':
          return this.ok(id, await this.handleInvoke(params as InvokeParams));
        case 'nekte.delegate':
          return this.ok(id, await this.handleDelegate(params as DelegateParams));
        case 'nekte.context':
          return this.ok(id, await this.handleContext(params as any));
        case 'nekte.verify':
          return this.ok(id, await this.handleVerify(params as VerifyParams));
        default:
          return this.error(id, -32601, `Method not found: ${method}`);
      }
    } catch (err: any) {
      if (err?.nekteError) {
        return { jsonrpc: '2.0', id, error: err.nekteError };
      }
      const code = typeof err?.code === 'number' ? err.code : -32000;
      const message = err instanceof Error ? err.message : String(err);
      return this.error(id, code, message);
    }
  }

  // -------------------------------------------------------------------------
  // Method handlers
  // -------------------------------------------------------------------------

  private async handleDiscover(params: DiscoverParams): Promise<DiscoverResult> {
    let caps = this.registry.filter(params.filter);

    // Apply semantic/hybrid filtering if strategy is configured and query is present
    if (this.filterStrategy && params.filter?.query) {
      const filterables: FilterableCapability[] = caps.map((c) => ({
        id: c.id,
        category: c.schema.cat,
        description: c.schema.desc,
      }));

      const ranked = await this.filterStrategy.filter(filterables, params.filter.query, {
        top_k: params.filter.top_k,
        threshold: params.filter.threshold,
        category: params.filter.category,
      });

      const rankedIds = new Set(ranked.map((r) => r.id));
      const rankedOrder = new Map(ranked.map((r, i) => [r.id, i]));
      caps = caps
        .filter((c) => rankedIds.has(c.id))
        .sort((a, b) => (rankedOrder.get(a.id) ?? 0) - (rankedOrder.get(b.id) ?? 0));
    }

    return {
      agent: this.config.agent,
      v: this.config.version,
      caps: caps.map((c) => projectCapability(c.schema, params.level)),
    };
  }

  private async handleInvoke(params: InvokeParams): Promise<InvokeResult> {
    const cap = this.registry.get(params.cap);
    if (!cap) {
      throw Object.assign(new Error(`Capability not found: ${params.cap}`), {
        nekteError: {
          code: NEKTE_ERRORS.CAPABILITY_NOT_FOUND,
          message: 'CAPABILITY_NOT_FOUND',
        },
      });
    }

    // Check version hash — zero-schema invocation
    if (params.h && params.h !== cap.versionHash) {
      const err: NekteError = {
        code: NEKTE_ERRORS.VERSION_MISMATCH,
        message: 'VERSION_MISMATCH',
        data: {
          current_hash: cap.versionHash,
          schema: projectCapability(cap.schema, 2),
        },
      };
      throw Object.assign(new Error('VERSION_MISMATCH'), { nekteError: err });
    }

    const budget = params.budget ?? createBudget();
    const ctx: HandlerContext = { budget };

    const multiLevel = await this.registry.invoke(params.cap, params.in, ctx);
    const resolved = resolveBudget(multiLevel, budget);

    return {
      out: resolved.data as Record<string, unknown>,
      resolved_level: resolved.level,
      meta: {
        ms: (multiLevel.full as any)?._meta?.ms,
      },
    };
  }

  private async handleDelegate(params: DelegateParams): Promise<unknown> {
    // Store context if provided
    if (params.context) {
      this.contexts.set(params.context.id, params.context);
    }

    // For now, delegate maps to invoke if a matching capability exists
    // In v0.3, this will support complex task orchestration
    const caps = this.registry.all();
    if (caps.length === 0) {
      throw new Error('No capabilities registered to handle delegation');
    }

    // Find best matching capability based on task description
    // Simple heuristic: first capability that matches any word in the description
    // TODO(v0.3): Replace naive keyword matching with proper capability resolution
    const words = params.task.desc.toLowerCase().split(/\s+/);
    const match = caps.find((c) =>
      words.some(
        (w) =>
          c.id.toLowerCase().includes(w) ||
          c.schema.desc.toLowerCase().includes(w),
      ),
    );

    if (!match) {
      return {
        task_id: params.task.id,
        status: 'failed',
        error: { code: 'NO_MATCHING_CAPABILITY', message: 'No capability matches the task' },
      };
    }

    const result = await this.registry.invoke(match.id, params.task, {
      budget: params.task.budget,
      context: params.context,
      taskId: params.task.id,
    });

    return {
      task_id: params.task.id,
      status: 'completed',
      out: result,
    };
  }

  // TODO(v0.3): Enforce TTL expiration on stored context envelopes
  private async handleContext(params: { action: string; envelope: ContextEnvelope }): Promise<unknown> {
    switch (params.action) {
      case 'share':
        this.contexts.set(params.envelope.id, params.envelope);
        return { id: params.envelope.id, status: 'stored' };
      case 'request':
        return this.contexts.get(params.envelope.id) ?? null;
      case 'revoke':
        this.contexts.delete(params.envelope.id);
        return { id: params.envelope.id, status: 'revoked' };
      default:
        throw new Error(`Unknown context action: ${params.action}`);
    }
  }

  private async handleVerify(params: VerifyParams): Promise<unknown> {
    // v0.2: basic verification stub
    // v0.4 will add full hash verification, sampling, and source tracking
    // TODO(v0.4): Implement full verification — hash validation, sampling, source metadata
    return {
      task_id: params.task_id,
      checks: params.checks,
      status: 'verified',
      note: 'Full verification available in NEKTE v0.4',
    };
  }

  // -------------------------------------------------------------------------
  // HTTP transport
  // -------------------------------------------------------------------------

  /**
   * Start an HTTP server for this NEKTE agent.
   */
  listen(port: number, hostname = '0.0.0.0'): Promise<void> {
    return new Promise((resolve) => {
      const server = createServer(async (req, res) => {
        // Agent Card discovery
        if (req.url === WELL_KNOWN_PATH && req.method === 'GET') {
          const card = this.agentCard(`http://${hostname}:${port}`);
          this.sendJson(res, 200, card);
          return;
        }

        // NEKTE endpoint
        if (req.method === 'POST') {
          // Auth check
          const authResult = await this.auth(req);
          if (!authResult.ok) {
            this.sendJson(res, authResult.status, { error: authResult.message });
            return;
          }

          try {
            const body = await this.readBody(req);
            const request = JSON.parse(body) as NekteRequest;

            // SSE streaming for delegate when handler is registered
            if (request.method === 'nekte.delegate' && this.delegateHandler) {
              const params = request.params as DelegateParams;
              const stream = new SseStream(res);
              try {
                await this.delegateHandler(params.task, stream, params.context);
                if (!stream.isClosed) stream.close();
              } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (!stream.isClosed) stream.error(-32007, msg, params.task.id);
              }
              return;
            }

            const response = await this.handleRequest(request);
            this.sendJson(res, 200, response);
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Internal error';
            this.sendJson(res, 500, this.error(0, -32000, message));
          }
          return;
        }

        res.writeHead(404).end();
      });

      server.listen(port, hostname, () => {
        this.log.info(`${this.config.agent} listening on http://${hostname}:${port}`);
        this.log.info(`Agent Card: http://${hostname}:${port}${WELL_KNOWN_PATH}`);
        resolve();
      });
    });
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private ok(id: string | number, result: unknown): NekteResponse {
    return { jsonrpc: '2.0', id, result };
  }

  private error(id: string | number, code: number, message: string, data?: unknown): NekteResponse {
    return { jsonrpc: '2.0', id, error: { code, message, data } };
  }

  private sendJson(res: ServerResponse, status: number, data: unknown): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  private readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => resolve(body));
      req.on('error', reject);
    });
  }
}
