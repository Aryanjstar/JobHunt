# Desk API

No login cookie unless `APP_PASSWORD` is set. The Vercel copy is also behind Vercel Authentication.

| Method | Path | Body | Result |
|---|---|---|---|
| GET | `/api/health` | | `{ ok: true, service: "desk" }` |
| GET | `/api/status` | | `{ llm, model }` The key is not returned. |
| POST | `/api/generate` | jd, company, role, wantResume, wantCover, angle, polish, projectIds | Fit, TeX, PDF base64. 400 if the description is under 40 characters or both documents are off. |
| POST | `/api/extract` | file | Text from a txt, md, or pdf. |
| GET | `/api/jobs` | | Up to 12 openings. 502 if every board fails. |
| GET | `/api/applications` | | Rows without the TeX body. |
| PATCH | `/api/applications/:id` | `{ status }` | 400 on an unknown status. 404 if missing. |
| GET | `/api/applications/:id/pdf?doc=resume\|cover` | | PDF, or 404, or 500 if Tectonic fails. |
| POST | `/api/login` | `{ password }` | Sets the cookie only when `APP_PASSWORD` is set. |

Generate does not call an employer. Jobs returns `url` for him to open.
