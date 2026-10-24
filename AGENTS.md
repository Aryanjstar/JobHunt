# Desk

`docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, and `docs/API.md` are the source of truth. `docs/PRODUCT.md` is the page map. `lib/profile.ts` is the only place a fact about Aryan may be added.

- Do not invent a number, a tool, an employer, or a salary.
- Do not add a submit button, a LinkedIn bot, or a Naukri bot.
- A resume and a cover letter stay on one page.
- Action verbs on one resume are unique.
- Route handlers parse with Zod and call `lib/`. They do not call an employer.
- Before pushing, run `npm test`, `npm run typecheck`, and `npm run test:e2e`.
