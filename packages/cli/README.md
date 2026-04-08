# @nekte/cli

CLI tool for interacting with NEKTE agents — discover capabilities, invoke actions, and inspect health.

## Install

```bash
pnpm add -g @nekte/cli
```

## Commands

```bash
# Discover agent capabilities
nekte discover http://localhost:4001          # L0 catalog
nekte discover http://localhost:4001 -l 2     # L2 full schemas

# Invoke a capability
nekte invoke http://localhost:4001 sentiment -i '{"text":"Great!"}'

# Check bridge health + metrics
nekte health http://localhost:3100

# View Agent Card
nekte card http://localhost:4001

# Compare JSON vs MessagePack wire sizes
nekte bench http://localhost:4001
```

## License

MIT
