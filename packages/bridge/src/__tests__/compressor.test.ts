import { describe, it, expect } from 'vitest';
import { compressMcpResult } from '../compressor.js';
import type { McpToolResult } from '../compressor.js';

describe('compressMcpResult', () => {
  it('compresses text result to minimal', () => {
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: 'Hello world from MCP server' }],
    };
    const { out, resolved_level } = compressMcpResult(mcpResult, {
      max_tokens: 10,
      detail_level: 'minimal',
    });
    expect(resolved_level).toBe('minimal');
    expect(out.text).toBeDefined();
  });

  it('compresses JSON result to compact', () => {
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: JSON.stringify({ score: 0.9, label: 'positive', details: { a: 1 } }) }],
    };
    const { out, resolved_level } = compressMcpResult(mcpResult, {
      max_tokens: 200,
      detail_level: 'compact',
    });
    expect(resolved_level).toBe('compact');
    expect(out).toHaveProperty('score');
  });

  it('returns full result when budget allows', () => {
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: JSON.stringify({ value: 42 }) }],
    };
    const { out, resolved_level } = compressMcpResult(mcpResult, {
      max_tokens: 4096,
      detail_level: 'full',
    });
    expect(resolved_level).toBe('full');
    expect(out).toHaveProperty('data');
  });

  it('handles empty content', () => {
    const mcpResult: McpToolResult = { content: [] };
    const { out } = compressMcpResult(mcpResult, { max_tokens: 100, detail_level: 'minimal' });
    expect(out.text).toBe('(empty)');
  });

  it('handles error results', () => {
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: 'Something went wrong' }],
      isError: true,
    };
    const { out } = compressMcpResult(mcpResult, {
      max_tokens: 4096,
      detail_level: 'full',
    });
    expect(out.is_error).toBe(true);
  });

  it('truncates long minimal text to ~80 chars', () => {
    const longText = 'A'.repeat(200);
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: longText }],
    };
    const { out } = compressMcpResult(mcpResult, { max_tokens: 10, detail_level: 'minimal' });
    expect((out.text as string).length).toBeLessThanOrEqual(80);
  });

  it('truncates long compact text to ~800 chars', () => {
    const longText = 'B'.repeat(2000);
    const mcpResult: McpToolResult = {
      content: [{ type: 'text', text: longText }],
    };
    const { out } = compressMcpResult(mcpResult, { max_tokens: 200, detail_level: 'compact' });
    expect((out.text as string).length).toBeLessThanOrEqual(800);
  });
});
