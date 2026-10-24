"use client";

import type { Selection } from "@/lib/types";

export type ResumePreview = {
  experience: { company: string; title: string; dates: string; bullets: string[] }[];
  projects: { name: string; stack: string; bullets: string[] }[];
  skills: { label: string; tokens: string[] }[];
  accomplishments: string[];
};

export function ResumeSheet({ resume }: { resume: ResumePreview }) {
  return (
    <article className="sheet">
      <header className="sheet-head">
        <h2>Aryan Jaiswal</h2>
        <p>Bengaluru, Karnataka</p>
        <p>aryanjstar3@gmail.com · aryanjaiswal.in · linkedin.com/in/aryanjstar</p>
      </header>
      <section>
        <h3>Work experience</h3>
        {resume.experience.map((job) => (
          <div key={job.title}>
            <p className="role-line">
              <strong>{job.company}</strong> — {job.title}
              <span>{job.dates}</span>
            </p>
            <ul>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>Projects</h3>
        {resume.projects.map((project) => (
          <div key={project.name}>
            <p className="role-line">
              <strong>{project.name}</strong>
              <span>{project.stack}</span>
            </p>
            <ul>
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>Technical skills</h3>
        {resume.skills.map((line) => (
          <p key={line.label}>
            <strong>{line.label}: </strong>
            {line.tokens.join(", ")}
          </p>
        ))}
      </section>
      <section>
        <h3>Accomplishments</h3>
        <ul>
          {resume.accomplishments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function LetterSheet({
  date,
  roleLines,
  salutation,
  paragraphs,
}: {
  date: string;
  roleLines: string[];
  salutation: string;
  paragraphs: string[];
}) {
  return (
    <article className="sheet letter">
      <header className="letter-top">
        <div>
          <div className="letter-name">ARYAN</div>
          <div className="letter-role">{roleLines.join(" ")}</div>
          <p>Aryan Jaiswal<br />Bengaluru, Karnataka<br />India</p>
        </div>
        <div>
          <div className="letter-rule" />
          <p className="letter-date">{date}</p>
          <p>{salutation}</p>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p>Thank you for your consideration.</p>
          <p>Sincerely,<br />Aryan Jaiswal</p>
        </div>
      </header>
    </article>
  );
}

export function selectionPreview(selection: Selection): ResumePreview {
  return {
    experience: [
      {
        company: "Exotel",
        title: "Forward Deployed Engineer",
        dates: "Jun 2026 – Present",
        bullets: selection.fde.map((bullet) => bullet.plain),
      },
      {
        company: "Exotel",
        title: "Tech Intern | GenAI",
        dates: "Oct 2025 – June 2026",
        bullets: selection.intern.map((bullet) => bullet.plain),
      },
    ],
    projects: selection.projects.map((project) => ({
      name: project.name,
      stack: project.stack,
      bullets: (selection.projectBullets[project.id] ?? []).map((bullet) => bullet.plain),
    })),
    skills: selection.skills,
    accomplishments: selection.accomplishments.map((item) => item.plain),
  };
}
