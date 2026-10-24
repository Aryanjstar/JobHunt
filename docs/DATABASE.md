# Desk data

There is no database server.

| Object | Where | Notes |
|---|---|---|
| Profile | `lib/profile.ts` | Source of every fact. Committed. |
| Application | `data/applications.json` | Local only. Gitignored. Holds TeX, not the Azure key. |
| Pins | `localStorage` key `desk-projects` | Two project ids. |
| Prepared job | `sessionStorage` key `desk-prepare` | Cleared when Tailor reads it. |

Last write wins on the JSON file. One user, one machine. Delete the file to wipe the log. The profile is not in that file, so a wipe does not delete facts.

The phone number and email are in the profile and in every PDF. They are not written to logs beyond the TeX he asked to keep.
