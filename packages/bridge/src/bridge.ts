/**
 * NekteBridge — MCP-to-NEKTE Proxy
 *
 * The Trojan horse: drop this in front of your existing MCP servers
 * and get 90%+ token savings with zero backend changes.
 *
 * Architecture:
 *
 *   Agent ←── NEKTE ──→ NekteBridge ←── MCP ──→ MCP Server(s)
 *                            │
 *                       cache + hash
 *                       + compression
 *
 * The bridge:
 * 1. Connects to MCP servers on startup, fetches all tool schemas
 * 2. Builds a unified NEKTE catalog with version hashes
 * 3. Serves nekte.discover with progressive L0/L1/L2 responses
 * 4. Translates nekte.invoke to MCP tools/call
 * 5. Compresses MCP results into multi-level NEKTE format
 */

// HTTP transport extracted to http-transport.ts (hexagonal architecture)
import {
  type AgentCard,
  type DiscoverParams,
  type DiscoverResult,
  type InvokeParams,
  type InvokeResult,
  type NekteRequest,
  type NekteResponse,
  NEKTE_ERRORS,
  NEKTE_VERSION,
  WELL_KNOWN_PATH,
  createBudget,
  createLogger,
  type Logger,
  type LogLevel,
} from '@nekte/core';
import { projectCapability } from '@nekte/core';
import type { CapabilityFilterStrategy, FilterableCapability } from '@nekte/core';
import { McpConnector, type McpServerConfig } from './mcp-connector.js';
import { CatalogBuilder } from './catalog.js';
import { compressMcpResult, type McpToolResult } from './compressor.js';
import { MetricsCollector } from './metrics.js';

// ---------------------------------------------------------------------------
// Bridge config
// ---------------------------------------------------------------------------

export interface BridgeConfig {
  /** Bridge agent name */
  name?: string;
  /** MCP servers to proxy */
  mcpServers: McpServerConfig[];
  /** Refresh interval for MCP schemas (ms). Default: 5 min */
  refreshIntervalMs?: number;
  /** Port to listen on. Default: 3100 */
  port?: number;
  /** Log level. Default: 'info' */
  logLevel?: LogLevel;
  /** Capability filter strategy. Default: keyword matching */
  filterStrategy?: CapabilityFilterStrategy;
}

// ---------------------------------------------------------------------------
// NekteBridge
// ---------------------------------------------------------------------------

export class NekteBridge {
  readonly config: BridgeConfig;
  readonly connector: McpConnector;
  readonly catalog: CatalogBuilder;
  readonly log: Logger;
  readonly metrics: MetricsCollector;

  private refreshTimer?: ReturnType<typeof setInterval>;

  constructor(config: BridgeConfig) {
    this.config = config;
    this.connector = new McpConnector();
    this.catalog = new CatalogBuilder();
    this.log = createLogger('nekte-bridge', config.logLevel);
    this.metrics = new MetricsCollector();
  }

  /**
   * Initialize the bridge: connect to all MCP servers and build catalog.
   */
  async init(): Promise<void> {
    this.log.info(`Connecting to ${this.config.mcpServers.length} MCP server(s)...`);

    for (const serverConfig of this.config.mcpServers) {
      try {
        const conn = await this.connector.connect(serverConfig);
        this.log.info(`Connected: ${serverConfig.name}`, { tools: conn.tools.length });
      } catch (err) {
        this.log.error(`Failed: ${serverConfig.name}`, {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Build the unified catalog
    this.catalog.buildFrom(this.connector);

    const costs = this.catalog.estimateTokenCost();
    this.log.info(`Catalog built: ${this.catalog.all().length} capabilities`);
    this.log.info('Token costs', costs);

    // Start periodic refresh
    const interval = this.config.refreshIntervalMs ?? 5 * 60 * 1000;
    this.refreshTimer = setInterval(async () => {
      const changed = await this.connector.refreshAll();
      if (changed) {
        this.catalog.buildFrom(this.connector);
        this.log.info('Catalog refreshed (schemas changed)');
      }
    }, interval);
  }

  /**
   * Handle a NEKTE request.
   */
  async handleRequest(request: NekteRequest): Promise<NekteResponse> {
    const { method, id, params } = request;

    try {
      switch (method) {
        case 'nekte.discover':
          return this.ok(id, await this.handleDiscover(params as DiscoverParams));
        case 'nekte.invoke':
          return this.ok(id, await this.handleInvoke(params as InvokeParams));
        default:
          return this.error(id, -32601, `Bridge supports discover and invoke. Got: ${method}`);
      }
    } catch (err) {
      if (err instanceof Error && 'nekteError' in err) {
        return {
          jsonrpc: '2.0',
          id,
          error: (err as Error & { nekteError: { code: number; message: string; data?: unknown } })
            .nekteError,
        };
      }
      const message = err instanceof Error ? err.message : String(err);
      return this.error(id, -32000, message);
    }
  }

  // -----------------------------------------------------------------------
  // Method handlers
  // -----------------------------------------------------------------------

  private async handleDiscover(params: DiscoverParams): Promise<DiscoverResult> {
    let entries = this.catalog.filter(params.filter);

    // Apply semantic/hybrid filtering if strategy is configured and query is present
    if (this.config.filterStrategy && params.filter?.query) {
      const filterables: FilterableCapability[] = entries.map((e) => ({
        id: e.schema.id,
        category: e.schema.cat,
        description: e.schema.desc,
      }));

      const ranked = await this.config.filterStrategy.filter(filterables, params.filter.query, {
        top_k: params.filter.top_k,
        threshold: params.filter.threshold,
        category: params.filter.category,
      });

      const rankedIds = new Set(ranked.map((r) => r.id));
      const rankedOrder = new Map(ranked.map((r, i) => [r.id, i]));
      entries = entries
        .filter((e) => rankedIds.has(e.schema.id))
        .sort((a, b) => (rankedOrder.get(a.schema.id) ?? 0) - (rankedOrder.get(b.schema.id) ?? 0));
    }

    const result = {
      agent: this.config.name ?? 'nekte-bridge',
      caps: entries.map((e) => projectCapability(e.schema, params.level)),
    };

    // Track metrics: MCP would send full schemas every time
    const costs = this.catalog.estimateTokenCost();
    this.metrics.recordDiscover(result, costs.mcp_native_per_turn);

    return result;
  }

  private async handleInvoke(params: InvokeParams): Promise<InvokeResult> {
    const entry = this.catalog.get(params.cap);
    if (!entry) {
      throw Object.assign(new Error(`Capability not found: ${params.cap}`), {
        nekteError: {
          code: NEKTE_ERRORS.CAPABILITY_NOT_FOUND,
          message: 'CAPABILITY_NOT_FOUND',
        },
      });
    }

    // Check version hash
    if (params.h && params.h !== entry.schema.h) {
      throw Object.assign(new Error('VERSION_MISMATCH'), {
        nekteError: {
          code: NEKTE_ERRORS.VERSION_MISMATCH,
          message: 'VERSION_MISMATCH',
          data: {
            current_hash: entry.schema.h,
            schema: entry.schema,
          },
        },
      });
    }

    // Invoke on the MCP server
    const startMs = performance.now();
    const mcpResult = await this.connector.invokeTool(
      entry.serverName,
      entry.mcpToolName,
      params.in,
    );
    const ms = Math.round(performance.now() - startMs);

    // Compress result according to budget
    const budget = params.budget ?? createBudget();
    const compressed = compressMcpResult(mcpResult as McpToolResult, budget);

    // Track metrics
    this.metrics.recordInvoke(compressed.out, mcpResult);

    return {
      out: compressed.out,
      resolved_level: compressed.resolved_level,
      meta: { ms },
    };
  }

  // -----------------------------------------------------------------------
  // Public accessors (used by HTTP transport adapter)
  // -----------------------------------------------------------------------

  /** Generate the Agent Card for this bridge */
  agentCard(port: number): AgentCard {
    return {
      nekte: NEKTE_VERSION,
      agent: this.config.name ?? 'nekte-bridge',
      endpoint: `http://localhost:${port}`,
      caps: this.catalog.all().map((e) => e.schema.id),
      auth: 'none',
      budget_support: true,
    };
  }

  /** Health check data */
  health(): Record<string, unknown> {
    return {
      status: 'ok',
      capabilities: this.catalog.all().length,
      servers: this.config.mcpServers.length,
      costs: this.catalog.estimateTokenCost(),
      metrics: this.metrics.snapshot(),
    };
  }

  // -----------------------------------------------------------------------
  // HTTP transport (convenience — delegates to createBridgeHttpTransport)
  // -----------------------------------------------------------------------

  /**
   * Start the bridge HTTP server.
   * Convenience wrapper around createBridgeHttpTransport().
   */
  async listen(port?: number): Promise<void> {
    const { createBridgeHttpTransport } = await import('./http-transport.js');
    await createBridgeHttpTransport(this, {
      port: port ?? this.config.port ?? 3100,
      logLevel: this.config.logLevel,
    });
  }

  /**
   * Stop the bridge.
   */
  stop(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  private ok(id: string | number, result: unknown): NekteResponse {
    return { jsonrpc: '2.0', id, result };
  }

  private error(id: string | number, code: number, message: string): NekteResponse {
    return { jsonrpc: '2.0', id, error: { code, message } };
  }
}
