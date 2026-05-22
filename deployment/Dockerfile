# ============================================================
#  QUANTUM EMMA — Enterprise Docker Build
#  Multi-stage: Builder + Production + Nginx
#  © 2026 Grigori Saks
# ============================================================

# ── Stage 1: Dependencies ────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ── Stage 2: Builder ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 3: Production ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 quantumemma
RUN adduser  --system --uid 1001 quantumemma

COPY --from=builder /app/public    ./public
COPY --from=builder /app/.next     ./.next
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER quantumemma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node_modules/.bin/next", "start"]
