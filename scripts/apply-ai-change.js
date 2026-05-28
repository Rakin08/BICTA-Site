#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  BICTA — AI Change Applier
 *  
 *  How it works:
 *  1. You describe a change to Claude in chat
 *  2. Claude outputs a change.json (or you paste inline)
 *  3. You run: node scripts/apply-ai-change.js change.json
 *  4. This script applies edits, commits, pushes to GitHub
 *  5. Vercel + Railway auto-deploy in ~2 minutes
 * ═══════════════════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createInterface } from "readline";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ── Terminal colours ──────────────────────────────────────────────────
const C = {
  gold:   "\x1b[33m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  dim:    "\x1b[2m",
  bold:   "\x1b[1m",
  reset:  "\x1b[0m",
};
const log = (c, msg) => console.log(`${C[c]}${msg}${C.reset}`);
const ok  = (msg) => log("green", `  ✓ ${msg}`);
const err = (msg) => { log("red", `  ✗ ${msg}`); process.exit(1); };
const inf = (msg) => log("blue",  `  → ${msg}`);

// ── Git helpers ───────────────────────────────────────────────────────
function git(cmd, opts = {}) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8", ...opts }).trim();
  } catch (e) {
    return null;
  }
}

function isGitRepo() {
  return git("rev-parse --git-dir") !== null;
}

function hasUncommitted() {
  const status = git("status --porcelain");
  return status && status.length > 0;
}

// ── Apply a single file change ────────────────────────────────────────
function applyFileChange(change) {
  const filePath = path.resolve(ROOT, change.file);
  const dir = path.dirname(filePath);

  switch (change.operation) {
    case "create":
    case "overwrite": {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, change.content, "utf8");
      ok(`${change.operation}: ${change.file}`);
      break;
    }

    case "replace": {
      if (!fs.existsSync(filePath)) err(`File not found for replace: ${change.file}`);
      let src = fs.readFileSync(filePath, "utf8");
      const occurrences = (src.split(change.find).length - 1);
      if (occurrences === 0) err(`Pattern not found in ${change.file}:\n  "${change.find.slice(0, 80)}..."`);
      if (occurrences > 1 && !change.replaceAll) {
        log("gold", `  ⚠  Found ${occurrences} matches in ${change.file}, replacing first only`);
      }
      const method = change.replaceAll ? "replaceAll" : "replace";
      src = src[method](change.find, change.replace);
      fs.writeFileSync(filePath, src, "utf8");
      ok(`replaced in: ${change.file}`);
      break;
    }

    case "append": {
      if (!fs.existsSync(filePath)) err(`File not found for append: ${change.file}`);
      fs.appendFileSync(filePath, "\n" + change.content, "utf8");
      ok(`appended to: ${change.file}`);
      break;
    }

    case "prepend": {
      if (!fs.existsSync(filePath)) err(`File not found for prepend: ${change.file}`);
      const existing = fs.readFileSync(filePath, "utf8");
      fs.writeFileSync(filePath, change.content + "\n" + existing, "utf8");
      ok(`prepended to: ${change.file}`);
      break;
    }

    case "delete": {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        ok(`deleted: ${change.file}`);
      } else {
        log("gold", `  ⚠  File already absent: ${change.file}`);
      }
      break;
    }

    case "json_set": {
      // Safely set a key path in a JSON file
      // e.g. key: "dependencies.next", value: "^14.2.18"
      if (!fs.existsSync(filePath)) err(`File not found: ${change.file}`);
      const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const keys = change.key.split(".");
      let cur = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = change.value;
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8");
      ok(`json_set ${change.key} in: ${change.file}`);
      break;
    }

    default:
      err(`Unknown operation: "${change.operation}". Valid: create, overwrite, replace, append, prepend, delete, json_set`);
  }
}

// ── Run post-change commands ──────────────────────────────────────────
function runPostCommands(commands) {
  for (const cmd of commands) {
    inf(`Running: ${cmd}`);
    try {
      execSync(cmd, { cwd: ROOT, stdio: "inherit" });
      ok(`Done: ${cmd}`);
    } catch {
      log("gold", `  ⚠  Command failed (non-fatal): ${cmd}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${C.gold}${C.bold}╔═══════════════════════════════════════╗`);
  console.log(`║   BICTA — AI Change Applier           ║`);
  console.log(`╚═══════════════════════════════════════╝${C.reset}\n`);

  // ── Read change spec ────────────────────────────────────────────────
  let spec;

  const inputArg = process.argv[2];

  if (inputArg) {
    // Load from file
    const changePath = path.resolve(process.cwd(), inputArg);
    if (!fs.existsSync(changePath)) err(`Change file not found: ${inputArg}`);
    spec = JSON.parse(fs.readFileSync(changePath, "utf8"));
    inf(`Loaded change spec: ${inputArg}`);
  } else {
    // Read from stdin (paste mode)
    log("gold", "Paste your change JSON (from Claude), then press Enter twice:\n");
    const rl = createInterface({ input: process.stdin });
    let lines = [];
    for await (const line of rl) {
      if (line === "" && lines.length > 0) break;
      lines.push(line);
    }
    try {
      spec = JSON.parse(lines.join("\n"));
    } catch {
      err("Invalid JSON. Make sure you copied the full change spec from Claude.");
    }
  }

  // ── Validate spec ───────────────────────────────────────────────────
  if (!spec.description) err("Change spec missing 'description' field");
  if (!Array.isArray(spec.changes) || spec.changes.length === 0) err("Change spec missing 'changes' array");

  log("gold", `📋 Change: ${spec.description}`);
  inf(`${spec.changes.length} file operation(s) to apply`);
  if (spec.commit_message) inf(`Commit message: ${spec.commit_message}`);
  console.log();

  // ── Check git status ────────────────────────────────────────────────
  if (!isGitRepo()) err("Not a git repository. Run: git init && git remote add origin <your-github-url>");

  // Stash any existing uncommitted changes to avoid conflicts
  if (hasUncommitted()) {
    log("gold", "  ⚠  Uncommitted changes found — stashing temporarily...");
    git("stash push -m 'auto-stash before AI change'");
  }

  // ── Apply all file changes ──────────────────────────────────────────
  console.log(`${C.blue}Applying changes...${C.reset}`);
  for (const change of spec.changes) {
    applyFileChange(change);
  }
  console.log();

  // ── Run post commands (e.g. npm install) ────────────────────────────
  if (spec.post_commands && spec.post_commands.length > 0) {
    console.log(`${C.blue}Running post-change commands...${C.reset}`);
    runPostCommands(spec.post_commands);
    console.log();
  }

  // ── Commit and push ─────────────────────────────────────────────────
  const msg = spec.commit_message || `AI change: ${spec.description}`;
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);

  console.log(`${C.blue}Committing and pushing...${C.reset}`);
  git("add -A");

  const commitResult = git(`commit -m "${msg} [${timestamp}]"`);
  if (!commitResult) {
    log("gold", "  ⚠  Nothing to commit (files may be unchanged)");
  } else {
    ok(`Committed: ${msg}`);
  }

  // Push to origin
  const pushResult = git("push origin main", { stdio: "pipe" });
  if (pushResult === null) {
    // Try to push with upstream set
    const pushFull = execSync("git push --set-upstream origin main", {
      cwd: ROOT, encoding: "utf8", stdio: "pipe"
    }).trim();
    if (pushFull !== null) ok("Pushed to GitHub → auto-deploy triggered");
  } else {
    ok("Pushed to GitHub → auto-deploy triggered");
  }

  // ── Done ─────────────────────────────────────────────────────────────
  console.log();
  log("green", "╔═══════════════════════════════════════════╗");
  log("green", "║  ✅ Change applied and deployed!           ║");
  log("green", "╚═══════════════════════════════════════════╝");
  console.log();
  log("gold", "  🌐 Vercel will be live in ~1-2 minutes");
  log("gold", "  🔌 Railway backend will restart in ~1-2 minutes");
  console.log();
  log("dim", "  Watch deploy progress at:");
  log("blue", "  → https://vercel.com/dashboard");
  log("blue", "  → https://railway.app/dashboard");
  console.log();

  // Clean up temp change file if it was a temp one
  if (inputArg && inputArg.endsWith(".tmp.json")) {
    fs.unlinkSync(path.resolve(process.cwd(), inputArg));
  }
}

main().catch((e) => {
  log("red", `\nFatal error: ${e.message}`);
  process.exit(1);
});
