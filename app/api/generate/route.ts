import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { renderDocuments } from "@/lib/render";
import { addApplication } from "@/lib/store";

export const runtime = "nodejs";

const schema = z.object({
  jd: z.string().min(40).max(20000),
  company: z.string().max(80).optional(),
  role: z.string().max(80).optional(),
  wantResume: z.boolean(),
  wantCover: z.boolean(),
  angle: z.string().max(500).optional(),
  polish: z.boolean().optional(),
  projectIds: z.array(z.string()).max(2).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paste a job description of at least a few lines." }, { status: 400 });
  }
  const body = parsed.data;
  if (!body.wantResume && !body.wantCover) {
    return NextResponse.json({ error: "Choose a resume, a cover letter, or both." }, { status: 400 });
  }

  const company = body.company?.trim() || "Hiring Team";
  const role = body.role?.trim() || "Software Engineer";
  const rendered = await renderDocuments({
    jd: body.jd,
    company,
    role,
    wantResume: body.wantResume,
    wantCover: body.wantCover,
    angle: body.angle,
    polish: body.polish,
    pinned: body.projectIds,
  });
  const { packet } = rendered;
  const id = randomUUID();
  await addApplication({
    id,
    createdAt: new Date().toISOString(),
    company,
    role,
    fit: packet.analysis.score,
    secondProject: packet.selection.projects[1]?.name ?? packet.selection.projects[0].name,
    status: "prepared",
    jdExcerpt: body.jd.replace(/\s+/g, " ").slice(0, 280),
    warnings: packet.warnings,
    resumeTex: packet.resumeTex,
    coverTex: packet.coverTex,
  });

  return NextResponse.json({
    id,
    fit: packet.analysis,
    secondProject: packet.selection.projects[1]?.name ?? "",
    secondProjectReason: packet.selection.secondProjectReason,
    warnings: packet.warnings,
    resume: packet.resumeTex
      ? {
          plain: packet.resumePlain,
          tex: packet.resumeTex,
          pdfBase64: rendered.resumePdf ? rendered.resumePdf.toString("base64") : null,
          pages: rendered.resumePages,
          projects: packet.selection.projects.map((project) => ({
            name: project.name,
            stack: project.stack,
            bullets: (packet.selection.projectBullets[project.id] ?? []).map((bullet) => bullet.plain),
          })),
          experience: [
            {
              company: "Exotel",
              title: "Forward Deployed Engineer",
              dates: "Jun 2026 – Present",
              bullets: packet.selection.fde.map((bullet) => bullet.plain),
            },
            {
              company: "Exotel",
              title: "Tech Intern | GenAI",
              dates: "Oct 2025 – June 2026",
              bullets: packet.selection.intern.map((bullet) => bullet.plain),
            },
          ],
          skills: packet.selection.skills,
          accomplishments: packet.selection.accomplishments.map((item) => item.plain),
        }
      : null,
    cover: packet.letter
      ? {
          paragraphs: packet.letter.paragraphs,
          salutation: packet.letter.salutation,
          date: packet.letter.date,
          roleLines: packet.letter.roleLines,
          tex: packet.coverTex,
          pdfBase64: rendered.coverPdf ? rendered.coverPdf.toString("base64") : null,
          pages: rendered.coverPages,
        }
      : null,
  });
}
