/**
 * @nekte/bridge — MCP-to-NEKTE Proxy
 *
 * Translates MCP server tools into NEKTE capabilities with
 * progressive discovery, version hash caching, and multi-level
 * result compression. Achieves 90%+ token savings over raw MCP.
 *
 * @example
 * ```ts
 * const bridge = new NekteBridge({
 *   name: 'my-bridge',
 *   mcpServers: [{ name: 'github', url: 'http://localhost:3000/mcp' }],
 * });
 * await bridge.init();
 * await bridge.listen(3100);
 * ```
 */
export { NekteBridge, type BridgeConfig } from './bridge.js';
export { McpConnector, type McpServerConfig, type McpToolSchema } from './mcp-connector.js';
export { CatalogBuilder, type CatalogEntry } from './catalog.js';
export { compressMcpResult, type McpToolResult } from './compressor.js';
export { MetricsCollector, type TokenMetrics } from './metrics.js';
