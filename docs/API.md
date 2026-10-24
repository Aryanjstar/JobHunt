# Desk API

No login cookie unless `APP_PASSWORD` is set. The Vercel copy is also behind Vercel Authentication.

| Method | Path | Body | Result |
|---|---|---|---|
| GET | `/api/health` | | `{ ok: true, service: "desk" }` |
| GET | `/api/status` | | `{ llm, model }` The key is not returned. |
| POST | `/api/generate` | jd, company, role, wantResume, wantCover, angle, polish, projectIds | Fit, TeX, PDF base64, page fill, fact-check numbers, interview cues. 400 if the description is under 40 characters or both documents are off. |
| POST | `/api/extract` | file | Text from a txt, md, or pdf. |
| GET | `/api/jobs?q=` | Optional keyword, at most 80 characters. | Up to 12 openings. Indian locations sort first. |
| POST | `/api/jobs` | `{ url }` | One Greenhouse, Lever, or Ashby posting. 400 for any other host. |
| POST | `/api/resume` | `{ projectIds }` At most two ids. | The one-page resume PDF for those projects. |
| GET | `/api/applications` | | Rows without the TeX body. |
| PATCH | `/api/applications/:id` | `{ status }` | 400 on an unknown status. 404 if missing. |
| GET | `/api/applications/:id/pdf?doc=resume\|cover` | | PDF. 404 if missing. 500 only when both Tectonic and the fallback fail. |
| POST | `/api/login` | `{ password }` | Sets the cookie only when `APP_PASSWORD` is set. |

Generate does not call an employer. Jobs returns `url` for him to open.
