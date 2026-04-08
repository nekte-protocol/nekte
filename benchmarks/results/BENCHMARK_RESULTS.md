# Market MCP Benchmark Results

> Generated: 2026-04-08T07:18:26.288Z
> Tokenizer: tiktoken/cl100k_base
> Runs per scenario: 5 (+ 1 warm-up)

## Methodology

- **Token counting**: tiktoken (cl100k_base) — same tokenizer used by Claude/GPT models
- **Statistical rigor**: 5 measured runs per scenario, 1 warm-up runs discarded
- **MCP schemas**: Real tool definitions from official @modelcontextprotocol packages
- **Response payloads**: Conformance responses matching real API shapes and sizes
- **Conversation model**: Cumulative context (system prompt + full message history + dynamic budget)
- **Optimization study**: 4 strategies for compressing historical context

## Part 1: Per-Turn Protocol Comparison (Naive Model)

Measures schema + response tokens per turn, without cumulative context history.

### DevOps Triage

**Goal:** Investigate a CI failure: check workflow runs, read source files, review PR, search for patterns
**Servers:** github, filesystem | **Tools:** 39 | **Turns:** 12
**Schema weight:** 4.1K tokens (18.7 KB)

| Protocol | Mean | Median | P95 | StdDev | Savings |
|----------|-----:|-------:|----:|-------:|--------:|
| MCP Native | 78.5K | 78.5K | 78.6K | 33.27 | 0% |
| MCP Progressive | 39.2K | 39.2K | 39.2K | 33.27 | 50% |
| mcp2cli | 30.5K | 30.5K | 30.5K | 33.27 | 61% |
| NEKTE | 11.7K | 11.7K | 11.8K | 24.04 | 85% |
| NEKTE+Cache | 11.7K | 11.7K | 11.7K | 24.04 | 85% |

### Research Assistant

**Goal:** Research MCP protocol alternatives, fetch documentation, compile findings
**Servers:** brave-search, fetch | **Tools:** 3 | **Turns:** 8
**Schema weight:** 514 tokens (2.3 KB)

| Protocol | Mean | Median | P95 | StdDev | Savings |
|----------|-----:|-------:|----:|-------:|--------:|
| MCP Native | 19.9K | 19.9K | 20.0K | 38.39 | 0% |
| MCP Progressive | 16.8K | 16.8K | 16.9K | 38.39 | 15% |
| mcp2cli | 16.3K | 16.3K | 16.4K | 38.39 | 18% |
| NEKTE | 4.4K | 4.4K | 4.5K | 17.83 | 78% |
| NEKTE+Cache | 4.4K | 4.4K | 4.4K | 17.83 | 78% |

### Data Analysis

**Goal:** Investigate database performance, analyze table structure, export findings to file
**Servers:** postgres, filesystem | **Tools:** 14 | **Turns:** 10
**Schema weight:** 1.4K tokens (6.7 KB)

| Protocol | Mean | Median | P95 | StdDev | Savings |
|----------|-----:|-------:|----:|-------:|--------:|
| MCP Native | 20.4K | 20.4K | 20.4K | 8.89 | 0% |
| MCP Progressive | 9.9K | 9.9K | 9.9K | 8.89 | 51% |
| mcp2cli | 7.2K | 7.2K | 7.2K | 8.89 | 65% |
| NEKTE | 2.7K | 2.7K | 2.7K | 2.86 | 87% |
| NEKTE+Cache | 2.7K | 2.7K | 2.7K | 2.86 | 87% |

### Multi-MCP Agent

**Goal:** Full sprint planning: research, code review, data analysis, documentation — using ALL available MCPs
**Servers:** github, filesystem, brave-search, fetch, postgres | **Tools:** 43 | **Turns:** 15
**Schema weight:** 4.7K tokens (21.2 KB)

| Protocol | Mean | Median | P95 | StdDev | Savings |
|----------|-----:|-------:|----:|-------:|--------:|
| MCP Native | 110.7K | 110.7K | 110.7K | 27.77 | 0% |
| MCP Progressive | 54.3K | 54.3K | 54.3K | 27.77 | 51% |
| mcp2cli | 42.3K | 42.3K | 42.3K | 27.77 | 62% |
| NEKTE | 10.8K | 10.8K | 10.8K | 9.5 | 90% |
| NEKTE+Cache | 10.7K | 10.7K | 10.7K | 9.5 | 90% |

## Part 2: Schema Weight Scaling Study

How context window cost grows as you connect more MCP servers (fixed 10-turn workflow):

| Servers | Tools | MCP Native | mcp2cli | NEKTE | NEKTE+Cache | NEKTE Savings |
|--------:|------:|-----------:|--------:|------:|------------:|--------------:|
| 1 | 1 | 6.6K | 6.3K | 1.4K | 1.4K | 79% |
| 2 | 3 | 11.0K | 7.9K | 2.4K | 2.4K | 78% |
| 3 | 4 | 17.6K | 12.6K | 3.6K | 3.6K | 79% |
| 4 | 17 | 29.0K | 11.0K | 4.5K | 4.5K | 84% |
| 5 | 43 | 68.0K | 22.6K | 7.4K | 7.3K | 89% |

## Part 3: Realistic Conversation Model

Models what LLMs **actually pay**: each API call includes the full conversation history.
Accounts for system prompt (1,500 tok), user messages (150 tok/turn), assistant messages (300 tok/turn),
and dynamic budget pressure (compresses under context pressure).

### Naive vs Realistic Savings

| Scenario | Tools | Turns | Naive Savings | Realistic Savings | Delta |
|----------|------:|------:|--------------:|------------------:|------:|
| DevOps Triage | 39 | 12 | 85% | 57% | -28pp |
| Research Assistant | 3 | 8 | 78% | 52% | -26pp |
| Data Analysis | 14 | 10 | 87% | 42% | -45pp |
| Multi-MCP Agent | 43 | 15 | 90% | 69% | -21pp |

### Total Billed Tokens per Conversation

| Scenario | MCP Native | MCP Prog. | mcp2cli | NEKTE | NEKTE Savings |
|----------|----------:|---------:|--------:|------:|--------------:|
| DevOps Triage | 336.9K | 297.2K | 288.8K | 146.0K | 57% |
| Research Assistant | 103.7K | 100.5K | 99.8K | 50.1K | 52% |
| Data Analysis | 92.2K | 81.8K | 79.0K | 53.6K | 42% |
| Multi-MCP Agent | 488.5K | 432.0K | 420.1K | 150.5K | 69% |

### Cost Decomposition (where do tokens go?)

For NEKTE protocol, showing what fraction of total billed tokens each component represents:

| Scenario | System Prompt | Schemas | History | User Msgs | Tool Results |
|----------|-------------:|--------:|--------:|----------:|-------------:|
| DevOps Triage | 12% | 1% | 78% | 1% | 7% |
| Research Assistant | 24% | 1% | 65% | 2% | 8% |
| Data Analysis | 28% | 1% | 64% | 3% | 4% |
| Multi-MCP Agent | 15% | 1% | 76% | 1% | 6% |

## Part 4: Optimization Strategies

Four strategies to compress historical context and improve NEKTE's real-conversation score:

| Strategy | Mechanism |
|----------|-----------|
| **History Decay** | T-1: full, T-2: compact, T-3: minimal, T-4+: reference (~15 tok) |
| **Sliding Window** | Last 4 turns full, older turns collapsed to 200-token summary |
| **Delta Encoding** | Repeated tool calls send ~40% (structural deduplication) |
| **Combined** | All three strategies applied together |

### DevOps Triage (12 turns, 39 tools)

| Protocol/Strategy | Total Tokens | Savings vs Native | Improvement vs Base |
|-------------------|------------:|-----------------:|-------------------:|
| MCP Native | 336.8K | — | — |
| NEKTE (base) | 145.8K | 57% | — |
| History Decay | 76.1K | 77% | +20pp |
| Sliding Window | 89.3K | 73% | +16pp |
| Delta Encoding | 145.9K | 57% | +0pp |
| Combined (all) | 76.0K | 77% | +20pp |

### Research Assistant (8 turns, 3 tools)

| Protocol/Strategy | Total Tokens | Savings vs Native | Improvement vs Base |
|-------------------|------------:|-----------------:|-------------------:|
| MCP Native | 103.6K | — | — |
| NEKTE (base) | 50.0K | 52% | — |
| History Decay | 36.0K | 65% | +13pp |
| Sliding Window | 44.0K | 57% | +5pp |
| Delta Encoding | 43.9K | 58% | +6pp |
| Combined (all) | 33.0K | 68% | +16pp |

### Data Analysis (10 turns, 14 tools)

| Protocol/Strategy | Total Tokens | Savings vs Native | Improvement vs Base |
|-------------------|------------:|-----------------:|-------------------:|
| MCP Native | 92.2K | — | — |
| NEKTE (base) | 53.6K | 42% | — |
| History Decay | 42.8K | 54% | +12pp |
| Sliding Window | 41.7K | 55% | +13pp |
| Delta Encoding | 46.4K | 50% | +8pp |
| Combined (all) | 40.6K | 56% | +14pp |

### Multi-MCP Agent (15 turns, 43 tools)

| Protocol/Strategy | Total Tokens | Savings vs Native | Improvement vs Base |
|-------------------|------------:|-----------------:|-------------------:|
| MCP Native | 489.0K | — | — |
| NEKTE (base) | 150.5K | 69% | — |
| History Decay | 96.8K | 80% | +11pp |
| Sliding Window | 95.3K | 81% | +12pp |
| Delta Encoding | 148.9K | 70% | +1pp |
| Combined (all) | 96.2K | 80% | +11pp |

### Best Strategy per Scenario

| Scenario | NEKTE Base | Best Score | Gain | Best Strategy |
|----------|----------:|-----------:|-----:|--------------:|
| DevOps Triage | 57% | 77% | +20pp | History Decay |
| Research Assistant | 52% | 68% | +16pp | Combined (all) |
| Data Analysis | 42% | 56% | +14pp | Combined (all) |
| Multi-MCP Agent | 69% | 81% | +12pp | Sliding Window |

## Overall Summary

| Model | Protocol | Savings Range |
|-------|----------|-------------:|
| Naive (per-turn) | NEKTE | 78-90% |
| Realistic (conversation) | NEKTE | 42-69% |
| Optimized (best strategy) | NEKTE + History Decay | 56-81% |
