import { describe, expect, it } from "vitest";
import { compileTex, pageCount, pageFill } from "../lib/pdf";
import { analyzeJd } from "../lib/jd";
import { DEFAULT_BUDGET, select } from "../lib/select";
import { resumeTex } from "../lib/latex";
import { preferences } from "../lib/profile";

/**
 * Locks the resume to the exact wording, action verbs, and metrics in
 * Aryan's canonical Overleaf source (Aryan_Jaiswal_Resume.tex). If one of
 * these checks fails, the content drifted from what he actually wrote --
 * fix the profile data, not this test.
 */
describe("the resume stays on the canonical AURA + Myriox wording", () => {
  const jd = `${preferences.roles.join(", ")} in ${preferences.location}. Python, TypeScript, Next.js, React, FastAPI, Node.js, Azure, LangGraph.`;
  const analysis = analyzeJd(jd, preferences.roles[0]);
  const selection = select(jd, analysis, DEFAULT_BUDGET, ["aura", "myriox"]);
  const tex = resumeTex(selection);

  it("keeps the Myriox bullets word-for-word", () => {
    expect(tex).toMatch(/site-plan stress-testing platform/);
    expect(tex).toMatch(/simulate \\textbf\{five personas\}/);
    expect(tex).toMatch(/RAG-backed\} ADA\/IFC auditor/);
    expect(tex).toMatch(/deployed \\textbf\{4 Azure Container Apps\}/);
  });

  it("lists Azure OpenAI in the Myriox stack line", () => {
    expect(tex).toMatch(/Myriox[\s\S]{0,200}Azure OpenAI/);
  });

  it("never reintroduces the retired AI-900 claim", () => {
    expect(tex).not.toMatch(/AI-900/);
  });

  it("keeps every action verb in the selected content unique", () => {
    const bullets = [
      ...selection.fde.map((bullet) => bullet.plain),
      ...selection.intern.map((bullet) => bullet.plain),
      ...selection.projects.flatMap((project) => selection.projectBullets[project.id]?.map((b) => b.plain) ?? []),
    ];
    const verbs = bullets.map((bullet) => bullet.split(/\s+/)[0]);
    expect(new Set(verbs).size).toBe(verbs.length);
  });

  it("compiles to exactly one page", async () => {
    const compiled = await compileTex(tex);
    expect(pageCount(compiled.pdf)).toBeLessThanOrEqual(1);
    const fill = await pageFill(compiled.pdf);
    expect(fill).toBeGreaterThan(0);
  });
});
