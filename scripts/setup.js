#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  BICTA — One-Time Setup Script
 *  
 *  Run once after downloading the project:
 *    node scripts/setup.js
 *  
 *  This will:
 *  1. Check all prerequisites
 *  2. Create .env from template
 *  3. Initialise git repo
 *  4. Install all dependencies
 *  5. Connect to GitHub
 *  6. Configure GitHub secrets for auto-deploy
 *  7. Make the first commit and push
 * ═══════════════════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";
import { createInterface } from "readline";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const C = {
  gold:  "\x1b[33m", green: "\x1b[32m", red: "\x1b[31m",
  blue:  "\x1b[34m", dim:   "\x1b[2m",  bold: "\x1b[1m", reset: "\x1b[0m",
};
const log  = (c, msg) => console.log(`${C[c]}${msg}${C.reset}`);
const ok   = (msg) => log("green", `  ✓ ${msg}`);
const warn = (msg) => log("gold",  `  ⚠  ${msg}`);
const inf  = (msg) => log("blue",  `  → ${msg}`);
const fail = (msg) => { log("red", `  ✗ ${msg}`); process.exit(1); };

function run(cmd, cwd = ROOT, inherit = false) {
  try {
    const res = spawnSync(cmd, { shell: true, cwd, encoding: "utf8",
      stdio: inherit ? "inherit" : "pipe" });
    return res.status === 0 ? (res.stdout || "").trim() : null;
  } catch { return null; }
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log(`\n${C.gold}${C.bold}`);
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║   BICTA Elite — First-Time Setup                      ║");
  console.log("║   This runs ONCE to wire your project to GitHub       ║");
  console.log("╚═══════════════════════════════════════════════════════╝");
  console.log(C.reset);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // ── Step 1: Prerequisites ───────────────────────────────────────────
  log("blue", "\n[1/6] Checking prerequisites...");

  const node = run("node --version");
  if (!node) fail("Node.js not installed. Get it from nodejs.org");
  ok(`Node.js ${node}`);

  const npm = run("npm --version");
  if (!npm) fail("npm not found");
  ok(`npm ${npm}`);

  const gitV = run("git --version");
  if (!gitV) fail("Git not installed. Get it from git-scm.com");
  ok(gitV);

  const ghCli = run("gh --version");
  if (!ghCli) {
    warn("GitHub CLI (gh) not installed.");
    warn("You can install it from cli.github.com — it lets us auto-configure secrets.");
    warn("Without it, you'll need to add GitHub secrets manually (instructions in DEPLOY.md).");
  } else {
    ok("GitHub CLI found");
  }

  // ── Step 2: Environment setup ───────────────────────────────────────
  log("blue", "\n[2/6] Setting up environment variables...");

  if (fs.existsSync(path.join(ROOT, ".env"))) {
    ok(".env already exists");
  } else {
    fs.copyFileSync(path.join(ROOT, ".env.example"), path.join(ROOT, ".env"));
    ok("Created .env from template");
  }

  console.log();
  warn("Open the .env file in any text editor and fill in:");
  warn("  DATABASE_URL    — from Railway → your MySQL service → Connect tab");
  warn("  APP_ID          — your Kimi app ID");
  warn("  APP_SECRET      — your Kimi app secret");
  warn("  SANITY_API_TOKEN — from sanity.io/manage → API → Tokens");
  console.log();

  const envReady = await ask(rl, `${C.gold}  Have you filled in your .env values? (y/n): ${C.reset}`);
  if (envReady.toLowerCase() !== "y") {
    log("gold", "\n  Open .env, fill in the values, then run this script again.\n");
    rl.close();
    return;
  }

  // Read .env values
  const envContent = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const envVars = Object.fromEntries(
    envContent.split("\n")
      .filter(l => l.includes("=") && !l.startsWith("#"))
      .map(l => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
  );

  // ── Step 3: Install dependencies ───────────────────────────────────
  log("blue", "\n[3/6] Installing dependencies...");

  inf("Installing frontend dependencies...");
  const frontendInstall = run("npm install --legacy-peer-deps", path.join(ROOT, "frontend"), true);
  ok("Frontend deps installed");

  inf("Installing backend dependencies...");
  const backendInstall = run("npm install --legacy-peer-deps", path.join(ROOT, "backend"), true);
  ok("Backend deps installed");

  // ── Step 4: Push DB schema ─────────────────────────────────────────
  log("blue", "\n[4/6] Pushing database schema to Railway MySQL...");
  const dbUrl = envVars.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("PASSWORD")) {
    warn("DATABASE_URL not set or still has placeholder. Skipping DB push.");
    warn("Run manually: cd backend && DATABASE_URL=... npx drizzle-kit push");
  } else {
    process.env.DATABASE_URL = dbUrl;
    const dbPush = run("npx drizzle-kit push --config=drizzle.config.ts", path.join(ROOT, "backend"), true);
    if (dbPush === null) warn("DB push may have failed. Check your DATABASE_URL.");
    else ok("Database schema pushed");
  }

  // ── Step 5: Git setup ──────────────────────────────────────────────
  log("blue", "\n[5/6] Setting up Git repository...");

  const isRepo = run("git rev-parse --git-dir") !== null;
  if (!isRepo) {
    run("git init", ROOT, true);
    ok("Initialised git repository");
  } else {
    ok("Git repository already exists");
  }

  // Configure git user if not set
  const gitUser = run("git config user.email");
  if (!gitUser) {
    const email = await ask(rl, `${C.gold}  Your email for git commits: ${C.reset}`);
    const name  = await ask(rl, `${C.gold}  Your name for git commits: ${C.reset}`);
    run(`git config user.email "${email}"`);
    run(`git config user.name "${name}"`);
    ok("Git user configured");
  }

  // Create .gitignore at root if not present
  const rootGitignore = path.join(ROOT, ".gitignore");
  if (!fs.existsSync(rootGitignore)) {
    fs.writeFileSync(rootGitignore,
      ".env\n.env.local\nnode_modules/\nfrontend/.next/\nbackend/dist/\n.DS_Store\n"
    );
    ok("Created root .gitignore");
  }

  // ── Step 6: GitHub remote ──────────────────────────────────────────
  log("blue", "\n[6/6] Connecting to GitHub...");

  const existingRemote = run("git remote get-url origin");
  if (existingRemote) {
    ok(`GitHub remote: ${existingRemote}`);
  } else {
    console.log();
    log("gold", "  You need a GitHub repository to enable auto-deploy.");
    log("gold", "  Create one at github.com → New Repository → name it 'bicta-website'");
    console.log();
    const repoUrl = await ask(rl, `${C.gold}  Paste your GitHub repo URL (e.g. https://github.com/yourname/bicta-website): ${C.reset}`);
    if (repoUrl.trim()) {
      run(`git remote add origin ${repoUrl.trim()}`);
      ok(`Remote set to: ${repoUrl.trim()}`);
    } else {
      warn("No remote set. Add it manually: git remote add origin <url>");
    }
  }

  // Configure GitHub Secrets (if gh CLI available)
  if (ghCli) {
    console.log();
    log("gold", "  Configuring GitHub secrets for auto-deploy...");
    log("dim",  "  (You need to be logged in to GitHub CLI — run 'gh auth login' if prompted)");

    const secrets = [
      ["NEXT_PUBLIC_SANITY_PROJECT_ID", envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || "ouj7m9p4"],
      ["SANITY_API_TOKEN",              envVars.SANITY_API_TOKEN || ""],
      ["SANITY_REVALIDATE_SECRET",      envVars.SANITY_REVALIDATE_SECRET || "bicta_secret_2026"],
      ["BICTA_API_URL",                 envVars.BICTA_API_URL || ""],
    ];

    for (const [key, value] of secrets) {
      if (value && !value.includes("your_") && value !== "") {
        const r = run(`echo "${value}" | gh secret set ${key}`, ROOT);
        if (r !== null) ok(`Secret set: ${key}`);
        else warn(`Could not set secret: ${key} (set manually in GitHub → Settings → Secrets)`);
      } else {
        warn(`Skipped empty secret: ${key}`);
      }
    }
  }

  // Initial commit and push
  console.log();
  inf("Making initial commit...");
  run("git add -A", ROOT);
  const committed = run('git commit -m "🚀 BICTA Elite — initial setup"', ROOT);
  if (committed) {
    ok("Initial commit created");
    const pushed = run("git push -u origin main", ROOT, true);
    if (pushed === null) {
      warn("Push failed. Try: git push -u origin main");
    } else {
      ok("Pushed to GitHub — deploy triggered!");
    }
  } else {
    warn("Nothing to commit");
  }

  // ── Done ────────────────────────────────────────────────────────────
  console.log();
  log("green", "╔═══════════════════════════════════════════════════════╗");
  log("green", "║  ✅ Setup complete!                                    ║");
  log("green", "╚═══════════════════════════════════════════════════════╝");
  console.log();
  log("gold",  "  From now on, to apply AI changes:");
  log("blue",  "    node scripts/apply-ai-change.js change.json");
  console.log();
  log("gold",  "  Or paste JSON directly:");
  log("blue",  "    node scripts/apply-ai-change.js");
  console.log();
  log("gold",  "  Vercel dashboard: https://vercel.com/dashboard");
  log("gold",  "  Railway dashboard: https://railway.app/dashboard");
  console.log();

  rl.close();
}

main().catch(e => {
  console.error(`\nSetup failed: ${e.message}`);
  process.exit(1);
});
