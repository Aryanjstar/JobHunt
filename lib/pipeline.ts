import { writeCover } from "./cover";
import { analyzeJd } from "./jd";
import { acceptPolish } from "./guard";
import { coverTex, resumePlain, resumeTex } from "./latex";
import { contact, education, roles } from "./profile";
import { DEFAULT_BUDGET, select } from "./select";
import type { Budget, JdAnalysis, Letter, Selection } from "./types";

export type Packet = {
  analysis: JdAnalysis;
  selection: Selection;
  letter: Letter | null;
  resumePlain: string | null;
  coverPlain: string | null;
  resumeTex: string | null;
  coverTex: string | null;
  warnings: string[];
  sources: string[];
};

export function coverSources(selection: Selection): string[] {
  const texts = [
    // The resume header always prints these, so the fact-check guard needs
    // them as allowed sources or it flags the candidate's own phone/email
    // as an unknown number on every single generation.
    contact.phone,
    contact.email,
    education.plain,
    ...roles.flatMap((role) => role.bullets.map((bullet) => bullet.plain)),
    ...selection.projects.flatMap((project) => project.bullets.map((bullet) => bullet.plain)),
    ...selection.accomplishments.map((item) => item.plain),
  ];
  return texts;
}

export function buildPacket(input: {
  jd: string;
  company: string;
  role: string;
  wantResume: boolean;
  wantCover: boolean;
  angle?: string;
  budget?: Budget;
  date?: Date;
  pinned?: string[];
}): Packet {
  const analysis = analyzeJd(input.jd, input.role);
  const selection = select(input.jd, analysis, input.budget ?? DEFAULT_BUDGET, input.pinned);
  const sources = coverSources(selection);
  const warnings: string[] = [];
  let letter: Letter | null = null;
  if (input.wantCover) {
    const written = writeCover({
      company: input.company,
      role: input.role,
      jdAnalysis: analysis,
      selection,
      angle: input.angle,
      date: input.date,
      sources,
    });
    letter = written.letter;
    warnings.push(...written.warnings);
  }
  return {
    analysis,
    selection,
    letter,
    resumePlain: input.wantResume ? resumePlain(selection) : null,
    coverPlain: letter ? letter.paragraphs.join("\n\n") : null,
    resumeTex: input.wantResume ? resumeTex(selection) : null,
    coverTex: letter ? coverTex(letter) : null,
    warnings,
    sources,
  };
}

export function withPolishedLetter(packet: Packet, polished: string[] | null, required: string[]): Packet {
  if (!packet.letter) return packet;
  const accepted = acceptPolish(packet.letter.paragraphs, polished, packet.sources, required);
  const letter = { ...packet.letter, paragraphs: accepted.paragraphs };
  const warnings = [...packet.warnings];
  if (accepted.warning) warnings.push(accepted.warning);
  return {
    ...packet,
    letter,
    coverPlain: letter.paragraphs.join("\n\n"),
    coverTex: coverTex(letter),
    warnings,
  };
}
