"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { projects } from "@/lib/profile";

const KEY = "desk-projects";

export default function ProjectsPage() {
  const choices = projects.filter((project) => project.onResume);
  const [pinned, setPinned] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) return;
    try {
      const ids = JSON.parse(saved) as string[];
      if (Array.isArray(ids)) setPinned(ids.slice(0, 2));
    } catch {
      /* start empty */
    }
  }, []);

  async function download() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: pinned }),
      });
      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !type.includes("pdf")) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "The PDF did not download.");
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "aryan-jaiswal-resume.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The PDF did not download.");
    } finally {
      setBusy(false);
    }
  }

  function pin(id: string) {
    setPinned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 46 }, mb: 1 }}>Projects</Typography>
      <Typography sx={{ maxWidth: 760, mb: 3, color: "text.secondary" }}>
        Click two. They are the only projects on the next resume. The first words are action verbs, and a verb already used in the experience section is not used again. A number appears only when it is already in the profile.
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {[0, 1].map((slot) => {
          const project = choices.find((item) => item.id === pinned[slot]);
          return (
            <Box key={slot} sx={{ border: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "background.paper" }}>
              Slot {slot + 1}: {project ? project.name : "Empty"}
            </Box>
          );
        })}
        <Button variant="contained" disabled={pinned.length !== 2 || busy} onClick={download}>
          {busy ? "Making the PDF…" : "Download resume"}
        </Button>
        <Button component={NextLink} href="/studio" variant="outlined" disabled={pinned.length !== 2}>
          Tailor with these
        </Button>
      </Box>
      {error && (
        <Typography sx={{ mb: 2, color: "secondary.main" }}>{error}</Typography>
      )}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }, gap: 1.5 }}>
        {choices.map((project) => {
          const on = pinned.includes(project.id);
          return (
            <Box
              key={project.id}
              component="button"
              onClick={() => pin(project.id)}
              sx={{
                textAlign: "left",
                cursor: "pointer",
                bgcolor: on ? "#24312c" : "background.paper",
                color: on ? "#efe6d6" : "text.primary",
                border: "1px solid",
                borderColor: on ? "#24312c" : "divider",
                p: 2,
              }}
            >
              <Typography component="span" sx={{ display: "block", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
                {project.name}
              </Typography>
              <Typography component="span" variant="body2" sx={{ display: "block", opacity: 0.8, mb: 1 }}>{project.stack}</Typography>
              {project.bullets.map((bullet) => (
                <Typography component="span" key={bullet.id} variant="body2" sx={{ display: "block", mb: 0.75 }}>{bullet.plain}</Typography>
              ))}
              {project.note && (
                <Typography component="span" variant="body2" sx={{ display: "block", mt: 1, opacity: 0.75 }}>{project.note}</Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
