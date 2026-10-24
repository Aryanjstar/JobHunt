import { describe, expect, it } from "vitest";
import { acceptPolish, unknownNumbers } from "../lib/guard";
import { buildPacket } from "../lib/pipeline";
import { samples } from "../lib/samples";
import { select } from "../lib/select";
import { resumeTex } from "../lib/latex";

const fixed = new Date("2026-10-25T08:00:00+05:30");

function packetFor(id: string, extra: { wantResume?: boolean; wantCover?: boolean; angle?: string } = {}) {
  const sample = samples.find((item) => item.id === id);
  if (!sample) throw new Error(id);
  return buildPacket({
    jd: sample.jd,
    company: sample.company,
    role: sample.role,
    wantResume: extra.wantResume ?? true,
    wantCover: extra.wantCover ?? true,
    angle: extra.angle,
    date: fixed,
  });
}

describe("tailoring across roles", () => {
  it("keeps Myriox for an AI engineer description and writes the letter shape", () => {
    const packet = packetFor("ai");
    expect(packet.selection.projects.map((project) => project.id)).toEqual(["aura", "myriox"]);
    expect(packet.analysis.score).toBeGreaterThanOrEqual(4);
    expect(packet.analysis.blockers).toHaveLength(0);
    expect(packet.letter?.paragraphs).toHaveLength(5);
    expect(packet.letter?.paragraphs[4]).toMatch(/would make me a valuable asset/);
    expect(packet.letter?.paragraphs[0]).toMatch(/Northstar/);
    expect(packet.letter?.paragraphs[0]).toMatch(/RAG, agents, and Azure/);
    expect(packet.coverPlain).toMatch(/80\+|COMSNETS|Pablo Veramendi|MSA Nexus/);
    expect(packet.coverPlain).not.toMatch(/57,000/);
    expect(packet.coverPlain).toMatch(/AURA/);
    expect(packet.coverPlain).toMatch(/Myriox/);
    expect(packet.coverPlain).not.toMatch(/final-year/i);
    expect(packet.resumePlain).toMatch(/Myriox/);
    expect(packet.resumePlain).not.toMatch(/Wedding Home/);
    expect(unknownNumbers(packet.coverPlain ?? "", packet.sources)).toEqual([]);
  });

  it("uses The Wedding Home for a full-stack product description", () => {
    const packet = packetFor("fullstack");
    expect(packet.selection.projects.map((project) => project.id)).toEqual(["aura", "wedding-home"]);
    expect(packet.selection.secondProjectReason).toMatch(/Wedding Home/);
    expect(packet.resumePlain).toMatch(/22 original music pieces/);
    expect(packet.coverPlain).toMatch(/Exotel/);
    expect(packet.coverPlain).not.toMatch(/NGINX WebSocket tier/);
    expect(packet.coverPlain).toMatch(/would make me a valuable asset/);
    expect(unknownNumbers(packet.coverPlain ?? "", packet.sources)).toEqual([]);
  });

  it("leads the voice letter with a voicebot fact", () => {
    const packet = packetFor("voice");
    expect(packet.selection.family).toBe("voice");
    expect(packet.coverPlain).toMatch(/Argus|voicebot/);
    expect(packet.selection.projects[1]?.id).toBe("myriox");
    const trimmed = select(samples.find((item) => item.id === "voice")!.jd, packet.analysis, {
      internBullets: 2,
      accomplishments: 4,
      projectBullets: 2,
    });
    expect(trimmed.intern.map((bullet) => bullet.id)).not.toContain("intern-nginx");
    expect(trimmed.intern.map((bullet) => bullet.id)).toContain("intern-argus");
  });

  it("flags a staff role that asks for a decade and does not claim the missing tools", () => {
    const packet = packetFor("staff");
    expect(packet.analysis.blockers.length).toBeGreaterThan(0);
    expect(packet.analysis.score).toBeLessThanOrEqual(2);
    expect(packet.analysis.gaps).toEqual(expect.arrayContaining(["Kafka", "Rust"]));
    expect(packet.resumePlain?.toLowerCase()).not.toMatch(/\bkafka\b|\brust\b/);
    expect(packet.coverPlain?.toLowerCase()).not.toMatch(/\bkafka\b|\brust\b/);
  });

  it("mirrors Java and Next.js without adding tools he does not have", () => {
    const backend = packetFor("sde");
    const languages = backend.selection.skills[0].tokens;
    expect(languages.indexOf("Java")).toBeLessThan(languages.indexOf("Python"));
    expect(backend.analysis.gaps).toContain("Kafka");
    expect(backend.resumePlain).not.toMatch(/Kafka/);

    const frontend = packetFor("frontend");
    expect(frontend.selection.projects[1]?.id).toBe("portfolio");
    const line = frontend.selection.skills.find((item) => item.label === "Frontend");
    expect(line?.tokens.indexOf("Next.js")).toBeGreaterThan(-1);
    expect(line!.tokens.indexOf("Next.js")).toBeLessThan(line!.tokens.indexOf("HTML"));
  });

  it("picks the career project, the MTS project, and the MERN project differently", () => {
    expect(packetFor("career").selection.projects[1]?.id).toBe("navigator");
    expect(packetFor("mts").selection.projects[1]?.id).toBe("myriox");
    expect(packetFor("mern").selection.projects[1]?.id).toBe("devtinder");
  });

  it("keeps bank-only work out of every sample", () => {
    for (const sample of samples) {
      const packet = packetFor(sample.id);
      const text = `${packet.resumePlain}\n${packet.coverPlain}`;
      expect(text).not.toMatch(/Joveo|Pawse|VaaniGram|60,000|Null Protocol/);
      expect(packet.resumeTex).not.toMatch(/glyphtounicode/);
      expect(unknownNumbers(packet.coverPlain ?? "", packet.sources)).toEqual([]);
    }
  });

  it("escapes a company ampersand and can skip the letter", () => {
    const packet = buildPacket({
      jd: samples[0].jd,
      company: "AT&T",
      role: "AI Engineer",
      wantResume: true,
      wantCover: true,
      date: fixed,
    });
    expect(packet.coverTex).toContain("AT\\&T");
    expect(packet.coverPlain).toContain("AT&T");
    const resumeOnly = buildPacket({
      jd: samples[0].jd,
      company: "Northstar",
      role: "AI Engineer",
      wantResume: true,
      wantCover: false,
      date: fixed,
    });
    expect(resumeOnly.coverTex).toBeNull();
    expect(resumeOnly.resumeTex).toMatch(/Aryan Jaiswal/);
  });

  it("drops an angle that invents a metric", () => {
    const packet = packetFor("ai", { angle: "I scaled a platform to 12 million users last year." });
    expect(packet.warnings.join(" ")).toMatch(/angle/i);
    expect(packet.coverPlain).not.toMatch(/12 million/);
  });

  it("rejects a polished letter that adds 40 percent", () => {
    const packet = packetFor("ai");
    const polished = [...(packet.letter?.paragraphs ?? [])];
    polished[2] = `${polished[2]} I also cut alert noise by 40%.`;
    const accepted = acceptPolish(packet.letter!.paragraphs, polished, packet.sources, ["Northstar", "AURA", "Myriox"]);
    expect(accepted.warning).toMatch(/40%/);
    expect(accepted.paragraphs.join(" ")).not.toMatch(/40%/);
  });

  it("renders resume source from canonical bullets only", () => {
    const packet = packetFor("ai");
    const tex = resumeTex(packet.selection);
    for (const bullet of [...packet.selection.fde, ...packet.selection.intern]) {
      expect(tex).toContain(bullet.latex);
    }
  });
});
