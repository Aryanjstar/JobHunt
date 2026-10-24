import { mkdirSync, writeFileSync } from "node:fs";
import { renderDocuments } from "../lib/render";
import { samples } from "../lib/samples";

const sample = samples.find((item) => item.id === "ai");
if (!sample) throw new Error("missing sample");
const rendered = await renderDocuments({
  jd: sample.jd,
  company: sample.company,
  role: sample.role,
  wantResume: true,
  wantCover: true,
  date: new Date("2026-10-25T08:00:00+05:30"),
});
mkdirSync("out", { recursive: true });
writeFileSync("out/Aryan_Jaiswal_resume.tex", rendered.packet.resumeTex ?? "");
writeFileSync("out/Aryan_Jaiswal_cover_letter.tex", rendered.packet.coverTex ?? "");
writeFileSync("out/Aryan_Jaiswal_resume.pdf", rendered.resumePdf!);
writeFileSync("out/Aryan_Jaiswal_cover_letter.pdf", rendered.coverPdf!);
console.log("resume_pages", rendered.resumePages, "letter_pages", rendered.coverPages);
console.log(rendered.packet.selection.projects.map((project) => project.name).join(" + "));
