import { describe, expect, it } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import { renderDocuments } from "../lib/render";
import { samples } from "../lib/samples";

async function textOf(pdf: Buffer): Promise<{ pages: number; text: string }> {
  const doc = await getDocumentProxy(new Uint8Array(pdf));
  const extracted = await extractText(doc, { mergePages: true });
  return { pages: extracted.totalPages, text: extracted.text };
}

describe("one-page PDFs", () => {
  it("compiles an AI resume and letter that a parser can read", async () => {
    const sample = samples.find((item) => item.id === "ai")!;
    const rendered = await renderDocuments({
      jd: sample.jd,
      company: sample.company,
      role: sample.role,
      wantResume: true,
      wantCover: true,
      date: new Date("2026-10-25T08:00:00+05:30"),
    });
    expect(rendered.resumePdf).toBeTruthy();
    expect(rendered.coverPdf).toBeTruthy();
    const resume = await textOf(rendered.resumePdf!);
    const letter = await textOf(rendered.coverPdf!);
    expect(resume.pages).toBe(1);
    expect(resume.text).toMatch(/Aryan/);
    expect(resume.text).toMatch(/Myriox/);
    expect(resume.text).toMatch(/AURA/);
    expect(letter.pages).toBe(1);
    expect(letter.text).toMatch(/valuable asset/);
    expect(letter.text).toMatch(/Northstar/);
  }, 180_000);

  it("compiles the product resume onto one page with The Wedding Home", async () => {
    const sample = samples.find((item) => item.id === "fullstack")!;
    const rendered = await renderDocuments({
      jd: sample.jd,
      company: sample.company,
      role: sample.role,
      wantResume: true,
      wantCover: false,
      date: new Date("2026-10-25T08:00:00+05:30"),
    });
    const resume = await textOf(rendered.resumePdf!);
    expect(resume.pages).toBe(1);
    expect(resume.text).toMatch(/Wedding Home/);
  }, 180_000);
});
