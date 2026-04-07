/**
 * Bridge Metrics — Token Savings Observability
 *
 * Tracks how many tokens the bridge saves vs raw MCP.
 * Exposes stats via the /health endpoint.
 */

import { estimateTokens } from '@nekte/core';

export interface TokenMetrics {
  /** Total requests handled */
  requests: number;
  /** Total tokens sent to agents (NEKTE side) */
  nekte_tokens: number;
  /** Estimated tokens if using raw MCP */
  mcp_equivalent_tokens: number;
  /** Tokens saved */
  tokens_saved: number;
  /** Savings percentage */
  savings_pct: number;
}

export class MetricsCollector {
  private _requests = 0;
  private _nekteTokens = 0;
  private _mcpEquivalentTokens = 0;

  /**
   * Record a discover request.
   * @param nekteResponse The NEKTE response sent to the agent
   * @param mcpSchemaTokens Estimated tokens if MCP sent full schemas
   */
  recordDiscover(nekteResponse: unknown, mcpSchemaTokens: number): void {
    this._requests++;
    this._nekteTokens += estimateTokens(nekteResponse);
    this._mcpEquivalentTokens += mcpSchemaTokens;
  }

  /**
   * Record an invoke request.
   * @param nekteResponse The compressed NEKTE response
   * @param mcpRawResult The raw MCP result before compression
   */
  recordInvoke(nekteResponse: unknown, mcpRawResult: unknown): void {
    this._requests++;
    this._nekteTokens += estimateTokens(nekteResponse);
    this._mcpEquivalentTokens += estimateTokens(mcpRawResult);
  }

  /** Get current metrics snapshot */
  snapshot(): TokenMetrics {
    const saved = this._mcpEquivalentTokens - this._nekteTokens;
    return {
      requests: this._requests,
      nekte_tokens: this._nekteTokens,
      mcp_equivalent_tokens: this._mcpEquivalentTokens,
      tokens_saved: Math.max(0, saved),
      savings_pct:
        this._mcpEquivalentTokens > 0 ? Math.round((saved / this._mcpEquivalentTokens) * 100) : 0,
    };
  }

  /** Reset metrics */
  reset(): void {
    this._requests = 0;
    this._nekteTokens = 0;
    this._mcpEquivalentTokens = 0;
  }
}
