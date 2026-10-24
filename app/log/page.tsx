"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { STATUSES, type Status } from "@/lib/statuses";

type Row = {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  fit: number;
  secondProject: string;
  status: Status;
  jdExcerpt: string;
  hasResume: boolean;
  hasCover: boolean;
};

export default function LogPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/applications")
      .then((response) => response.json())
      .then((body: { applications: Row[] }) => setRows(body.applications ?? []))
      .catch(() => setRows([]));
  }, []);

  async function download(id: string, doc: "resume" | "cover", filename: string) {
    setError("");
    try {
      const response = await fetch(`/api/applications/${id}/pdf?doc=${doc}`);
      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !type.includes("pdf")) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "The PDF did not download.");
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The PDF did not download.");
    }
  }

  async function setStatus(id: string, status: Status) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 46 }, mb: 1 }}>Log</Typography>
      <Typography sx={{ mb: 3, color: "text.secondary", maxWidth: 760 }}>
        Each row is a set of documents you made. Status starts at prepared, which means nothing has been submitted. Change it when you actually apply.
      </Typography>
      {rows.length === 0 && (
        <Typography>No documents yet. They land here after you make a set in the studio.</Typography>
      )}
      {error && (
        <Typography sx={{ mb: 2, color: "secondary.main" }}>{error}</Typography>
      )}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" }, gap: 1.5 }}>
        {rows.map((row) => (
          <Box key={row.id} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
                  {row.company} — {row.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(row.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} · Fit {row.fit} of 5 · {row.secondProject}
                </Typography>
              </Box>
              <TextField
                select
                size="small"
                label="Status"
                value={row.status}
                onChange={(event) => setStatus(row.id, event.target.value as Status)}
                sx={{ minWidth: 160 }}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>{row.jdExcerpt}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
              {row.hasResume && (
                <Button size="small" variant="contained" onClick={() => download(row.id, "resume", "aryan-resume.pdf")}>
                  Resume PDF
                </Button>
              )}
              {row.hasCover && (
                <Button size="small" variant="outlined" onClick={() => download(row.id, "cover", "aryan-letter.pdf")}>
                  Letter PDF
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
