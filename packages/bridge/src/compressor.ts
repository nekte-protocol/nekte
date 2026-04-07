/**
 * Result Compressor
 *
 * Takes verbose MCP tool results and compresses them into
 * NEKTE multi-level format (minimal/compact/full).
 *
 * This is where the bridge saves tokens on the response side.
 * MCP servers return unstructured text blobs — the compressor
 * extracts structure and provides budget-appropriate representations.
 */

import type { DetailLevel, MultiLevelResult, TokenBudget } from '@nekte/core';
import { resolveBudget, estimateTokens } from '@nekte/core';

/**
 * MCP tool result format.
 */
export interface McpToolResult {
  content?: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

/**
 * Compress an MCP tool result into NEKTE multi-level format.
 */
export function compressMcpResult(
  mcpResult: McpToolResult,
  budget?: TokenBudget,
): { out: Record<string, unknown>; resolved_level: DetailLevel } {
  // Extract text content from MCP result
  const texts = (mcpResult.content ?? [])
    .filter((c) => c.type === 'text' && c.text)
    .map((c) => c.text!);

  const fullText = texts.join('\n');

  // Build multi-level result
  const multiLevel: MultiLevelResult<string, Record<string, unknown>, Record<string, unknown>> = {
    minimal: buildMinimal(fullText),
    compact: buildCompact(fullText, mcpResult),
    full: buildFull(fullText, mcpResult),
  };

  const resolved = resolveBudget(multiLevel, budget);

  return {
    out:
      typeof resolved.data === 'string'
        ? { text: resolved.data }
        : (resolved.data as Record<string, unknown>),
    resolved_level: resolved.level,
  };
}

/**
 * Build minimal representation: first line or first N chars.
 * Target: <20 tokens.
 */
function buildMinimal(text: string): string {
  if (!text) return '(empty)';

  // Try to return the first meaningful line
  const firstLine = text.split('\n').find((l) => l.trim().length > 0) ?? text;

  // Cap at ~80 chars (~20 tokens)
  if (firstLine.length <= 80) return firstLine.trim();
  return firstLine.slice(0, 77).trim() + '...';
}

/**
 * Build compact representation: structured summary.
 * Target: <200 tokens.
 */
function buildCompact(text: string, mcpResult: McpToolResult): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      // If JSON, return a flattened version with limited depth
      return flattenForCompact(parsed);
    }
  } catch {
    // Not JSON — treat as text
  }

  result.text = text.length > 800 ? text.slice(0, 797) + '...' : text;
  result.length = text.length;
  result.has_images = mcpResult.content?.some((c) => c.type === 'image') ?? false;

  if (mcpResult.isError) {
    result.is_error = true;
  }

  return result;
}

/**
 * Build full representation: everything the MCP server returned.
 */
function buildFull(text: string, mcpResult: McpToolResult): Record<string, unknown> {
  // Try JSON parse
  try {
    const parsed = JSON.parse(text);
    return {
      data: parsed,
      content_types: mcpResult.content?.map((c) => c.type) ?? [],
      is_error: mcpResult.isError ?? false,
    };
  } catch {
    return {
      text,
      content_types: mcpResult.content?.map((c) => c.type) ?? [],
      is_error: mcpResult.isError ?? false,
    };
  }
}

/**
 * Flatten a nested object for compact representation.
 * Limits depth to 2 and array length to 3.
 */
function flattenForCompact(obj: Record<string, unknown>, depth = 0): Record<string, unknown> {
  if (depth >= 2) {
    return { _truncated: true };
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      result[key] = value.slice(0, 3).map((item) => {
        if (typeof item === 'object' && item !== null) {
          return flattenForCompact(item as Record<string, unknown>, depth + 1);
        }
        return item;
      });
      if (value.length > 3) {
        result[`${key}_count`] = value.length;
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = flattenForCompact(value as Record<string, unknown>, depth + 1);
    } else if (typeof value === 'string' && value.length > 200) {
      result[key] = value.slice(0, 197) + '...';
    } else {
      result[key] = value;
    }
  }

  return result;
}
