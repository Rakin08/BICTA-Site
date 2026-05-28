# ─── Stage 1: Build ───────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

# Build only the API (skip Vite frontend)
RUN node_modules/.bin/esbuild api/boot.ts \
  --platform=node \
  --bundle \
  --format=esm \
  --outdir=dist \
  --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" \
  --external:mysql2 \
  --external:@aws-sdk/client-s3 \
  --external:@aws-sdk/s3-request-presigner

# ─── Stage 2: Production ──────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production runtime deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

RUN addgroup --system --gid 1001 apigroup
RUN adduser --system --uid 1001 apiuser
USER apiuser

EXPOSE 3001

CMD ["node", "dist/boot.js"]
