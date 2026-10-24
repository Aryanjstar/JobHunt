import { describe, expect, it } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import { fallbackPdf, texToPlain } from "../lib/pdf-fallback";
import { buildPacket } from "../lib/pipeline";
import { samples } from "../lib/samples";

async function textOf(pdf: Buffer): Promise<{ pages: number; text: string }> {
  const doc = await getDocumentProxy(new Uint8Array(pdf));
  const extracted = await extractText(doc, { mergePages: true });
  const text = Array.isArray(extracted.text) ? extracted.text.join("\n") : extracted.text;
  return { pages: extracted.totalPages, text };
}

describe("pdf fallback", () => {
  it("draws a one-page resume and letter from the same TeX", async () => {
    const sample = samples.find((item) => item.id === "ai")!;
    const packet = buildPacket({
      jd: sample.jd,
      company: sample.company,
      role: sample.role,
      wantResume: true,
      wantCover: true,
      date: new Date("2026-10-25T08:00:00+05:30"),
    });
    expect(texToPlain(packet.resumeTex!)).toMatch(/Aryan Jaiswal/);
    expect(texToPlain(packet.coverTex!)).toMatch(/valuable asset/);
    const resume = await textOf(await fallbackPdf(packet.resumeTex!));
    const letter = await textOf(await fallbackPdf(packet.coverTex!));
    expect(resume.pages).toBe(1);
    expect(letter.pages).toBe(1);
    expect(resume.text).toMatch(/Aryan/);
    expect(resume.text).toMatch(/AURA/);
    expect(letter.text).toMatch(/Northstar/);
    expect(letter.text).toMatch(/valuable asset/);
  });
});