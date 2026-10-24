# Desk PRD

## Tailor

Given a job description of at least 40 characters, a company, and a role, Desk returns a fit score from 1 to 5, the skills the posting asks for that are not in the profile, a resume, a cover letter, or both.

The resume uses his LaTeX. Two projects. Experience bullets are his sentences, chosen and ordered. The letter has five paragraphs. The last one contains the words "would make me a valuable asset".

A score of 1 still produces documents. A blocker is shown and does not hide the button.

## Projects

He pins two projects from the resume list. Unknown ids are ignored. The same id twice counts once. With one pin, the second project is the best remaining match. With none, AURA stays first and the description picks the second.

## Shortlist

Public Greenhouse JSON only. A title must look like AI, full-stack, backend, SDE, or member of technical staff. Intern, senior, staff, principal, director, and manager titles are skipped. A named place must be India, Bengaluru, remote, hybrid, or worldwide. Fit must be 4 or 5 and must have no blocker. At most 12 rows. Prepare opens Tailor. Open posting is a link. There is no submit.

## Log

Each generate saves company, role, fit, the second project name, status `prepared`, and the TeX. Status can move to applied, replied, interview, offer, or closed. He sets that. The app does not.

## Out of scope

LinkedIn Easy Apply, Naukri bots, salary or notice period guesses, a second user, and a PDF engine on Vercel. PDFs compile with Tectonic on the Mac. The hosted app still returns TeX.
