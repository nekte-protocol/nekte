# Contributing to NEKTE

Thank you for your interest in NEKTE! This guide will help you get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/nekte-protocol/nekte.git
cd nekte

# Install dependencies (requires pnpm 9+ and Node 20+)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run the demo
pnpm demo
```

## Project Structure

| Package | Description |
|---------|-------------|
| `@nekte/core` | Protocol types, Zod schemas, hashing, budget resolution, codec, MessagePack, task state machine |
| `@nekte/client` | Client library with lazy discovery, zero-schema cache, HTTP/gRPC transports, streaming + cancel |
| `@nekte/server` | Server library with capability registry, task registry (DDD), HTTP/WS/gRPC transports, auth |
| `@nekte/bridge` | MCP-to-NEKTE proxy with SIEVE cache, compression, and metrics |
| `@nekte/cli` | CLI tool: discover, invoke, health, card, bench |

Dependency order: `core` -> `client` / `server` -> `bridge` / `cli`

## Development Workflow

1. Create a branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Run `pnpm test` and `pnpm typecheck`
5. Run `pnpm lint` and `pnpm format` to lint and format code
6. Add a changeset (`pnpm changeset`) if your change affects a published package
7. Submit a pull request

## Adding a Test

Tests live alongside source code in `src/__tests__/` directories. We use [Vitest](https://vitest.dev/).

```bash
# Run tests for a specific package
cd packages/core && pnpm test

# Run tests in watch mode
cd packages/core && npx vitest
```

## Code Style

- TypeScript strict mode
- Prettier for formatting (`pnpm format`)
- ESLint for linting (`pnpm lint`)
- Prefer Zod schemas for runtime validation

## Areas for Contribution

- **Tests**: Expand test coverage, especially integration tests
- **Documentation**: Improve JSDoc, add usage examples
- **Bridge**: Stdio transport for MCP servers, better error handling
- **SDKs**: Python and Go implementations (v1.0 roadmap)
- **Spec**: RFC-style reviews and feedback on the protocol design

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
