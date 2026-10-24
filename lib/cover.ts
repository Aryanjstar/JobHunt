import type { JdAnalysis, Letter, Selection } from "./types";
import { contact } from "./profile";
import { unknownNumbers, forbiddenHits } from "./guard";

const OPENING: Record<Selection["family"], string> = {
  ai: "Many people can call a model. The hard part is making it do a real job, with tools, a memory of the conversation, and a person waiting.",
  voice:
    "A voicebot is not a prompt. It is a call that has to start, understand, use a tool, and end cleanly for someone who did not ask to talk to software.",
  backend:
    "The interesting bugs are the ones that only show up once the system is live, when the log is the only person who will tell you the truth.",
  fullstack:
    "The gap I like closing is the one between a workflow people already have and software they will actually open tomorrow.",
  frontend:
    "An interface earns trust when it is fast, obvious, and hard to break, and when the API behind it does not lie.",
  sde: "I want work where I can own a problem past the design, through the day it is live.",
};

function knownCompany(company: string): boolean {
  const cleaned = company.trim();
  return cleaned.length > 1 && !/^hiring team$/i.test(cleaned);
}

function teamName(company: string): string {
  const cleaned = company.trim();
  if (!knownCompany(cleaned)) return "Hiring Team";
  if (/team$/i.test(cleaned)) return cleaned;
  return `${cleaned} Hiring Team`;
}

export function roleLines(role: string): string[] {
  const words = role.trim().split(/\s+/).filter(Boolean).slice(0, 6);
  if (words.length === 0) return ["Software", "Engineer"];
  if (words.length === 1) return [words[0]];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function formatLetterDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = (parts.find((part) => part.type === "month")?.value ?? "").toUpperCase();
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${day} ${month} ${year}`;
}

function assetSentence(assets: string[], role: string, company: string): string {
  const [first, second, third] = assets;
  const lead = first.charAt(0).toUpperCase() + first.slice(1);
  const where = knownCompany(company)
    ? `the ${role} role at ${company.trim()}`
    : `this ${role} role`;
  return `${lead}, ${second}, and ${third} would make me a valuable asset for ${where}.`;
}

export function writeCover(input: {
  company: string;
  role: string;
  jdAnalysis: JdAnalysis;
  selection: Selection;
  angle?: string;
  date?: Date;
  sources: string[];
}): { letter: Letter; warnings: string[] } {
  const warnings: string[] = [];
  const company = input.company.trim();
  const role = input.role.trim() || "Software Engineer";
  const focus = input.jdAnalysis.focus
    ? ` That is what stood out in the ${role} opening at ${knownCompany(company) ? company : "this team"}: ${input.jdAnalysis.focus}.`
    : ` That is why I am writing about the ${role} opening${knownCompany(company) ? ` at ${company}` : ""}.`;

  let opening = `${OPENING[input.selection.family]}${focus}`;
  const angle = input.angle?.trim();
  if (angle) {
    const badNumbers = unknownNumbers(angle, input.sources);
    const badTools = forbiddenHits(angle);
    if (badNumbers.length > 0 || badTools.length > 0) {
      warnings.push(
        "Your angle mentioned something that is not in the profile, so the opening uses the job description instead.",
      );
    } else {
      opening = `${angle} ${focus.trim()}`;
    }
  }

  const identity =
    "I am a Forward Deployed Engineer at Exotel and a B.Tech Computer Science graduate of IIIT Dharwad.";
  const second = `${identity} ${input.selection.experienceLetter.letter}`;

  const projectSentences = input.selection.projects.map((project) => {
    const bullets = input.selection.projectBullets[project.id] ?? project.bullets;
    return bullets[0]?.letter ?? project.bullets[0].letter;
  });
  const third = projectSentences.join(" ");

  const fourth = `${input.selection.accomplishmentLetter.letter} I would be glad to bring that to ${
    knownCompany(company) ? company : "the team"
  }.`;

  const assets = [
    input.selection.experienceLetter.asset,
    input.selection.projects[1]?.bullets[0]?.asset ?? input.selection.projects[0].bullets[0].asset,
    input.selection.accomplishmentLetter.asset,
  ];
  const unique: string[] = [];
  for (const asset of assets) {
    if (!unique.includes(asset)) unique.push(asset);
  }
  while (unique.length < 3) {
    unique.push("the habit of staying on a system until it is live");
  }
  const fifth = assetSentence(unique.slice(0, 3), role, company);

  const team = teamName(company);
  return {
    warnings,
    letter: {
      date: formatLetterDate(input.date ?? new Date()),
      roleLines: roleLines(role),
      salutation: `Dear ${team},`,
      companyLine: knownCompany(company) ? company : "Hiring Team",
      teamLine: team,
      paragraphs: [opening, second, third, fourth, fifth],
    },
  };
}

export const sender = contact;
