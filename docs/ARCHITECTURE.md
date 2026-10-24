# Desk architecture

One Next.js app. `lib/` holds the profile, the tailor, the guard, LaTeX, and the board reader. Route handlers parse with Zod and call those functions. They do not invent facts.

```
description → analyze → select (or the two pins) → letter → guard → Tectonic
boards      → title and place filter → fit ≥ 4 → shortlist → Tailor
```

Tectonic is a local binary. If it fails, the handler returns the TeX and a warning. The letter polish calls Azure OpenAI gpt-5.4 only when the checkbox is on and the env is set. A polished paragraph that adds a number or a forbidden tool is discarded and the plain letter is kept.

AURA's live site still speaks `max_tokens`, so that app uses gpt-4.1-mini. Desk's polish uses gpt-5.4, which rejects `max_tokens`.

What this product refused from The Wedding Home template: a `src/modules` move, bcrypt, a database server, and rupees. The local JSON log is enough for one person. What it refused from hireforge: scanning boards and applying.
