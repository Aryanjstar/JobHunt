"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Opening = {
  company: string;
  title: string;
  location: string;
  url: string;
  score: number;
  reasons: string[];
  description: string;
};

export default function JobsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Opening[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/jobs");
      const body = (await response.json()) as { openings?: Opening[]; error?: string };
      if (!response.ok) setError(body.error || "The boards did not answer.");
      setRows(body.openings ?? []);
    } catch {
      setError("The boards did not answer.");
    } finally {
      setBusy(false);
    }
  }

  function prepare(row: Opening) {
    sessionStorage.setItem(
      "desk-prepare",
      JSON.stringify({
        company: row.company,
        role: row.title,
        jd: row.description || `${row.title} at ${row.company}\n${row.location}`,
      }),
    );
    router.push("/studio");
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: 42, mb: 1 }}>Shortlist</Typography>
      <Typography sx={{ maxWidth: 680, mb: 2 }}>
        These come from public Greenhouse boards. A role is shown only when the fit is 4 or 5 and it does not ask for a senior level or US citizenship. Desk can write the documents. You open the company page and press submit yourself.
      </Typography>
      <Button variant="contained" onClick={load} disabled={busy} sx={{ mb: 2 }}>
        {busy ? "Reading the boards…" : "Find roles"}
      </Button>
      {error && <Typography color="secondary">{error}</Typography>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {rows.map((row) => (
          <Box key={row.url} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", p: 2 }}>
            <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
              {row.company} — {row.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fit {row.score} of 5 · {row.location}
            </Typography>
            {row.reasons.map((reason) => (
              <Typography key={reason} variant="body2" sx={{ mt: 0.5 }}>{reason}</Typography>
            ))}
            <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
              <Button variant="contained" onClick={() => prepare(row)}>Prepare documents</Button>
              <Button variant="outlined" component="a" href={row.url} target="_blank" rel="noreferrer">
                Open the posting
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
