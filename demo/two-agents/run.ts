/**
 * NEKTE Demo — Two agents coordinating via NEKTE
 *
 * Agent A: Sentiment analyzer (NLP)
 * Agent B: Report generator (uses Agent A's results)
 *
 * Run: pnpm demo (or: npx tsx demo/two-agents/run.ts)
 *
 * This demonstrates:
 * 1. Progressive discovery (L0 → L1 → L2)
 * 2. Zero-schema invocation (second call skips schema)
 * 3. Token budget enforcement
 * 4. Multi-level result compression
 */

import { z } from 'zod';
import { NekteServer } from '@nekte/server';
import { NekteClient } from '@nekte/client';
import { estimateTokens } from '@nekte/core';

// ---------------------------------------------------------------------------
// Agent A: Sentiment Analyzer
// ---------------------------------------------------------------------------

function createSentimentAgent(): NekteServer {
  const server = new NekteServer({
    agent: 'sentiment-analyzer',
    version: '1.0.0',
  });

  server.capability('analyze-sentiment', {
    category: 'nlp',
    description: 'Analyzes sentiment of text. Input: text(string). Output: label, score, explanation.',
    inputSchema: z.object({
      text: z.string(),
      lang: z.string().default('auto'),
    }),
    outputSchema: z.object({
      label: z.enum(['positive', 'negative', 'neutral', 'mixed']),
      score: z.number(),
      explanation: z.string(),
    }),
    handler: async (input) => {
      // Simulated sentiment analysis
      const text = input.text.toLowerCase();
      const positiveWords = ['great', 'excellent', 'love', 'amazing', 'good', 'genial', 'encanta'];
      const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'slow', 'lento', 'pésimo'];

      const posCount = positiveWords.filter((w) => text.includes(w)).length;
      const negCount = negativeWords.filter((w) => text.includes(w)).length;

      const total = posCount + negCount || 1;
      const score = (posCount - negCount + total) / (2 * total);
      const label = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : posCount > 0 && negCount > 0 ? 'mixed' : 'neutral';

      return {
        label,
        score: Math.round(score * 100) / 100,
        explanation: `Found ${posCount} positive and ${negCount} negative indicators in text.`,
      };
    },
    toMinimal: (r) => `${r.label} ${r.score}`,
    toCompact: (r) => ({ label: r.label, score: r.score }),
    examples: [
      {
        in: { text: 'This product is excellent!', lang: 'en' },
        out: { label: 'positive' as const, score: 0.95, explanation: 'Strong positive sentiment.' },
      },
    ],
  });

  server.capability('extract-keywords', {
    category: 'nlp',
    description: 'Extracts key phrases from text. Input: text(string). Output: keywords(string[]).',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ keywords: z.array(z.string()) }),
    handler: async (input) => {
      // Simple keyword extraction simulation
      const words = input.text.split(/\s+/).filter((w: string) => w.length > 4);
      const unique = [...new Set(words)].slice(0, 5);
      return { keywords: unique };
    },
    toMinimal: (r) => r.keywords.join(', '),
    toCompact: (r) => ({ keywords: r.keywords, count: r.keywords.length }),
  });

  return server;
}

// ---------------------------------------------------------------------------
// Token tracking
// ---------------------------------------------------------------------------

let totalTokens = 0;

function trackTokens(label: string, data: unknown): void {
  const tokens = estimateTokens(data);
  totalTokens += tokens;
  console.log(`  📊 ${label}: ~${tokens} tokens (cumulative: ~${totalTokens})`);
}

// ---------------------------------------------------------------------------
// Run the demo
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         NEKTE Protocol Demo v0.2                ║');
  console.log('║   "El protocolo que no quema tu contexto"       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Start Agent A
  const agentA = createSentimentAgent();
  await agentA.listen(4001);

  // Agent B connects to Agent A via NEKTE
  const client = new NekteClient('http://localhost:4001');

  // --- Step 1: L0 Discovery (catalog only) ---
  console.log('\n── Step 1: L0 Discovery (catalog) ─────────────────');
  const catalog = await client.catalog();
  console.log(`  Agent: ${catalog.agent}`);
  console.log(`  Capabilities: ${catalog.caps.map((c) => c.id).join(', ')}`);
  trackTokens('L0 catalog response', catalog);

  // --- Step 2: L1 Discovery (summary for one capability) ---
  console.log('\n── Step 2: L1 Discovery (summary) ─────────────────');
  const summary = await client.describe('analyze-sentiment');
  console.log(`  Description: ${(summary.caps[0] as any).desc}`);
  trackTokens('L1 summary response', summary);

  // --- Step 3: First invocation (with hash from discovery) ---
  console.log('\n── Step 3: First invocation ────────────────────────');
  const result1 = await client.invoke('analyze-sentiment', {
    input: { text: 'The product is excellent but shipping was slow' },
    budget: { max_tokens: 50, detail_level: 'compact' },
  });
  console.log(`  Result: ${JSON.stringify(result1.out)}`);
  console.log(`  Level: ${result1.resolved_level}`);
  trackTokens('First invoke response', result1);

  // --- Step 4: Second invocation (zero-schema — cached hash) ---
  console.log('\n── Step 4: Zero-schema invocation (cached) ────────');
  const result2 = await client.invoke('analyze-sentiment', {
    input: { text: 'Terrible experience, never buying again' },
    budget: { max_tokens: 20, detail_level: 'minimal' },
  });
  console.log(`  Result: ${JSON.stringify(result2.out)}`);
  console.log(`  Level: ${result2.resolved_level}`);
  trackTokens('Zero-schema invoke response', result2);

  // --- Step 5: Minimal budget invocation ---
  console.log('\n── Step 5: Minimal budget invocation ───────────────');
  const result3 = await client.invoke('extract-keywords', {
    input: { text: 'The delivery was extremely delayed and customer support was unhelpful' },
    budget: { max_tokens: 10, detail_level: 'minimal' },
  });
  console.log(`  Result: ${JSON.stringify(result3.out)}`);
  trackTokens('Minimal invoke response', result3);

  // --- Summary ---
  console.log('\n══════════════════════════════════════════════════');
  console.log(`  Total NEKTE tokens used: ~${totalTokens}`);
  console.log(`  MCP equivalent (2 tools × 5 turns): ~${2 * 121 * 5} tokens`);
  console.log(`  Savings: ~${Math.round((1 - totalTokens / (2 * 121 * 5)) * 100)}%`);
  console.log('══════════════════════════════════════════════════\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Demo failed:', err);
  process.exit(1);
});
