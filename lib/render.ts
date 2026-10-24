import { analyzeJd } from "./jd";
import { polishCover } from "./llm";
import { resumeTex } from "./latex";
import { factTrace } from "./guard";
import { compileTex, pageFill } from "./pdf";
import { preferences } from "./profile";
import { buildPacket, withPolishedLetter, type Packet } from "./pipeline";
import { DEFAULT_BUDGET, select, TIGHTER_BUDGETS } from "./select";
import type { Budget } from "./types";

export type RenderInput = {
  jd: string;
  company: string;
  role: string;
  wantResume: boolean;
  wantCover: boolean;
  angle?: string;
  polish?: boolean;
  date?: Date;
  pinned?: string[];
};

export type Rendered = {
  packet: Packet;
  resumePdf: Buffer | null;
  coverPdf: Buffer | null;
  resumePages: number;
  coverPages: number;
  resumeFill: number | null;
  coverFill: number | null;
};

async function safeCompile(
  tex: string,
): Promise<{ pdf: Buffer | null; pages: number; engine?: "tectonic" | "fallback"; error?: string }> {
  try {
    const compiled = await compileTex(tex);
    return { pdf: compiled.pdf, pages: compiled.pages, engine: compiled.engine };
  } catch (error) {
    const message = error instanceof Error ? error.message : "TeX compile failed";
    return { pdf: null, pages: 0, error: message.split("\n")[0]?.slice(0, 240) };
  }
}

export async function renderDocuments(input: RenderInput): Promise<Rendered> {
  const budgets: Budget[] = [DEFAULT_BUDGET, ...TIGHTER_BUDGETS];
  let packet = buildPacket({ ...input, budget: budgets[0] });
  let resumePdf: Buffer | null = null;
  let resumePages = 0;

  if (input.wantResume) {
    for (const budget of budgets) {
      packet = buildPacket({ ...input, budget });
      if (!packet.resumeTex) break;
      const compiled = await safeCompile(packet.resumeTex);
      resumePdf = compiled.pdf;
      resumePages = compiled.pages;
      if (compiled.error) {
        packet = { ...packet, warnings: [...packet.warnings, `Resume PDF failed: ${compiled.error}`] };
        break;
      }
      if (compiled.engine === "fallback") {
        packet = {
          ...packet,
          warnings: [
            ...packet.warnings,
            "Tectonic did not produce a file, so this resume uses a simpler one-page layout. The words are the same.",
          ],
        };
      }
      if (resumePages > 0 && resumePages <= 1) break;
    }
    if (resumePdf && resumePages > 1) {
      packet = {
        ...packet,
        warnings: [
          ...packet.warnings,
          "The resume is still longer than one page after trimming. Read it before you send it.",
        ],
      };
    }
  }

  if (input.polish && packet.letter && packet.coverPlain) {
    const projectNames = packet.selection.projects.map((project) => project.name.split("–")[0].trim());
    const required = [input.company, input.role, ...projectNames].filter((item) => item.trim().length > 1);
    try {
      const polished = await polishCover({
        paragraphs: packet.letter.paragraphs,
        sources: packet.sources,
        company: input.company,
        role: input.role,
      });
      packet = withPolishedLetter(packet, polished, required);
    } catch {
      packet = {
        ...packet,
        warnings: [...packet.warnings, "GPT-4.1 did not answer, so the plain letter was kept."],
      };
    }
  }

  let resumeFill: number | null = null;
  if (resumePdf) resumeFill = await pageFill(resumePdf).catch(() => null);

  let coverPdf: Buffer | null = null;
  let coverPages = 0;
  if (packet.coverTex) {
    const compiled = await safeCompile(packet.coverTex);
    coverPdf = compiled.pdf;
    coverPages = compiled.pages;
    if (compiled.error) {
      packet = { ...packet, warnings: [...packet.warnings, `Cover letter PDF failed: ${compiled.error}`] };
    } else if (compiled.engine === "fallback") {
      packet = {
        ...packet,
        warnings: [
          ...packet.warnings,
          "Tectonic did not produce a file, so this letter uses a simpler one-page layout. The words are the same.",
        ],
      };
    } else if (coverPages > 1) {
      packet = {
        ...packet,
        warnings: [...packet.warnings, "The cover letter ran past one page. The words are still yours to cut."],
      };
    }
  }

  let coverFill: number | null = null;
  if (coverPdf) coverFill = await pageFill(coverPdf).catch(() => null);

  const traced = factTrace(
    [packet.resumePlain, packet.coverPlain].filter((part): part is string => Boolean(part)).join("\n"),
    packet.sources,
  );
  if (traced.unknown.length > 0) {
    packet = {
      ...packet,
      warnings: [
        ...packet.warnings,
        `Fact check found ${traced.unknown.join(", ")}, which is not in the profile. Read that line before you send it.`,
      ],
    };
  }

  return { packet, resumePdf, coverPdf, resumePages, coverPages, resumeFill, coverFill };
}

export async function pinnedResume(projectIds: string[]): Promise<Buffer> {
  const jd = `${preferences.roles.join(", ")} in ${preferences.location}. ${preferences.workMode} ${preferences.employment}. Python, TypeScript, Next.js, React, FastAPI, Node.js, Azure, LangGraph.`;
  const analysis = analyzeJd(jd, preferences.roles[0]);
  const selection = select(jd, analysis, DEFAULT_BUDGET, projectIds);
  const compiled = await compileTex(resumeTex(selection));
  return compiled.pdf;
}
