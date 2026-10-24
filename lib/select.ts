import { mentions } from "./jd";
import {
  accomplishments,
  projects,
  roles,
  secondProjectCopy,
  skillLines,
} from "./profile";
import type { Accomplishment, Budget, Bullet, Family, JdAnalysis, Project, Selection } from "./types";

export const DEFAULT_BUDGET: Budget = {
  internBullets: 4,
  accomplishments: 5,
  projectBullets: 2,
};

export const TIGHTER_BUDGETS: Budget[] = [
  { internBullets: 4, accomplishments: 4, projectBullets: 2 },
  { internBullets: 3, accomplishments: 4, projectBullets: 2 },
  { internBullets: 3, accomplishments: 3, projectBullets: 2 },
  { internBullets: 2, accomplishments: 3, projectBullets: 2 },
  { internBullets: 2, accomplishments: 3, projectBullets: 1 },
];

const letterLean: Record<string, Partial<Record<Family, number>>> = {
  "fde-clients": { voice: 6, sde: 2, fullstack: 3, backend: 1, ai: 1, frontend: 1 },
  "fde-autoloop": { ai: 6, voice: 3, sde: 1 },
  "intern-argus": { voice: 8, ai: 2 },
  "intern-bench": { voice: 6, ai: 4 },
  "intern-pipeline": { ai: 5, voice: 2 },
  "intern-nginx": { backend: 6, sde: 3 },
};

function scoreBullet(bullet: Bullet, analysis: JdAnalysis, jd: string): number {
  const hay = `${bullet.plain} ${bullet.keywords.join(" ")}`.toLowerCase();
  let score = 0;
  for (const term of analysis.matched) {
    if (hay.includes(term.toLowerCase())) score += 3;
  }
  for (const keyword of bullet.keywords) {
    if (jd.toLowerCase().includes(keyword.toLowerCase())) score += 2;
  }
  return score;
}

function letterScore(bullet: Bullet, analysis: JdAnalysis, jd: string): number {
  let score = letterLean[bullet.id]?.[analysis.family] ?? 0;
  for (const keyword of bullet.keywords) {
    if (jd.toLowerCase().includes(keyword.toLowerCase())) score += 3;
  }
  return score;
}

function take<T extends { id: string }>(
  items: T[],
  score: (item: T) => number,
  cap: number,
): T[] {
  const ranked = items
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const chosen = new Set(ranked.slice(0, cap).map((row) => row.item.id));
  return items.filter((item) => chosen.has(item.id));
}

function scoreProject(project: Project, analysis: JdAnalysis, jd: string): number {
  let score = project.lean[analysis.family] ?? 0;
  const hay = `${project.name} ${project.stack} ${project.keywords.join(" ")} ${project.bullets
    .map((bullet) => bullet.plain)
    .join(" ")}`.toLowerCase();
  for (const term of analysis.matched) {
    if (hay.includes(term.toLowerCase())) score += 3;
  }
  for (const keyword of project.keywords) {
    if (jd.toLowerCase().includes(keyword.toLowerCase())) score += 2;
  }
  if (
    project.id === "navigator" &&
    /career|interview prep|job seeker|student/.test(jd.toLowerCase())
  ) {
    score += 8;
  }
  if (
    project.id === "devtinder" &&
    /mern|razorpay|real-?time chat|oauth/.test(jd.toLowerCase())
  ) {
    score += 6;
  }
  if (project.id === "digit" && /fnol|bolna|claims/.test(jd.toLowerCase())) score += 8;
  if (project.id === "null" && /hacker house|transaction desk|unlimited approval/.test(jd.toLowerCase())) {
    score += 8;
  }
  return score;
}

function scoreAccomplishment(item: Accomplishment, analysis: JdAnalysis, jd: string): number {
  const hay = `${item.plain} ${item.keywords.join(" ")}`.toLowerCase();
  let score = item.base;
  for (const term of analysis.matched) {
    if (hay.includes(term.toLowerCase())) score += 2;
  }
  for (const keyword of item.keywords) {
    if (jd.toLowerCase().includes(keyword.toLowerCase())) score += 3;
  }
  if (analysis.family === "ai" && item.id === "comsnets") score += 1;
  return score;
}

export function orderSkills(jd: string): { label: string; tokens: string[] }[] {
  return skillLines.map((line) => {
    const flex = [...line.flex];
    for (const extra of line.extra) {
      if (mentions(jd, extra)) flex.push(extra);
    }
    const mentioned: string[] = [];
    const rest: string[] = [];
    for (const token of flex) {
      if (mentions(jd, token)) mentioned.push(token);
      else rest.push(token);
    }
    return { label: line.label, tokens: [...line.fixed, ...mentioned, ...rest] };
  });
}

export function select(
  jd: string,
  analysis: JdAnalysis,
  budget: Budget = DEFAULT_BUDGET,
  pinned: string[] = [],
): Selection {
  const fdeRole = roles[0];
  const internRole = roles[1];
  const fde = take(fdeRole.bullets, (bullet) => scoreBullet(bullet, analysis, jd), 2);
  const intern = take(
    internRole.bullets,
    (bullet) => scoreBullet(bullet, analysis, jd),
    budget.internBullets,
  );
  const resumeProjects = projects.filter((project) => project.onResume);
  const pinnedProjects = pinned
    .map((id) => resumeProjects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project))
    .slice(0, 2);
  const aura = resumeProjects.find((project) => project.id === "aura");
  if (!aura) throw new Error("AURA is missing from the profile.");
  const ranked = [...resumeProjects]
    .filter((project) => project.id !== "aura")
    .sort((a, b) => scoreProject(b, analysis, jd) - scoreProject(a, analysis, jd));
  const chosen =
    pinnedProjects.length === 2
      ? pinnedProjects
      : pinnedProjects.length === 1
        ? [pinnedProjects[0], ranked.find((project) => project.id !== pinnedProjects[0].id) ?? aura]
        : [aura, ranked[0]];
  const second = chosen[1] ?? chosen[0];
  const projectBullets: Record<string, Bullet[]> = {};
  for (const project of chosen) {
    projectBullets[project.id] = take(
      project.bullets,
      (bullet) => scoreBullet(bullet, analysis, jd),
      budget.projectBullets,
    );
  }
  const picked = take(
    accomplishments,
    (item) => scoreAccomplishment(item, analysis, jd),
    budget.accomplishments,
  );
  const experiencePool = [...fde, ...intern];
  const experienceLetter = [...experiencePool].sort(
    (a, b) => letterScore(b, analysis, jd) - letterScore(a, analysis, jd),
  )[0];
  const rankedAccomplishments = [...picked].sort(
    (a, b) => scoreAccomplishment(b, analysis, jd) - scoreAccomplishment(a, analysis, jd),
  );
  const projectNames = chosen.map((project) => project.name.split("–")[0].trim().toLowerCase());
  const accomplishmentLetter =
    rankedAccomplishments.find(
      (item) => !projectNames.some((name) => name.length > 3 && item.plain.toLowerCase().includes(name)),
    ) ?? rankedAccomplishments[0];

  return {
    family: analysis.family,
    fde,
    intern,
    projects: chosen,
    projectBullets,
    accomplishments: picked,
    skills: orderSkills(jd),
    secondProjectReason:
      pinnedProjects.length === 2
        ? "You pinned these two projects. The description does not replace that choice."
        : (secondProjectCopy[second.id] ?? "AURA stays in the first slot."),
    experienceLetter,
    accomplishmentLetter,
  };
}

export function familyLabel(family: Family): string {
  switch (family) {
    case "ai":
      return "AI engineering";
    case "voice":
      return "voice systems";
    case "backend":
      return "backend engineering";
    case "fullstack":
      return "full-stack product work";
    case "frontend":
      return "interface work";
    default:
      return "software engineering";
  }
}
