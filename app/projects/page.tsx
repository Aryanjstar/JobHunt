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

  function pin(id: string) {
    setPinned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: 42, mb: 1 }}>Projects</Typography>
      <Typography sx={{ maxWidth: 640, mb: 3, color: "text.secondary" }}>
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
        <Button component={NextLink} href="/studio" variant="contained" disabled={pinned.length !== 2}>
          Tailor with these
        </Button>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
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
              <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
                {project.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>{project.stack}</Typography>
              {project.bullets.map((bullet) => (
                <Typography key={bullet.id} variant="body2" sx={{ mb: 0.75 }}>{bullet.plain}</Typography>
              ))}
              {project.note && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.75 }}>{project.note}</Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
