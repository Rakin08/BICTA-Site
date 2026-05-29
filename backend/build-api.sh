#!/bin/bash
# Build ONLY the Hono API (skip Vite frontend build)
set -e
echo "Building BICTA API..."
npx esbuild api/boot.ts \
  --platform=node \
  --bundle \
  --format=esm \
  --outdir=dist \
  --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" \
  --external:@aws-sdk/client-s3 \
  --external:@aws-sdk/s3-request-presigner \
  --external:nodemailer
echo "✅ Build complete → dist/boot.js"
