# BICTA Elite — Complete Deployment Guide
*For non-technical owners. Follow each step in order.*

---

## 🗺 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     BICTA SYSTEM                         │
├──────────────────┬───────────────────┬───────────────────┤
│   FRONTEND       │    BACKEND API    │    DATABASE       │
│   Next.js 14     │    Hono + tRPC    │    MySQL          │
│   → Vercel       │    → Railway      │    → Railway      │
│   (free)         │    ($5/mo)        │    (already set)  │
└──────────────────┴───────────────────┴───────────────────┘
             ↕ talks to ↕           ↕ talks to ↕
         Sanity CMS (free tier) — content management
```

---

## PART A — Deploy Frontend to Vercel (10 minutes)

### What is Vercel?
Free hosting specifically built for Next.js. Your site will be live at a URL like `bicta-website.vercel.app` within minutes.

### Step 1: Create a GitHub account (if you don't have one)
→ Go to **github.com** → Sign up (free)

### Step 2: Upload this project to GitHub
1. Click the **+** button on GitHub → "New repository"
2. Name it `bicta-website`, set to **Private**, click **Create repository**
3. On your computer, open Terminal (Mac) or Command Prompt (Windows)
4. `cd` into the `bicta-deploy-FINAL` folder
5. Run these commands one by one:
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bicta-website.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to **vercel.com** → Sign up with GitHub
2. Click **"Add New Project"** → Select `bicta-website`
3. Click **"Environment Variables"** and add these:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `ouj7m9p4` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | *(get from Step B.4)* |
| `SANITY_REVALIDATE_SECRET` | `bicta_secret_2026` |
| `BICTA_API_URL` | *(leave empty for now, add after backend deploy)* |

4. Click **Deploy** → your site is live in ~2 minutes

### Step 4: Add your custom domain
In Vercel → Your project → Settings → Domains → type `bicta.org` → follow DNS instructions.

---

## PART B — Set Up Sanity CMS (15 minutes)

Your Sanity project already exists: **Project ID = `ouj7m9p4`**

### Step 1: Log in to Sanity
Go to **sanity.io/manage** → log in with your account

### Step 2: Find your project
Look for project ID `ouj7m9p4` or search "BICTA"

### Step 3: Get your API token
1. Click your BICTA project
2. Go to **API** tab → **Tokens**
3. Click **"Add API token"**
4. Name it `Vercel Deploy`, set permission to **Editor**
5. Copy the token → paste it into Vercel as `SANITY_API_TOKEN`

### Step 4: Add CORS origins
1. Still in API tab → **CORS Origins**
2. Click **Add CORS origin**
3. Add: `https://bicta-website.vercel.app` (your Vercel URL)
4. Add: `https://bicta.org` (your real domain)
5. Tick "Allow credentials" for both

### Step 5: Add content via Sanity Studio
Run locally:
```bash
cd frontend/studio
npx sanity@latest dev
```
Open `http://localhost:3333` → add your advisors, founders, events, etc.

---

## PART C — Deploy Backend to Railway (20 minutes)

Your database is already on Railway. Now you need to run the API server there too.

### Step 1: Go to Railway
→ **railway.app** → log in → open your existing project

### Step 2: Add a new service
1. Click **"+ New"** → **"GitHub Repo"**
2. Select `bicta-website` and set the **Root Directory** to `backend`
3. Railway auto-detects the Dockerfile

### Step 3: Add environment variables in Railway
Click your new API service → **Variables** → add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | *(copy from your MySQL service → Connect tab)* |
| `APP_ID` | *(your Kimi app ID)* |
| `APP_SECRET` | *(your Kimi app secret)* |
| `KIMI_AUTH_URL` | `https://account.kimi.ai` |
| `KIMI_OPEN_URL` | `https://kimi.ai` |
| `PORT` | `3001` |
| `NODE_ENV` | `production` |

### Step 4: Generate the Railway domain
1. Click your API service → **Settings** → **Networking** → **Generate Domain**
2. Copy the domain (e.g., `bicta-api.railway.app`)

### Step 5: Connect frontend to backend
1. Go back to **Vercel** → your project → **Settings** → **Environment Variables**
2. Update `BICTA_API_URL` = `https://bicta-api.railway.app`
3. Update `NEXT_PUBLIC_BICTA_API_URL` = `https://bicta-api.railway.app`
4. Go to **Deployments** → click **"Redeploy"**

### Step 6: Push database schema
Run once on your computer:
```bash
cd backend
npm install --legacy-peer-deps
export DATABASE_URL="mysql://root:PASSWORD@zephyr.proxy.rlwy.net:11251/railway"
npx drizzle-kit push
```

---

## PART D — Local Development (Optional)

If you want to run everything on your computer first:

### Requirements
- **Docker Desktop**: docker.com/products/docker-desktop → install → start it
- **Terminal**: already installed on your computer

### Start everything with one command
```bash
# 1. Copy and fill in your environment variables
cp .env.example .env
# (open .env in any text editor and fill in your values)

# 2. Start all services
docker-compose up
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MySQL database**: localhost:3306

Stop everything: `docker-compose down`

---

## Quick Reference

### URLs after deployment
| Service | URL |
|---|---|
| Your website | `https://bicta.org` |
| Vercel dashboard | `vercel.com/dashboard` |
| Sanity Studio | `sanity.io/manage` (project `ouj7m9p4`) |
| Railway | `railway.app` |

### Common issues

**"Build failed" on Vercel**
→ Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in Vercel environment variables

**"Cannot connect to API"**
→ Check `BICTA_API_URL` is set to your Railway API URL (no trailing slash)

**Database errors**
→ Run `npx drizzle-kit push` from the backend folder with your `DATABASE_URL` set

**Exam camera not working**
→ The exam page requires HTTPS. It will work on your Vercel domain but not on `localhost`.

---

*Project Owner: Tanjim Mahmud Rakin | Sanity Project: ouj7m9p4 | Railway MySQL: zephyr.proxy.rlwy.net:11251*
