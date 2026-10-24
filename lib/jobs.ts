import { analyzeJd } from "./jd";

type Board = { company: string; token: string };

/** Public Greenhouse boards that answered on 25 Oct 2026. No LinkedIn scraping. */
const BOARDS: Board[] = [
  { company: "Groww", token: "groww" },
  { company: "slice", token: "slice" },
  { company: "HackerRank", token: "hackerrank" },
  { company: "Discord", token: "discord" },
  { company: "Vercel", token: "vercel" },
  { company: "Figma", token: "figma" },
  { company: "Dropbox", token: "dropbox" },
  { company: "Anthropic", token: "anthropic" },
];

const TITLE =
  /\b(ai|machine learning|llm|full[- ]?stack|software engineer|software development|backend|member of technical staff|mts|sde)\b/i;
const SKIP = /\b(intern|senior|staff|principal|director|manager)\b/i;
const PLACE =
  /\b(india|bengaluru|bangalore|remote|hybrid|anywhere|worldwide|global)\b/i;

export type Opening = {
  company: string;
  title: string;
  location: string;
  url: string;
  score: number;
  reasons: string[];
  description: string;
};

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  content?: string;
};

export function listingAllowed(title: string, location: string): boolean {
  if (!TITLE.test(title) || SKIP.test(title)) return false;
  if (location && !PLACE.test(location)) return false;
  return true;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function listBoard(board: Board): Promise<GreenhouseJob[]> {
  const response = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs?content=false`,
    { headers: { "User-Agent": "desk" }, signal: AbortSignal.timeout(12_000) },
  );
  if (!response.ok) return [];
  const body = (await response.json()) as { jobs?: GreenhouseJob[] };
  return body.jobs ?? [];
}

async function readJob(board: Board, id: number): Promise<string> {
  const response = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs/${id}`,
    { headers: { "User-Agent": "desk" }, signal: AbortSignal.timeout(12_000) },
  );
  if (!response.ok) return "";
  const body = (await response.json()) as { content?: string };
  return stripHtml(body.content ?? "").slice(0, 6000);
}

export async function findOpenings(): Promise<Opening[]> {
  const listed = await Promise.all(
    BOARDS.map(async (board) => ({ board, jobs: await listBoard(board).catch(() => []) })),
  );
  const candidates: { board: Board; job: GreenhouseJob }[] = [];
  for (const { board, jobs } of listed) {
    for (const job of jobs) {
      const place = job.location?.name ?? "";
      if (!listingAllowed(job.title, place)) continue;
      candidates.push({ board, job });
    }
  }
  const short = candidates.slice(0, 24);
  const scored: Opening[] = [];
  for (const { board, job } of short) {
    const content = await readJob(board, job.id).catch(() => "");
    const jd = `${job.title}\n${job.location?.name ?? ""}\n${content}`;
    const analysis = analyzeJd(jd, job.title);
    if (analysis.blockers.length > 0 || analysis.score < 4) continue;
    scored.push({
      company: board.company,
      title: job.title,
      location: job.location?.name ?? "Location not listed",
      url: job.absolute_url,
      score: analysis.score,
      reasons: analysis.reasons.slice(0, 2),
      description: content || jd,
    });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12);
}
