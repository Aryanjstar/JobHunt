"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { analyzeJd } from "@/lib/jd";
import { samples } from "@/lib/samples";
import { select } from "@/lib/select";
import { LetterSheet, ResumeSheet, selectionPreview, type ResumePreview } from "./Preview";

type Docs = "resume" | "cover";

type Generated = {
  id: string;
  warnings: string[];
  resume: (ResumePreview & { tex: string; pdfBase64: string | null; pages: number }) | null;
  cover: {
    paragraphs: string[];
    salutation: string;
    date: string;
    roleLines: string[];
    tex: string;
    pdfBase64: string | null;
    pages: number;
  } | null;
};

function saveBase64(filename: string, b64: string) {
  const bytes = Uint8Array.from(atob(b64), (char) => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function saveText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function fileSlug(company: string, role: string, kind: string) {
  const slug = `${company}-${role}-${kind}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `aryan-${slug || kind}`;
}

export function Studio() {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [angle, setAngle] = useState("");
  const [docs, setDocs] = useState<Docs[]>(["resume", "cover"]);
  const [polish, setPolish] = useState(false);
  const [llm, setLlm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"resume" | "cover">("resume");
  const [result, setResult] = useState<Generated | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((body: { llm?: boolean }) => setLlm(Boolean(body.llm)))
      .catch(() => setLlm(false));
  }, []);

  const live = useMemo(() => {
    if (jd.trim().length < 40) return null;
    const analysis = analyzeJd(jd, role || "Software Engineer");
    const selection = select(jd, analysis);
    return { analysis, selection };
  }, [jd, role]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/extract", { method: "POST", body });
      const payload = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !payload.text) {
        setError(payload.error || "That PDF did not yield text.");
        return;
      }
      setJd(payload.text);
      return;
    }
    setJd(await file.text());
  }

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd,
          company,
          role,
          wantResume: docs.includes("resume"),
          wantCover: docs.includes("cover"),
          angle,
          polish,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "The documents were not made.");
        return;
      }
      setResult({
        id: payload.id,
        warnings: payload.warnings ?? [],
        resume: payload.resume,
        cover: payload.cover,
      });
      setTab(payload.resume ? "resume" : "cover");
    } catch {
      setError("The request did not finish. If a PDF is compiling for the first time, try once more.");
    } finally {
      setBusy(false);
    }
  }

  const slugCompany = company || "company";
  const slugRole = role || "role";

  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 46 }, mb: 1 }}>
        Make the documents
      </Typography>
      <Typography sx={{ maxWidth: 640, mb: 3, color: "text.secondary" }}>
        Paste a job description. Desk picks from your profile, writes a one-page resume and a five-paragraph letter, and stops. You download the files and submit them yourself.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.8fr" }, gap: 2.5 }}>
        <Box>
          <TextField
            select
            fullWidth
            label="Try a description"
            value=""
            onChange={(event) => {
              const sample = samples.find((item) => item.id === event.target.value);
              if (!sample) return;
              setJd(sample.jd);
              setCompany(sample.company);
              setRole(sample.role);
              setResult(null);
            }}
            sx={{ mb: 1.5 }}
          >
            <MenuItem value="">Choose a sample</MenuItem>
            {samples.map((sample) => (
              <MenuItem key={sample.id} value={sample.id}>
                {sample.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Job description"
            value={jd}
            onChange={(event) => setJd(event.target.value)}
            multiline
            minRows={14}
            fullWidth
            placeholder="Paste the posting here."
            sx={{ "& textarea": { minHeight: 280 } }}
          />
          <Button component="label" sx={{ mt: 1 }} variant="text">
            Upload a text or PDF file
            <input
              hidden
              type="file"
              accept=".txt,.md,.pdf,text/plain,application/pdf"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField label="Company" value={company} onChange={(event) => setCompany(event.target.value)} />
          <TextField label="Role" value={role} onChange={(event) => setRole(event.target.value)} />
          <TextField
            label="Your angle, optional"
            value={angle}
            onChange={(event) => setAngle(event.target.value)}
            multiline
            minRows={3}
            helperText="One or two sentences in your voice. A number that is not in the profile is ignored."
          />
          <ToggleButtonGroup
            value={docs}
            onChange={(_event, value: Docs[]) => {
              if (value.length > 0) setDocs(value);
            }}
            aria-label="Documents"
          >
            <ToggleButton value="resume">Resume</ToggleButton>
            <ToggleButton value="cover">Cover letter</ToggleButton>
          </ToggleButtonGroup>
          {llm ? (
            <FormControlLabel
              control={<Checkbox checked={polish} onChange={(event) => setPolish(event.target.checked)} />}
              label="Tighten the letter with GPT-4.1. Facts that do not trace back are thrown out."
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              The letter is written from your profile. Add an Azure OpenAI key if you want GPT-4.1 to tighten the wording.
            </Typography>
          )}
          {live && (
            <Box sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper", p: 2 }}>
              <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22, mb: 1 }}>
                Fit {live.analysis.score} of 5
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }} aria-hidden>
                {[1, 2, 3, 4, 5].map((mark) => (
                  <Box
                    key={mark}
                    sx={{ width: 28, height: 6, bgcolor: mark <= live.analysis.score ? "#24312c" : "#e0d8cc" }}
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {live.selection.secondProjectReason}
              </Typography>
              {live.analysis.workMode && (
                <Typography variant="body2" color="text.secondary">
                  Work mode in the text: {live.analysis.workMode}.
                </Typography>
              )}
              {live.analysis.reasons.map((reason) => (
                <Typography key={reason} variant="body2" sx={{ mt: 0.75 }}>
                  {reason}
                </Typography>
              ))}
            </Box>
          )}
          <Button variant="contained" disabled={busy || jd.trim().length < 40} onClick={generate}>
            {busy ? "Making the documents…" : "Make the documents"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Nothing is submitted.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {result?.warnings.map((warning) => (
        <Alert key={warning} severity="warning" sx={{ mt: 1.5 }}>
          {warning}
        </Alert>
      ))}

      {result && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {result.resume && (
              <Button variant={tab === "resume" ? "contained" : "outlined"} onClick={() => setTab("resume")}>
                Read the resume
              </Button>
            )}
            {result.cover && (
              <Button variant={tab === "cover" ? "contained" : "outlined"} onClick={() => setTab("cover")}>
                Read the letter
              </Button>
            )}
            {result.resume?.pdfBase64 && (
              <Button variant="outlined" onClick={() => saveBase64(`${fileSlug(slugCompany, slugRole, "resume")}.pdf`, result.resume!.pdfBase64!)}>
                Resume PDF
              </Button>
            )}
            {result.resume && (
              <Button variant="outlined" onClick={() => saveText(`${fileSlug(slugCompany, slugRole, "resume")}.tex`, result.resume!.tex)}>
                Resume TeX
              </Button>
            )}
            {result.cover?.pdfBase64 && (
              <Button variant="outlined" onClick={() => saveBase64(`${fileSlug(slugCompany, slugRole, "letter")}.pdf`, result.cover!.pdfBase64!)}>
                Letter PDF
              </Button>
            )}
            {result.cover && (
              <Button variant="outlined" onClick={() => saveText(`${fileSlug(slugCompany, slugRole, "letter")}.tex`, result.cover!.tex)}>
                Letter TeX
              </Button>
            )}
          </Box>
          <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
            Read this before you send it. The PDF is the file to upload. This page is the same words, set for the screen.
          </Typography>
          {tab === "resume" && result.resume && <ResumeSheet resume={result.resume} />}
          {tab === "cover" && result.cover && <LetterSheet {...result.cover} />}
        </Box>
      )}

      {!result && live && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
            A preview of the selection. The PDF is made when you press the button.
          </Typography>
          <ResumeSheet resume={selectionPreview(live.selection)} />
        </Box>
      )}
    </Box>
  );
}
