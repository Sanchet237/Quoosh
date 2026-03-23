# Quoosh — multi-stage build (web + socket targets)
FROM node:20-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ── Dependencies ─────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/web/package.json packages/web/
COPY packages/socket/package.json packages/socket/
COPY packages/common/package.json packages/common/
RUN pnpm install --frozen-lockfile

# ── Build all packages ─────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV RESEND_API_KEY=build_placeholder
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN pnpm install --frozen-lockfile
RUN cd packages/web && pnpm exec prisma generate
RUN pnpm build

# ── Next.js (standalone) ────────────────────────────────────
FROM node:20-alpine AS web
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder /app/packages/web/public ./packages/web/public
EXPOSE 3000
CMD ["node", "packages/web/server.js"]

# ── Socket.IO (esbuild bundle) ─────────────────────────────
FROM node:20-alpine AS socket
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/socket/dist/index.cjs ./dist/index.cjs
COPY --from=builder /app/config ./config
EXPOSE 3001
CMD ["node", "dist/index.cjs"]