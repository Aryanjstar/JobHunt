# Desk PRD

## Tailor

Given a job description of at least 40 characters, a company, and a role, Desk returns a fit score from 1 to 5, the skills the posting asks for that are not in the profile, a resume, a cover letter, or both.

The resume uses his LaTeX. Two projects. Experience bullets are his sentences, chosen and ordered. The letter has five paragraphs. The last one contains the words "would make me a valuable asset".

A score of 1 still produces documents. A blocker is shown and does not hide the button.

The PDF reports how far down the page the text reaches. Every number on the page is checked against the profile. A shortlist row can wait in a queue of at most 12. Tailor loads the next one. Four interview cues are written from the selected lines. A tool that is not in the profile is named so he does not claim it.

## Projects

He pins two projects from the resume list. Unknown ids are ignored. The same id twice counts once. With one pin, the second project is the best remaining match. With none, AURA stays first and the description picks the second.

## Shortlist

Public Greenhouse, Lever, and Ashby JSON, plus Remotive software roles. Indian companies are read first. A title must look like AI, full-stack, backend, software, SDE, or member of technical staff. Intern, senior, staff, principal, director, manager, and lead titles are skipped. A named place must be in India, or remote or worldwide without a foreign city. Hybrid counts when the city is in India. Fit must be 3 or higher and must have no blocker. At most 12 rows. A Greenhouse, Lever, or Ashby link can be pasted. Prepare opens Tailor. Open posting is a link. There is no submit.

## Log

Each generate saves company, role, fit, the second project name, status `prepared`, and the TeX. Status can move to applied, replied, interview, offer, or closed. He sets that. The app does not.

## Out of scope

LinkedIn Easy Apply, Naukri bots, Foundit bots, salary or notice period guesses, and a second user. PDFs compile with Tectonic on the Mac. If Tectonic is missing, the same words are drawn into a one-page PDF.
