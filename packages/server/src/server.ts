/**
 * NekteServer — NEKTE protocol server
 *
 * Register capabilities, handle discovery/invocation/delegation,
 * and serve over HTTP or other transports.
 */

import type { z } from 'zod';
import {
  type AgentCard,
  type CapabilitySchema,
  type ContextEnvelope,
  type ContextParams,
  type DelegateParams,
  type DiscoverParams,
  type DiscoverResult,
  type InvokeParams,
  type InvokeResult,
  type NekteError,
  type NekteMethod,
  type NekteRequest,
  type NekteResponse,
  type TaskCancelParams,
  type TaskResumeParams,
  type TaskStatusParams,
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
import type { SseStream } from './sse-stream.js';
import { TaskRegistry, TaskNotFoundError, TaskNotCancellableError, TaskNotResumableError } from './task-registry.js';

/**
 * DelegateHandler — the application-layer contract for task delegation.
 *
 * Every handler receives an AbortSignal for cooperative cancellation.
 * The stream adapter (SSE or gRPC) is injected by the transport layer —
 * handlers are transport-agnostic.
 */
export type DelegateHandler = (
  task: import('@nekte/core').Task,
  stream: SseStream,
  context: ContextEnvelope | undefined,
  /** AbortSignal for cooperative cancellation — always provided */
  signal: AbortSignal,
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
  /** Task lifecycle registry — tracks active tasks, enables cancel/resume */
  readonly tasks: TaskRegistry;
  readonly log: Logger;
  private readonly auth: AuthHandler;
  /** @internal Used by HTTP/gRPC transport for streaming delegation */
  delegateHandler?: DelegateHandler;
  private readonly filterStrategy?: CapabilityFilterStrategy;
  private contexts = new Map<string, ContextEnvelope>();

  constructor(config: NekteServerConfig) {
    this.config = config;
    this.registry = new CapabilityRegistry();
    this.tasks = new TaskRegistry();
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
          return this.ok(id, await this.handleContext(params as ContextParams));
        case 'nekte.verify':
          return this.ok(id, await this.handleVerify(params as VerifyParams));
        case 'nekte.task.cancel':
          return this.ok(id, this.handleTaskCancel(params as TaskCancelParams));
        case 'nekte.task.resume':
          return this.ok(id, this.handleTaskResume(params as TaskResumeParams));
        case 'nekte.task.status':
          return this.ok(id, this.handleTaskStatus(params as TaskStatusParams));
        default:
          return this.error(id, -32601, `Method not found: ${method}`);
      }
    } catch (err) {
      if (err instanceof Error && 'nekteError' in err) {
        return { jsonrpc: '2.0', id, error: (err as Error & { nekteError: NekteError }).nekteError };
      }
      const message = err instanceof Error ? err.message : String(err);
      return this.error(id, -32000, message);
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
    const ctx: HandlerContext = { budget, signal: new AbortController().signal };

    const multiLevel = await this.registry.invoke(params.cap, params.in, ctx);
    const resolved = resolveBudget(multiLevel, budget);

    return {
      out: resolved.data as Record<string, unknown>,
      resolved_level: resolved.level,
      meta: {
        ms: (multiLevel.full as Record<string, unknown> | undefined)?._meta
          ? ((multiLevel.full as Record<string, unknown>)._meta as Record<string, unknown>).ms as number | undefined
          : undefined,
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
      signal: new AbortController().signal,
    });

    return {
      task_id: params.task.id,
      status: 'completed',
      out: result,
    };
  }

  // TODO(v0.3): Enforce TTL expiration on stored context envelopes
  private async handleContext(params: ContextParams): Promise<unknown> {
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

  // -------------------------------------------------------------------------
  // Task lifecycle handlers
  // -------------------------------------------------------------------------

  private handleTaskCancel(params: TaskCancelParams): unknown {
    try {
      const entry = this.tasks.getOrThrow(params.task_id);
      const previousStatus = entry.status;
      this.tasks.cancel(params.task_id, params.reason);
      this.log.info('Task cancelled', { taskId: params.task_id, reason: params.reason });
      return this.tasks.toLifecycleResult(entry, previousStatus);
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        throw Object.assign(new Error(err.message), {
          nekteError: { code: NEKTE_ERRORS.TASK_NOT_FOUND, message: err.message },
        });
      }
      if (err instanceof TaskNotCancellableError) {
        throw Object.assign(new Error(err.message), {
          nekteError: { code: NEKTE_ERRORS.TASK_NOT_CANCELLABLE, message: err.message },
        });
      }
      throw err;
    }
  }

  private handleTaskResume(params: TaskResumeParams): unknown {
    try {
      const entry = this.tasks.getOrThrow(params.task_id);
      const previousStatus = entry.status;
      this.tasks.resume(params.task_id);
      this.log.info('Task resumed', { taskId: params.task_id });
      return this.tasks.toLifecycleResult(entry, previousStatus);
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        throw Object.assign(new Error(err.message), {
          nekteError: { code: NEKTE_ERRORS.TASK_NOT_FOUND, message: err.message },
        });
      }
      if (err instanceof TaskNotResumableError) {
        throw Object.assign(new Error(err.message), {
          nekteError: { code: NEKTE_ERRORS.TASK_NOT_RESUMABLE, message: err.message },
        });
      }
      throw err;
    }
  }

  private handleTaskStatus(params: TaskStatusParams): unknown {
    try {
      return this.tasks.toStatusResult(params.task_id);
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        throw Object.assign(new Error(err.message), {
          nekteError: { code: NEKTE_ERRORS.TASK_NOT_FOUND, message: err.message },
        });
      }
      throw err;
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
  // HTTP transport (convenience — delegates to createHttpTransport)
  // -------------------------------------------------------------------------

  /**
   * Start an HTTP server for this NEKTE agent.
   * Convenience wrapper around createHttpTransport().
   */
  async listen(port: number, hostname = '0.0.0.0'): Promise<void> {
    const { createHttpTransport } = await import('./http-transport.js');
    await createHttpTransport(this, {
      port,
      hostname,
      logLevel: this.config.logLevel,
      authHandler: this.config.authHandler,
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
}
