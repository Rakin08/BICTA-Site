# BICTA — Claude Change Format Reference

When you ask Claude to change something on your BICTA website,
Claude will respond with a JSON block in this exact format.
You copy it to `change.json`, then run:

```bash
node scripts/apply-ai-change.js change.json
```

---

## The JSON Format

```json
{
  "description": "One-line human description of what this change does",
  "commit_message": "feat: short git commit message",
  "post_commands": [],
  "changes": [
    {
      "operation": "replace",
      "file": "frontend/src/sections/HomeHero.tsx",
      "find": "exact text to find in the file",
      "replace": "new text to put in its place"
    }
  ]
}
```

---

## Operations

| Operation  | What it does | Required fields |
|-----------|--------------|-----------------|
| `replace`  | Find text and swap it | `file`, `find`, `replace` |
| `create`   | Create a brand new file | `file`, `content` |
| `overwrite`| Replace entire file contents | `file`, `content` |
| `append`   | Add text to end of file | `file`, `content` |
| `delete`   | Delete a file | `file` |
| `json_set` | Set a value in a JSON file | `file`, `key`, `value` |

---

## Real Examples

### Example 1 — Change hero headline
```json
{
  "description": "Update homepage hero headline",
  "commit_message": "content: update hero headline text",
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

### Example 2 — Add a new advisor to static data
```json
{
  "description": "Add Dr. Rahim as new advisor",
  "commit_message": "content: add Dr. Rahim to advisors",
  "changes": [
    {
      "operation": "replace",
      "file": "frontend/src/lib/static-data.ts",
      "find": "export const ADVISORS: Advisor[] = [",
      "replace": "export const ADVISORS: Advisor[] = [\n  {\n    id: 9,\n    name: \"Dr. Rahim\",\n    title: \"AI Research Lead\",\n    company: \"BUET\",\n    category: \"Academia\",\n    expertise: \"Deep Learning, NLP\",\n    bio: \"Leading AI researcher.\",\n    imageUrl: \"\",\n    linkedIn: \"#\",\n    published: true\n  },"
    }
  ]
}
```

### Example 3 — Change the gold accent colour
```json
{
  "description": "Change brand gold color to a warmer tone",
  "commit_message": "design: update gold accent color",
  "changes": [
    {
      "operation": "replace",
      "file": "frontend/tailwind.config.ts",
      "find": "\"bicta-gold\":    \"#c9a84c\"",
      "replace": "\"bicta-gold\":    \"#d4a853\""
    }
  ]
}
```

### Example 4 — Add a new page
```json
{
  "description": "Add a new team page",
  "commit_message": "feat: add /team page",
  "changes": [
    {
      "operation": "create",
      "file": "frontend/app/team/page.tsx",
      "content": "export default function TeamPage() {\n  return <div>Team page</div>;\n}"
    }
  ]
}
```

### Example 5 — Multiple changes at once
```json
{
  "description": "Update footer copyright year and contact email",
  "commit_message": "content: update footer info",
  "changes": [
    {
      "operation": "replace",
      "file": "frontend/src/components/layout/SiteFooter.tsx",
      "find": "© 2025 BICTA",
      "replace": "© 2026 BICTA"
    },
    {
      "operation": "replace",
      "file": "frontend/src/components/layout/SiteFooter.tsx",
      "find": "info@bicta.org",
      "replace": "hello@bicta.org"
    }
  ]
}
```

---

## File Path Reference

| What you want to change | File path |
|---|---|
| Homepage hero | `frontend/src/sections/HomeHero.tsx` |
| Navigation bar | `frontend/src/components/layout/SiteNav.tsx` |
| Footer | `frontend/src/components/layout/SiteFooter.tsx` |
| Advisors/Founders data | `frontend/src/lib/static-data.ts` |
| Brand colours | `frontend/tailwind.config.ts` |
| Events page | `frontend/app/events/page.tsx` |
| Exam/competition UI | `frontend/src/components/competition/ExamInterface.tsx` |
| Anti-cheat settings | `frontend/src/hooks/useAntiCheat.ts` |
| Admin dashboard | `frontend/app/admin/` |
| Backend API routes | `backend/api/` |
| Database schema | `backend/db/schema.ts` |

---

## How to ask Claude for changes

Just describe what you want in plain English. Examples:

- *"Change the homepage headline to 'Leading Bangladesh's AI Revolution'"*
- *"Add a new advisor: Dr. Karim, Chief Tech at Brain Station 23, expertise in Fintech"*  
- *"Make the gold color darker, more like #b8943e"*
- *"Add a registration deadline field to the events page"*
- *"Change the anti-cheat max violations from 3 to 2"*
- *"Update the footer phone number to +880-1234-567890"*

Claude will respond with the exact JSON change spec.
You copy it, run the command, and it's live in 2 minutes.
