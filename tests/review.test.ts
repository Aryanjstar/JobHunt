import { describe, expect, it } from "vitest";
import { interviewCues } from "../lib/cues";
import { factTrace } from "../lib/guard";
import { analyzeJd } from "../lib/jd";
import { fallbackPdf } from "../lib/pdf-fallback";
import { pageFill } from "../lib/pdf";
import { parseQueue } from "../lib/queue";
import { buildPacket } from "../lib/pipeline";
import { samples } from "../lib/samples";

describe("fact check, page fill, and the queue", () => {
  it("keeps a number that is in the profile and flags one that is not", () => {
    const known = factTrace("The pipeline cut tuning by 75%.", ["The pipeline cut tuning by 75%."]);
    expect(known.unknown).toEqual([]);
    expect(known.used.join(" ")).toMatch(/75/);
    const invented = factTrace("The pipeline cut tuning by 99%.", ["The pipeline cut tuning by 75%."]);
    expect(invented.unknown.join(" ")).toMatch(/99/);
  });

  it("tells him not to claim a tool that is absent", () => {
    const sample = samples.find((item) => item.id === "staff")!;
    const packet = buildPacket({
      jd: sample.jd,
      company: sample.company,
      role: sample.role,
      wantResume: true,
      wantCover: false,
    });
    const cues = interviewCues(packet.analysis, packet.selection);
    expect(cues.some((cue) => /not in the profile/i.test(cue))).toBe(true);
    expect(analyzeJd(sample.jd, sample.role).gaps).toContain("Kafka");
  });

  it("reports how far down a one-page PDF the text reaches", async () => {
    const sample = samples.find((item) => item.id === "ai")!;
    const packet = buildPacket({
      jd: sample.jd,
      company: sample.company,
      role: sample.role,
      wantResume: true,
      wantCover: false,
    });
    const fill = await pageFill(await fallbackPdf(packet.resumeTex!));
    expect(fill).toBeGreaterThan(40);
    expect(fill).toBeLessThanOrEqual(100);
  });

  it("keeps at most twelve real descriptions in the queue", () => {
    const raw = JSON.stringify([
      { company: "Groww", role: "SDE", jd: "x".repeat(50) },
      { company: "Nope", role: "SDE", jd: "short" },
      ...Array.from({ length: 14 }, (_, index) => ({
        company: "Desk",
        role: "SDE",
        jd: `Software engineer role number ${index} in Bengaluru using Python and Azure for production systems.`,
      })),
    ]);
    const queue = parseQueue(raw);
    expect(queue).toHaveLength(12);
    expect(queue.every((item) => item.jd.length >= 40)).toBe(true);
  });
});
