# BICTA Elite — AI-Powered Website

> Describe a change in Claude chat → one command → live in production.

---

## First Time Setup (Run Once)

```bash
node scripts/setup.js
```

This installs everything, connects to GitHub, and configures auto-deploy.

---

## How to Make Changes via Claude

**Step 1** — Describe what you want to Claude (in this chat):

> *"Change the homepage headline to 'Bangladesh's Premier ICT Platform'"*

**Step 2** — Claude responds with a JSON block like this:

```json
{
  "description": "Update homepage hero headline",
  "commit_message": "content: update hero headline",
  "changes": [
    {
      "operation": "replace",
      "file": "frontend/src/sections/HomeHero.tsx",
      "find": "Bridging Academia & Industry",
      "replace": "Bangladesh's Premier ICT Platform"
    }
  ]
}
```

**Step 3** — Save that JSON to `change.json` and run:

```bash
node scripts/apply-ai-change.js change.json
```

**Step 4** — Watch it deploy:
- GitHub receives the commit
- Vercel auto-deploys frontend in ~1 minute  
- Railway auto-deploys backend in ~1 minute

That's it. Your change is live.

---

## What You Can Ask Claude to Change

| Category | Examples |
|---|---|
| **Text & Content** | Headlines, bios, mission statement, footer text |
| **Advisors** | Add/edit/remove advisor cards |
| **Events** | Add events, change event details |
| **Design** | Colors, fonts, spacing |
| **Features** | New pages, new sections, UI changes |
| **Competition** | Questions, time limits, anti-cheat settings |
| **Backend API** | New endpoints, database fields |

---

## Project Structure

```
bicta-elite/
├── frontend/           → Next.js 14 website (deploys to Vercel)
├── backend/            → Hono tRPC API (deploys to Railway)
├── scripts/
│   ├── setup.js        → First-time setup
│   └── apply-ai-change.js → Apply Claude's changes
├── .github/workflows/  → Auto-deploy pipelines
├── docker-compose.yml  → Local dev (all services)
├── DEPLOY.md           → Full deployment guide
└── CLAUDE-CHANGE-FORMAT.md → Change JSON format reference
```

---

## Quick Commands

```bash
# First-time setup
node scripts/setup.js

# Apply a change from Claude
node scripts/apply-ai-change.js change.json

# Local development (needs Docker Desktop)
docker-compose up

# Manual Vercel deploy
cd frontend && npx vercel --prod

# Push DB schema after adding tables
cd backend && npx drizzle-kit push
```

---

*Sanity Project: `ouj7m9p4` | Railway MySQL: `zephyr.proxy.rlwy.net:11251`*
