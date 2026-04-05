FROM node:20-slim AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY packages/core/package.json packages/core/
COPY packages/server/package.json packages/server/
COPY packages/bridge/package.json packages/bridge/

RUN pnpm install --frozen-lockfile

COPY packages/core/ packages/core/
COPY packages/server/ packages/server/
COPY packages/bridge/ packages/bridge/

RUN pnpm -r build

FROM node:20-slim
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/bridge/dist ./packages/bridge/dist
COPY --from=builder /app/packages/bridge/package.json ./packages/bridge/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

EXPOSE 3100

ENTRYPOINT ["node", "packages/bridge/dist/cli.js"]
CMD ["--config", "/app/bridge.json"]
