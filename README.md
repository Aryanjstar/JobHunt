# Desk

Private studio for Aryan Jaiswal. Paste a job description. Get a one-page resume and a cover letter. Nothing is submitted.

The profile in `lib/profile.ts` is the only source of facts. The resume keeps Aryan's LaTeX structure. Bullets are selected and reordered, not invented. The letter is five paragraphs in the same shape as his Codex letter, ending with "would make me a valuable asset". A polished sentence that adds a number or a tool he does not have is thrown out.

Myriox is the default second project. The Wedding Home replaces it for product and full-stack descriptions.

## Run

```bash
npm install
cp .env.example .env.local   # optional, for GPT-4.1
npm run dev
```

Open http://127.0.0.1:3210

```bash
npm test
npm run test:e2e
```

PDF compilation uses Tectonic (`/opt/homebrew/bin/tectonic`). The first run downloads LaTeX packages.

Set `APP_PASSWORD` before putting this anywhere but your own machine. The resume contains a phone number.

## What this is not

hireforge, the local career-ops checkout, scanned boards and produced applications that did not match. Desk does not scrape LinkedIn, does not auto-apply, and does not chase an ATS percentage. It writes the documents and keeps a log of what was prepared.
