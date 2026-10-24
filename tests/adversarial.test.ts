import { describe, expect, it } from "vitest";
import { listingAllowed, readPosting, stripHtml } from "../lib/jobs";
import { buildPacket } from "../lib/pipeline";
import { samples } from "../lib/samples";
import { select } from "../lib/select";
import { analyzeJd } from "../lib/jd";

const fixed = new Date("2026-10-25T08:00:00+05:30");
const jd = samples[0].jd;

function make(extra: Record<string, unknown> = {}) {
  return buildPacket({
    jd,
    company: "Northstar",
    role: "AI Engineer",
    wantResume: true,
    wantCover: true,
    date: fixed,
    ...extra,
  });
}

describe("hostile input", () => {
  it("escapes latex and markup in the company and the role", () => {
    const packet = make({ company: "AT&T \\input{evil} <script>", role: "AI_Engineer #1" });
    expect(packet.coverTex).toContain("AT\\&T");
    expect(packet.coverTex).toContain("textbackslash");
    expect(packet.coverTex).not.toContain("\\input{evil}");
    expect(packet.coverPlain).toContain("AT&T");
  });

  it("drops an angle that names a tool or a number he does not have", () => {
    const kafka = make({ angle: "I have run Kafka in production for years." });
    expect(kafka.warnings.join(" ")).toMatch(/angle/i);
    expect(kafka.coverPlain?.toLowerCase()).not.toMatch(/\bkafka\b/);

    const years = make({ angle: "I have 12 years of staff experience." });
    expect(years.coverPlain).not.toMatch(/12 years/);
  });

  it("ignores unknown pins, duplicate pins, and a single pin", () => {
    const analysis = analyzeJd(jd, "AI Engineer");
    const unknown = select(jd, analysis, undefined, ["not-a-project", "also-no"]);
    expect(unknown.projects.map((project) => project.id)).toEqual(["aura", "myriox"]);

    const duplicate = select(jd, analysis, undefined, ["aura", "aura"]);
    expect(duplicate.projects.map((project) => project.id)).toEqual(["aura", "myriox"]);
    expect(new Set(duplicate.projects.map((project) => project.id)).size).toBe(2);

    const one = select(jd, analysis, undefined, ["wedding-home"]);
    expect(one.projects).toHaveLength(2);
    expect(one.projects[0].id).toBe("wedding-home");
    expect(one.projects[1].id).not.toBe("wedding-home");
  });

  it("survives a huge description and a symbolic role", () => {
    const huge = make({ jd: `${jd}\n${"python azure rag ".repeat(800)}`, role: "@@@ ###" });
    expect(huge.letter?.paragraphs).toHaveLength(5);
    expect(huge.coverPlain).toMatch(/would make me a valuable asset/);
    expect(huge.resumeTex?.length).toBeGreaterThan(500);
  });

  it("filters board titles and strips html", () => {
    expect(listingAllowed("AI Engineer", "Remote")).toBe(true);
    expect(listingAllowed("Software Engineer", "Remote, Global")).toBe(true);
    expect(listingAllowed("Software Engineer", "Remote, Canada")).toBe(false);
    expect(listingAllowed("Software Engineer", "Remote, Poland")).toBe(false);
    expect(listingAllowed("Software Engineer", "Bengaluru, India")).toBe(true);
    expect(listingAllowed("Staff Software Engineer", "Remote")).toBe(false);
    expect(listingAllowed("Software Engineer Intern", "Remote")).toBe(false);
    expect(listingAllowed("Engineering Manager", "Remote")).toBe(false);
    expect(listingAllowed("Backend Technical Lead", "Noida")).toBe(false);
    expect(listingAllowed("Software Engineer", "Hyderabad")).toBe(true);
    expect(listingAllowed("Software Engineer", "Pune, India")).toBe(true);
    expect(listingAllowed("Software Engineer", "Hybrid")).toBe(false);
    expect(listingAllowed("Software Engineer", "Hybrid in Bangalore, India")).toBe(true);
    expect(listingAllowed("Software Engineer", "Redwood City, CA (Hybrid)")).toBe(false);
    expect(listingAllowed("Software Engineer", "Hybrid - San Francisco")).toBe(false);
    expect(listingAllowed("Software Engineer", "San Francisco")).toBe(false);
    expect(listingAllowed("Designer", "Remote")).toBe(false);
    expect(stripHtml("<p>Kafka &amp; Rust</p><script>alert(1)</script>")).toBe("Kafka & Rust alert(1)");
  });

  it("refuses a linkedin link before any fetch", async () => {
    expect(await readPosting("https://www.linkedin.com/jobs/view/123")).toBeNull();
    expect(await readPosting("https://www.naukri.com/job-listings-1")).toBeNull();
    expect(await readPosting("not a url")).toBeNull();
  });
});
