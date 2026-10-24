"use client";

import { useEffect, useState } from "react";
import { parseQueue, QUEUE_KEY, type QueueItem } from "@/lib/queue";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type Opening = {
  company: string;
  title: string;
  location: string;
  url: string;
  score: number;
  reasons: string[];
  description: string;
  source: string;
};

export default function JobsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Opening[]>([]);
  const [query, setQuery] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [looked, setLooked] = useState(false);
  const [queued, setQueued] = useState(0);

  useEffect(() => {
    setQueued(parseQueue(localStorage.getItem(QUEUE_KEY)).length);
  }, []);

  async function load() {
    setBusy(true);
    setError("");
    setLooked(true);
    try {
      const response = await fetch(`/api/jobs?q=${encodeURIComponent(query.trim())}`);
      const body = (await response.json()) as { openings?: Opening[]; error?: string };
      if (!response.ok) setError(body.error || "The boards did not answer.");
      setRows(body.openings ?? []);
    } catch {
      setError("The boards did not answer.");
    } finally {
      setBusy(false);
    }
  }

  async function readLink() {
    setReading(true);
    setError("");
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link.trim() }),
      });
      const body = (await response.json()) as { opening?: Opening; error?: string };
      if (!response.ok || !body.opening) {
        setError(body.error || "That posting did not load.");
        return;
      }
      prepare(body.opening);
    } catch {
      setError("That posting did not load.");
    } finally {
      setReading(false);
    }
  }

  function enqueue(row: Opening) {
    const item: QueueItem = {
      company: row.company,
      role: row.title,
      jd: row.description || `${row.title} at ${row.company}\n${row.location}`,
    };
    if (item.jd.trim().length < 40) {
      setError("That posting is too short to queue.");
      return;
    }
    const next = [...parseQueue(localStorage.getItem(QUEUE_KEY)).filter((saved) => saved.jd !== item.jd), item].slice(-12);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
    setError("");
    setQueued(next.length);
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
      <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 46 }, mb: 1 }}>Shortlist</Typography>
      <Typography sx={{ maxWidth: 820, mb: 2 }}>
        Indian company boards come first: Groww, Druva, slice, HackerRank, Observe.AI, CRED, Meesho, Paytm, and Atlan. Remote roles are added when the posting is open to India or worldwide. Desk writes the documents. You open the company page and submit.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr auto" }, gap: 1.5, mb: 1.5, alignItems: "start" }}>
        <TextField
          label="Keyword"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="backend, AI, Bengaluru"
          onKeyDown={(event) => {
            if (event.key === "Enter") load();
          }}
        />
        <Button variant="contained" onClick={load} disabled={busy} sx={{ height: 56 }}>
          {busy ? "Reading the boards…" : "Find roles"}
        </Button>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr auto" }, gap: 1.5, mb: 2, alignItems: "start" }}>
        <TextField
          label="Greenhouse, Lever, or Ashby link"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://jobs.lever.co/..."
        />
        <Button variant="outlined" onClick={readLink} disabled={reading || link.trim().length < 12} sx={{ height: 56 }}>
          {reading ? "Reading…" : "Prepare this link"}
        </Button>
      </Box>
      {queued > 0 && (
        <Typography sx={{ mb: 2 }}>
          {queued} in the tailor queue. Open Tailor and use the next one.
        </Typography>
      )}
      {error && <Typography sx={{ mb: 2, color: "secondary.main" }}>{error}</Typography>}
      {looked && !busy && rows.length === 0 && !error && (
        <Typography>No role matched that keyword. Try a shorter word, or paste the posting link above.</Typography>
      )}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
        {rows.map((row) => (
          <Box key={row.url} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", p: 2, display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
              {row.company} — {row.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fit {row.score} of 5 · {row.location} · {row.source}
            </Typography>
            {row.reasons.map((reason) => (
              <Typography key={reason} variant="body2" sx={{ mt: 0.5 }}>{reason}</Typography>
            ))}
            <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1.5, flexWrap: "wrap" }}>
              <Button variant="contained" onClick={() => prepare(row)}>Prepare documents</Button>
              <Button variant="outlined" onClick={() => enqueue(row)}>Add to queue</Button>
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
