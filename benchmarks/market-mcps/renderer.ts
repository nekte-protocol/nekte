/**
 * Benchmark Report Renderer
 *
 * Outputs:
 *  - Terminal: colored tables with ANSI
 *  - JSON: timestamped file for CI/CD tracking
 *  - Markdown: publishable report with ASCII scaling chart
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { cv } from './stats.js';
import type { BenchmarkReport, ProtocolId, ScenarioResult, ScalingDataPoint, Stats } from './types.js';

// ---------------------------------------------------------------------------
// ANSI helpers
// ---------------------------------------------------------------------------

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
};

function pad(s: string, n: number, align: 'left' | 'right' = 'right'): string {
  const stripped = s.replace(/\x1b\[[0-9;]*m/g, '');
  const diff = n - stripped.length;
  if (diff <= 0) return s;
  return align === 'right' ? ' '.repeat(diff) + s : s + ' '.repeat(diff);
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function savingsColor(pct: number): string {
  if (pct >= 80) return c.green + c.bold;
  if (pct >= 50) return c.green;
  if (pct >= 20) return c.yellow;
  return c.dim;
}

const PROTOCOL_LABELS: Record<ProtocolId, string> = {
  mcp_native: 'MCP Native',
  mcp_progressive: 'MCP Progressive',
  mcp2cli: 'mcp2cli',
  nekte: 'NEKTE',
  nekte_cached: 'NEKTE+Cache',
};

const PROTOCOL_ORDER: ProtocolId[] = ['mcp_native', 'mcp_progressive', 'mcp2cli', 'nekte', 'nekte_cached'];

// ---------------------------------------------------------------------------
// Terminal renderer
// ---------------------------------------------------------------------------

export function renderTerminal(report: BenchmarkReport, verbose: boolean): void {
  const out = console.log;

  out(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════════════════════╗${c.reset}`);
  out(`${c.bold}${c.cyan}║  Market MCP Benchmark — Real Schemas, Real Tokens (tiktoken) ║${c.reset}`);
  out(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════════════════╝${c.reset}\n`);

  out(`${c.dim}Timestamp:  ${report.timestamp}${c.reset}`);
  out(`${c.dim}Tokenizer:  ${report.config.tokenizer}${c.reset}`);
  out(`${c.dim}Runs/scenario: ${report.config.runs_per_scenario} (+ ${report.config.warmup_runs} warm-up)${c.reset}`);
  out(`${c.dim}Scenarios:  ${report.summary.total_scenarios} | Turns: ${report.summary.total_turns} | Total runs: ${report.summary.total_runs}${c.reset}\n`);

  // --- Per-scenario results ---
  for (const sc of report.scenarios) {
    renderScenario(sc, verbose);
  }

  // --- Overall Summary ---
  out(`\n${c.bold}${c.bgBlue}${c.white} OVERALL SUMMARY ${c.reset}\n`);
  renderSummaryTable(report);

  // --- Scaling Study ---
  if (report.scaling.length > 0) {
    out(`\n${c.bold}${c.bgGreen}${c.white} SCHEMA WEIGHT SCALING STUDY ${c.reset}\n`);
    renderScalingTable(report.scaling);
    renderScalingChart(report.scaling);
  }

  // --- Cost Projection ---
  renderCostProjection(report);
}

function renderScenario(sc: ScenarioResult, verbose: boolean): void {
  const out = console.log;

  out(`${c.bold}━━━ ${sc.scenario} ━━━${c.reset}`);
  out(`${c.dim}Goal: ${sc.goal}${c.reset}`);
  out(`${c.dim}Servers: ${sc.servers.join(', ')} | Tools: ${sc.schema_weight.tool_count} | Turns: ${sc.turn_count}${c.reset}`);
  out(`${c.dim}Schema weight: ${formatTokens(sc.schema_weight.tools_list_tokens)} tokens (${(sc.schema_weight.tools_list_bytes / 1024).toFixed(1)} KB JSON)${c.reset}\n`);

  // Protocol comparison table
  const header = `  ${pad('Protocol', 18, 'left')} ${pad('Mean', 8)} ${pad('Median', 8)} ${pad('P5', 8)} ${pad('P95', 8)} ${pad('StdDev', 8)} ${pad('CV%', 6)} ${pad('Savings', 8)}`;
  out(`${c.bold}${header}${c.reset}`);
  out(`  ${'─'.repeat(82)}`);

  for (const id of PROTOCOL_ORDER) {
    const stats = sc.protocol_stats[id];
    const savings = sc.savings_vs_native[id];
    const sColor = savingsColor(savings);
    out(`  ${pad(PROTOCOL_LABELS[id], 18, 'left')} ${pad(formatTokens(stats.mean), 8)} ${pad(formatTokens(stats.median), 8)} ${pad(formatTokens(stats.p5), 8)} ${pad(formatTokens(stats.p95), 8)} ${pad(formatTokens(stats.stddev), 8)} ${pad(cv(stats).toFixed(1), 6)} ${sColor}${pad(savings + '%', 8)}${c.reset}`);
  }
  out('');

  // Verbose: per-turn breakdown
  if (verbose) {
    out(`  ${c.dim}Per-turn breakdown (representative run):${c.reset}`);
    const th = `    ${pad('#', 3, 'left')} ${pad('Tool', 30, 'left')} ${pad('Server', 12, 'left')} ${pad('Raw', 7)} ${pad('Native', 7)} ${pad('NEKTE', 7)} ${pad('Comp%', 6)}`;
    out(`  ${c.bold}${th}${c.reset}`);
    for (const t of sc.representative_turns) {
      const compPct = Math.round(t.compression_ratio * 100);
      out(`    ${pad(String(t.turn), 3, 'left')} ${pad(t.tool, 30, 'left')} ${pad(t.server, 12, 'left')} ${pad(formatTokens(t.raw_response_tokens), 7)} ${pad(formatTokens(t.costs.mcp_native.total_tokens), 7)} ${pad(formatTokens(t.costs.nekte.total_tokens), 7)} ${pad(compPct + '%', 6)}`);
    }
    out('');
  }
}

function renderSummaryTable(report: BenchmarkReport): void {
  const out = console.log;
  out(`  ${pad('Protocol', 18, 'left')} ${pad('Savings vs Native', 18)}`);
  out(`  ${'─'.repeat(38)}`);
  for (const id of PROTOCOL_ORDER) {
    const savings = report.summary.overall_savings[id];
    const sColor = savingsColor(savings);
    out(`  ${pad(PROTOCOL_LABELS[id], 18, 'left')} ${sColor}${pad(savings + '%', 18)}${c.reset}`);
  }
}

function renderScalingTable(scaling: ScalingDataPoint[]): void {
  const out = console.log;

  out(`  ${pad('Servers', 8)} ${pad('Tools', 6)} ${pad('MCP Native', 11)} ${pad('mcp2cli', 11)} ${pad('NEKTE', 11)} ${pad('NEKTE+C', 11)} ${pad('NEKTE sav.', 11)}`);
  out(`  ${'─'.repeat(70)}`);

  for (const dp of scaling) {
    const nativeTok = dp.protocol_totals.mcp_native;
    const nekteSav = nativeTok > 0 ? Math.round(((nativeTok - dp.protocol_totals.nekte) / nativeTok) * 100) : 0;
    const sColor = savingsColor(nekteSav);
    out(
      `  ${pad(String(dp.server_count), 8)} ${pad(String(dp.tool_count), 6)} ` +
      `${pad(formatTokens(dp.protocol_totals.mcp_native), 11)} ` +
      `${pad(formatTokens(dp.protocol_totals.mcp2cli), 11)} ` +
      `${pad(formatTokens(dp.protocol_totals.nekte), 11)} ` +
      `${pad(formatTokens(dp.protocol_totals.nekte_cached), 11)} ` +
      `${sColor}${pad(nekteSav + '%', 11)}${c.reset}`,
    );
  }
}

function renderScalingChart(scaling: ScalingDataPoint[]): void {
  const out = console.log;
  out(`\n  ${c.bold}Schema Tokens per 10-Turn Workflow (Scaling Curve)${c.reset}\n`);

  const maxTokens = Math.max(...scaling.map((dp) => dp.protocol_totals.mcp_native));
  const chartWidth = 50;

  for (const dp of scaling) {
    const label = `${dp.tool_count} tools`;
    out(`  ${pad(label, 10, 'left')}`);

    for (const id of ['mcp_native', 'nekte', 'nekte_cached'] as ProtocolId[]) {
      const tok = dp.protocol_totals[id];
      const barLen = Math.max(1, Math.round((tok / maxTokens) * chartWidth));
      const bar = id === 'mcp_native' ? '█' : id === 'nekte' ? '▓' : '░';
      const color = id === 'mcp_native' ? c.red : id === 'nekte' ? c.green : c.cyan;
      const label2 = PROTOCOL_LABELS[id];
      out(`  ${color}  ${bar.repeat(barLen)} ${formatTokens(tok)} ${c.dim}${label2}${c.reset}`);
    }
    out('');
  }

  out(`  ${c.red}█${c.reset} MCP Native  ${c.green}▓${c.reset} NEKTE  ${c.cyan}░${c.reset} NEKTE+Cache\n`);
}

function renderCostProjection(report: BenchmarkReport): void {
  const out = console.log;

  out(`\n${c.bold}  💰 Cost Projection (1,000 conversations/day @ $3/MTok input)${c.reset}\n`);

  // Use Multi-MCP scenario if available, otherwise first
  const sc = report.scenarios.find((s) => s.servers.length >= 4) ?? report.scenarios[0];
  if (!sc) return;

  const convPerDay = 1000;
  const dollarsPerMTok = 3;
  const daysPerMonth = 30;

  out(`  ${c.dim}Based on: "${sc.scenario}" (${sc.turn_count} turns, ${sc.schema_weight.tool_count} tools)${c.reset}\n`);

  out(`  ${pad('Protocol', 18, 'left')} ${pad('Tokens/conv', 12)} ${pad('$/month', 10)} ${pad('Savings/mo', 12)}`);
  out(`  ${'─'.repeat(54)}`);

  const nativeTokPerConv = sc.protocol_stats.mcp_native.mean;
  const nativeCostMonth = (nativeTokPerConv * convPerDay * daysPerMonth / 1_000_000) * dollarsPerMTok;

  for (const id of PROTOCOL_ORDER) {
    const tokPerConv = sc.protocol_stats[id].mean;
    const costMonth = (tokPerConv * convPerDay * daysPerMonth / 1_000_000) * dollarsPerMTok;
    const saved = nativeCostMonth - costMonth;
    const sColor = savingsColor(sc.savings_vs_native[id]);

    out(
      `  ${pad(PROTOCOL_LABELS[id], 18, 'left')} ` +
      `${pad(formatTokens(tokPerConv), 12)} ` +
      `${pad('$' + costMonth.toFixed(0), 10)} ` +
      `${sColor}${pad(saved > 0 ? '-$' + saved.toFixed(0) : '-', 12)}${c.reset}`,
    );
  }
  out('');
}

// ---------------------------------------------------------------------------
// JSON renderer
// ---------------------------------------------------------------------------

export function renderJson(report: BenchmarkReport): string {
  return JSON.stringify(report, null, 2);
}

// ---------------------------------------------------------------------------
// Markdown renderer
// ---------------------------------------------------------------------------

export function renderMarkdown(report: BenchmarkReport): string {
  const lines: string[] = [];
  const ln = (s = '') => lines.push(s);

  ln('# Market MCP Benchmark Results');
  ln();
  ln(`> Generated: ${report.timestamp}`);
  ln(`> Tokenizer: ${report.config.tokenizer}`);
  ln(`> Runs per scenario: ${report.config.runs_per_scenario} (+ ${report.config.warmup_runs} warm-up)`);
  ln();

  ln('## Methodology');
  ln();
  ln('- **Token counting**: tiktoken (cl100k_base) — same tokenizer used by Claude/GPT models');
  ln(`- **Statistical rigor**: ${report.config.runs_per_scenario} measured runs per scenario, ${report.config.warmup_runs} warm-up runs discarded`);
  ln('- **MCP schemas**: Real tool definitions from official @modelcontextprotocol packages');
  ln('- **Response payloads**: Conformance responses matching real API shapes and sizes');
  ln();

  // Per-scenario tables
  for (const sc of report.scenarios) {
    ln(`## ${sc.scenario}`);
    ln();
    ln(`**Goal:** ${sc.goal}`);
    ln(`**Servers:** ${sc.servers.join(', ')} | **Tools:** ${sc.schema_weight.tool_count} | **Turns:** ${sc.turn_count}`);
    ln(`**Schema weight:** ${formatTokens(sc.schema_weight.tools_list_tokens)} tokens (${(sc.schema_weight.tools_list_bytes / 1024).toFixed(1)} KB)`);
    ln();
    ln('| Protocol | Mean | Median | P95 | StdDev | Savings |');
    ln('|----------|-----:|-------:|----:|-------:|--------:|');
    for (const id of PROTOCOL_ORDER) {
      const s = sc.protocol_stats[id];
      ln(`| ${PROTOCOL_LABELS[id]} | ${formatTokens(s.mean)} | ${formatTokens(s.median)} | ${formatTokens(s.p95)} | ${formatTokens(s.stddev)} | ${sc.savings_vs_native[id]}% |`);
    }
    ln();
  }

  // Scaling study
  if (report.scaling.length > 0) {
    ln('## Schema Weight Scaling Study');
    ln();
    ln('How context window cost grows as you connect more MCP servers:');
    ln();
    ln('| Servers | Tools | MCP Native | mcp2cli | NEKTE | NEKTE+Cache | NEKTE Savings |');
    ln('|--------:|------:|-----------:|--------:|------:|------------:|--------------:|');
    for (const dp of report.scaling) {
      const nSav = dp.protocol_totals.mcp_native > 0
        ? Math.round(((dp.protocol_totals.mcp_native - dp.protocol_totals.nekte) / dp.protocol_totals.mcp_native) * 100)
        : 0;
      ln(`| ${dp.server_count} | ${dp.tool_count} | ${formatTokens(dp.protocol_totals.mcp_native)} | ${formatTokens(dp.protocol_totals.mcp2cli)} | ${formatTokens(dp.protocol_totals.nekte)} | ${formatTokens(dp.protocol_totals.nekte_cached)} | ${nSav}% |`);
    }
    ln();
  }

  // Summary
  ln('## Overall Savings');
  ln();
  ln('| Protocol | Savings vs MCP Native |');
  ln('|----------|-----------------------:|');
  for (const id of PROTOCOL_ORDER) {
    ln(`| ${PROTOCOL_LABELS[id]} | ${report.summary.overall_savings[id]}% |`);
  }
  ln();

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// File writers
// ---------------------------------------------------------------------------

export function writeJsonReport(report: BenchmarkReport, dir = './benchmark-results'): string {
  mkdirSync(dir, { recursive: true });
  const path = `${dir}/market-mcp-${Date.now()}.json`;
  writeFileSync(path, renderJson(report));
  return path;
}

export function writeMarkdownReport(report: BenchmarkReport, path = './BENCHMARK_RESULTS.md'): void {
  writeFileSync(path, renderMarkdown(report));
}
