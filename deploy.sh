#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  BICTA — One-Command Deploy Script
#  Usage: bash deploy.sh
# ═══════════════════════════════════════════════════════════════════
set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}"
echo "╔════════════════════════════════════════════════════╗"
echo "║         BICTA Elite — Deployment Script            ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 0: Check prerequisites ─────────────────────────────────────
echo -e "${BLUE}[1/5] Checking prerequisites...${NC}"

check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}✗ '$1' not found. Please install it first.${NC}"
    exit 1
  else
    echo -e "${GREEN}  ✓ $1 found${NC}"
  fi
}

check_cmd node
check_cmd npm
check_cmd git

echo ""

# ── Step 1: Environment setup ────────────────────────────────────────
echo -e "${BLUE}[2/5] Setting up environment...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}  ⚠  Created .env from template."
  echo -e "  ⚠  IMPORTANT: Open .env and fill in your values, then run this script again.${NC}"
  exit 0
else
  echo -e "${GREEN}  ✓ .env found${NC}"
fi

# ── Step 2: Build Backend ────────────────────────────────────────────
echo ""
echo -e "${BLUE}[3/5] Building backend API...${NC}"
cd backend
echo "  Installing backend dependencies..."
npm install --legacy-peer-deps --silent
echo "  Compiling Hono API..."
bash build-api.sh
cd ..
echo -e "${GREEN}  ✓ Backend built → backend/dist/boot.js${NC}"

# ── Step 3: Push DB schema ───────────────────────────────────────────
echo ""
echo -e "${BLUE}[4/5] Pushing database schema to Railway MySQL...${NC}"
source .env
export DATABASE_URL
cd backend
npx drizzle-kit push --config=drizzle.config.ts
cd ..
echo -e "${GREEN}  ✓ Database schema up to date${NC}"

# ── Step 4: Deploy options ───────────────────────────────────────────
echo ""
echo -e "${BLUE}[5/5] Choose deployment target:${NC}"
echo ""
echo "  1) Deploy frontend to Vercel (RECOMMENDED — free, fastest)"
echo "  2) Run everything locally with Docker"
echo "  3) Skip (I'll deploy manually)"
echo ""
read -p "Enter choice (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo -e "${YELLOW}─── Vercel Deployment ─────────────────────────────────${NC}"
    if ! command -v vercel &>/dev/null; then
      echo "  Installing Vercel CLI..."
      npm install -g vercel --silent
    fi
    cd frontend
    echo "  Deploying to Vercel..."
    vercel --prod \
      -e NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
      -e NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
      -e SANITY_API_TOKEN=$SANITY_API_TOKEN \
      -e SANITY_REVALIDATE_SECRET=$SANITY_REVALIDATE_SECRET \
      -e BICTA_API_URL=$BICTA_API_URL \
      -e NEXT_PUBLIC_BICTA_API_URL=$NEXT_PUBLIC_BICTA_API_URL
    cd ..
    ;;
  2)
    echo ""
    echo -e "${YELLOW}─── Docker Local Stack ────────────────────────────────${NC}"
    check_cmd docker
    if ! command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null 2>&1; then
      echo -e "${RED}Docker Compose not found. Install Docker Desktop.${NC}"
      exit 1
    fi
    echo "  Building and starting all containers..."
    docker-compose --env-file .env up --build -d
    echo ""
    echo -e "${GREEN}  ✓ All services running:${NC}"
    echo -e "  🌐 Frontend: ${BLUE}http://localhost:3000${NC}"
    echo -e "  🔌 Backend:  ${BLUE}http://localhost:3001${NC}"
    echo -e "  🗄  MySQL:    ${BLUE}localhost:3306${NC}"
    ;;
  3)
    echo -e "${GREEN}  Skipping deployment.${NC}"
    ;;
esac

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ BICTA Elite is ready!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Set up Sanity CMS: sanity.io/manage → project ouj7m9p4"
echo "  2. Deploy backend to Railway: railway.app → New Service → Docker"
echo "  3. Add BICTA_API_URL env var in Vercel pointing to Railway URL"
echo "  4. See DEPLOY.md for detailed instructions"
echo ""
