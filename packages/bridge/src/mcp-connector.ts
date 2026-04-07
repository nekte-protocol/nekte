/**
 * MCP Connector
 *
 * Connects to one or more MCP servers and pulls their tool definitions.
 * These are then transformed into NEKTE capabilities served by the bridge.
 *
 * Supports:
 * - Streamable HTTP MCP servers
 * - stdio MCP servers (via subprocess)
 * - Periodic schema refresh for change detection
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { computeVersionHash } from '@nekte/core';
import type { CapabilitySchema } from '@nekte/core';

// ---------------------------------------------------------------------------
// MCP types (subset needed for the bridge)
// ---------------------------------------------------------------------------

/** Generic JSON-RPC response from MCP server */
interface McpJsonRpcResponse {
  jsonrpc?: string;
  id?: number;
  result?: Record<string, unknown>;
  error?: { code: number; message: string; data?: unknown };
}

export interface McpToolSchema {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
  };
}

export interface McpServerConfig {
  /** Display name for this MCP server */
  name: string;
  /** MCP server URL (streamable HTTP) */
  url?: string;
  /** Command to start stdio MCP server */
  command?: string;
  /** Arguments for stdio command */
  args?: string[];
  /** Category to assign to all tools from this server */
  category?: string;
  /** Auth headers for HTTP MCP servers */
  headers?: Record<string, string>;
}

export interface McpConnection {
  config: McpServerConfig;
  tools: McpToolSchema[];
  lastRefresh: number;
}

// ---------------------------------------------------------------------------
// MCP Connector
// ---------------------------------------------------------------------------

export class McpConnector {
  private connections = new Map<string, McpConnection>();

  /**
   * Connect to an MCP server and fetch its tool list.
   */
  async connect(config: McpServerConfig): Promise<McpConnection> {
    const tools = await this.fetchTools(config);

    const connection: McpConnection = {
      config,
      tools,
      lastRefresh: Date.now(),
    };

    this.connections.set(config.name, connection);
    return connection;
  }

  /**
   * Refresh tools from all connected MCP servers.
   * Returns true if any schemas changed.
   */
  async refreshAll(): Promise<boolean> {
    let changed = false;

    for (const [name, conn] of this.connections) {
      try {
        const newTools = await this.fetchTools(conn.config);
        const oldSig = this.toolsSignature(conn.tools);
        const newSig = this.toolsSignature(newTools);

        if (oldSig !== newSig) {
          conn.tools = newTools;
          conn.lastRefresh = Date.now();
          changed = true;
        }
      } catch (err) {
        console.warn(`[nekte-bridge] Failed to refresh MCP server "${name}": ${err}`);
      }
    }

    return changed;
  }

  /**
   * Get all tools across all connected servers.
   */
  allTools(): Array<{ server: string; tool: McpToolSchema }> {
    const result: Array<{ server: string; tool: McpToolSchema }> = [];
    for (const [name, conn] of this.connections) {
      for (const tool of conn.tools) {
        result.push({ server: name, tool });
      }
    }
    return result;
  }

  /**
   * Invoke a tool on its MCP server.
   */
  async invokeTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const conn = this.connections.get(serverName);
    if (!conn) throw new Error(`MCP server not found: ${serverName}`);

    if (conn.config.url) {
      return this.invokeHttp(conn.config, toolName, args);
    }

    if (conn.config.command) {
      return this.invokeStdio(conn.config, toolName, args);
    }

    throw new Error(`MCP server "${serverName}" has no url or command configured`);
  }

  /**
   * Convert an MCP tool to a NEKTE CapabilitySchema.
   */
  toolToCapability(serverName: string, tool: McpToolSchema): CapabilitySchema {
    const category = this.connections.get(serverName)?.config.category ?? 'mcp';

    const inputSchema: Record<string, unknown> = tool.inputSchema ?? {
      type: 'object',
      properties: {},
    };

    // MCP tools don't define output schemas, so we use a generic one
    const outputSchema: Record<string, unknown> = {
      type: 'object',
      properties: {
        content: { type: 'array' },
      },
    };

    const hash = computeVersionHash(inputSchema, outputSchema);

    return {
      id: tool.name,
      cat: category,
      h: hash,
      desc: tool.description ?? `MCP tool: ${tool.name}`,
      input: inputSchema,
      output: outputSchema,
    };
  }

  // -----------------------------------------------------------------------
  // MCP HTTP transport
  // -----------------------------------------------------------------------

  private async fetchTools(config: McpServerConfig): Promise<McpToolSchema[]> {
    if (config.url) {
      return this.fetchToolsHttp(config);
    }

    if (config.command) {
      return this.fetchToolsStdio(config);
    }

    throw new Error(`MCP server "${config.name}" needs either url or command`);
  }

  private async fetchToolsHttp(config: McpServerConfig): Promise<McpToolSchema[]> {
    // Step 1: Initialize session
    const initRes = await fetch(config.url!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'nekte-bridge', version: '0.2.0' },
        },
      }),
    });

    if (!initRes.ok) {
      throw new Error(`MCP initialize failed: ${initRes.status}`);
    }

    // Extract session ID from response headers if present
    const sessionId = initRes.headers.get('mcp-session-id');
    const sessionHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    if (sessionId) {
      sessionHeaders['mcp-session-id'] = sessionId;
    }

    // Step 2: Send initialized notification
    await fetch(config.url!, {
      method: 'POST',
      headers: sessionHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }),
    });

    // Step 3: List tools
    const toolsRes = await fetch(config.url!, {
      method: 'POST',
      headers: sessionHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 2,
        params: {},
      }),
    });

    if (!toolsRes.ok) {
      throw new Error(`MCP tools/list failed: ${toolsRes.status}`);
    }

    const toolsData = (await toolsRes.json()) as McpJsonRpcResponse;
    const tools = toolsData.result?.tools as McpToolSchema[] | undefined;
    return tools ?? [];
  }

  private async invokeHttp(
    config: McpServerConfig,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const res = await fetch(config.url!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: Date.now(),
        params: { name: toolName, arguments: args },
      }),
    });

    if (!res.ok) {
      throw new Error(`MCP tools/call failed: ${res.status}`);
    }

    const data = (await res.json()) as McpJsonRpcResponse;
    if (data.error) {
      const msg = data.error.message ?? JSON.stringify(data.error).slice(0, 200);
      throw new Error(`MCP tool error: ${msg}`);
    }

    return data.result;
  }

  // -----------------------------------------------------------------------
  // MCP stdio transport
  // -----------------------------------------------------------------------

  private async fetchToolsStdio(config: McpServerConfig): Promise<McpToolSchema[]> {
    return this.stdioSession(config, async (send) => {
      // Initialize
      await send({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'nekte-bridge', version: '0.2.0' },
        },
      });

      // Notify initialized (no response expected)
      send({ jsonrpc: '2.0', method: 'notifications/initialized' }, true);

      // List tools
      const toolsResult = await send({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 2,
        params: {},
      });

      const response = toolsResult as McpJsonRpcResponse | undefined;
      return (response?.result?.tools as McpToolSchema[] | undefined) ?? [];
    });
  }

  private async invokeStdio(
    config: McpServerConfig,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    return this.stdioSession(config, async (send) => {
      // Initialize
      await send({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'nekte-bridge', version: '0.2.0' },
        },
      });

      send({ jsonrpc: '2.0', method: 'notifications/initialized' }, true);

      // Call tool
      const result = await send({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: 2,
        params: { name: toolName, arguments: args },
      });

      const response = result as McpJsonRpcResponse | undefined;
      return response?.result;
    });
  }

  /**
   * Run a stdio session: spawn process, execute callback with a send function, then kill.
   */
  private async stdioSession<T>(
    config: McpServerConfig,
    fn: (send: (msg: unknown, fireAndForget?: boolean) => Promise<unknown>) => Promise<T>,
  ): Promise<T> {
    const child = spawn(config.command!, config.args ?? [], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const pending = new Map<
      number,
      { resolve: (v: unknown) => void; reject: (e: Error) => void }
    >();
    let buffer = '';

    child.stdout!.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();
      // Parse newline-delimited JSON
      const lines = buffer.split('\n');
      buffer = lines.pop()!;
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id !== undefined && pending.has(msg.id)) {
            pending.get(msg.id)!.resolve(msg);
            pending.delete(msg.id);
          }
        } catch {
          /* skip malformed lines */
        }
      }
    });

    const send = (msg: unknown, fireAndForget = false): Promise<unknown> => {
      const json = JSON.stringify(msg) + '\n';
      child.stdin!.write(json);

      if (fireAndForget) return Promise.resolve(undefined);

      const id = (msg as Record<string, unknown>).id as number;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        setTimeout(() => {
          if (pending.has(id)) {
            pending.delete(id);
            reject(new Error(`stdio timeout for request ${id}`));
          }
        }, 10_000);
      });
    };

    try {
      return await fn(send);
    } finally {
      child.kill();
    }
  }

  private toolsSignature(tools: McpToolSchema[]): string {
    return JSON.stringify(
      tools
        .map((t) => ({ n: t.name, s: JSON.stringify(t.inputSchema) }))
        .sort((a, b) => a.n.localeCompare(b.n)),
    );
  }
}
