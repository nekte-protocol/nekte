/**
 * Catalog Builder
 *
 * Takes MCP tool definitions from multiple servers and builds
 * a unified NEKTE discovery catalog with L0/L1/L2 projections.
 *
 * This is the core of the bridge's value: turning verbose MCP
 * schemas into progressive, token-efficient NEKTE capabilities.
 */

import type { CapabilitySchema, CapabilityRef, CapabilitySummary } from '@nekte/core';
import { projectCapability } from '@nekte/core';
import type { McpConnector } from './mcp-connector.js';

export interface CatalogEntry {
  /** Which MCP server this tool came from */
  serverName: string;
  /** Original MCP tool name */
  mcpToolName: string;
  /** NEKTE capability schema (full L2) */
  schema: CapabilitySchema;
}

export class CatalogBuilder {
  private entries = new Map<string, CatalogEntry>();

  /**
   * Build the catalog from all connected MCP servers.
   */
  buildFrom(connector: McpConnector): void {
    this.entries.clear();

    for (const { server, tool } of connector.allTools()) {
      const schema = connector.toolToCapability(server, tool);

      this.entries.set(schema.id, {
        serverName: server,
        mcpToolName: tool.name,
        schema,
      });
    }
  }

  /**
   * Get all entries.
   */
  all(): CatalogEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get an entry by capability ID.
   */
  get(capId: string): CatalogEntry | undefined {
    return this.entries.get(capId);
  }

  /**
   * Filter entries by category or query.
   */
  filter(opts?: { category?: string; query?: string; id?: string }): CatalogEntry[] {
    let entries = this.all();

    if (opts?.id) {
      const found = this.get(opts.id);
      return found ? [found] : [];
    }

    if (opts?.category) {
      entries = entries.filter((e) => e.schema.cat === opts.category);
    }

    if (opts?.query) {
      const q = opts.query.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.schema.id.toLowerCase().includes(q) ||
          e.schema.desc.toLowerCase().includes(q),
      );
    }

    return entries;
  }

  /**
   * Get categories present in the catalog.
   */
  categories(): string[] {
    const cats = new Set<string>();
    for (const entry of this.entries.values()) {
      cats.add(entry.schema.cat);
    }
    return Array.from(cats);
  }

  /**
   * Token cost estimation for different discovery levels.
   * Used for benchmarking against native MCP.
   */
  estimateTokenCost(): {
    l0_total: number;
    l1_total: number;
    l2_total: number;
    mcp_native_per_turn: number;
  } {
    const entries = this.all();
    let l0 = 0;
    let l1 = 0;
    let l2 = 0;
    let mcp = 0;

    for (const entry of entries) {
      const l0Json = JSON.stringify(projectCapability(entry.schema, 0));
      const l1Json = JSON.stringify(projectCapability(entry.schema, 1));
      const l2Json = JSON.stringify(entry.schema);

      // ~4 chars per token
      l0 += Math.ceil(l0Json.length / 4);
      l1 += Math.ceil(l1Json.length / 4);
      l2 += Math.ceil(l2Json.length / 4);

      // MCP native: full input schema injected every turn
      const mcpJson = JSON.stringify({
        name: entry.mcpToolName,
        description: entry.schema.desc,
        inputSchema: entry.schema.input,
      });
      mcp += Math.ceil(mcpJson.length / 4);
    }

    return {
      l0_total: l0,
      l1_total: l1,
      l2_total: l2,
      mcp_native_per_turn: mcp,
    };
  }
}
