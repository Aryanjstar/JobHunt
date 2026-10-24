import { analyzeJd } from "./jd";

type GreenhouseBoard = { kind: "greenhouse"; company: string; token: string };
type LeverBoard = { kind: "lever"; company: string; token: string };
type AshbyBoard = { kind: "ashby"; company: string; token: string };
type Board = GreenhouseBoard | LeverBoard | AshbyBoard;

/**
 * Public career-page JSON that answered on 25 Oct 2026.
 * Indian companies are listed first. No LinkedIn, Naukri, or Foundit session.
 */
const BOARDS: Board[] = [
  { kind: "greenhouse", company: "Groww", token: "groww" },
  { kind: "greenhouse", company: "Druva", token: "druva" },
  { kind: "greenhouse", company: "slice", token: "slice" },
  { kind: "greenhouse", company: "HackerRank", token: "hackerrank" },
  { kind: "greenhouse", company: "Observe.AI", token: "observeai" },
  { kind: "lever", company: "CRED", token: "cred" },
  { kind: "lever", company: "Meesho", token: "meesho" },
  { kind: "lever", company: "Paytm", token: "paytm" },
  { kind: "ashby", company: "Atlan", token: "atlan" },
  { kind: "greenhouse", company: "Vercel", token: "vercel" },
  { kind: "greenhouse", company: "Figma", token: "figma" },
  { kind: "greenhouse", company: "Discord", token: "discord" },
  { kind: "greenhouse", company: "GitLab", token: "gitlab" },
  { kind: "greenhouse", company: "Cloudflare", token: "cloudflare" },
  { kind: "ashby", company: "Notion", token: "notion" },
  { kind: "ashby", company: "Linear", token: "linear" },
  { kind: "ashby", company: "Supabase", token: "supabase" },
  { kind: "ashby", company: "LiveKit", token: "livekit" },
];

const TITLE =
  /\b(ai|machine learning|llm|full[- ]?stack|software|backend|front[- ]?end|member of technical staff|\bmts\b|\bsde\b|platform|infrastructure)\b/i;
const SKIP = /\b(intern|senior|staff|principal|director|manager|lead)\b/i;
const OPEN = /\b(remote|anywhere|worldwide|global|wfh)\b/i;
const INDIA =
  /\b(india|bengaluru|bangalore|hyderabad|pune|mumbai|bombay|chennai|gurugram|gurgaon|noida|delhi|kolkata|ahmedabad|kochi)\b/i;
const AWAY =
  /\b(san francisco|new york|seattle|austin|london|berlin|toronto|singapore|sydney|redwood|california|united states|united kingdom|\busa\b|\buk\b|canada|poland|germany|france|netherlands|ireland|australia|japan|brazil|mexico|spain|israel|sweden|norway|denmark|finland|portugal|italy|korea|taiwan|china|europe|emea|latam)\b/i;

const NAMES = new Map(BOARDS.map((board) => [board.token, board.company]));

export type Opening = {
  company: string;
  title: string;
  location: string;
  url: string;
  score: number;
  reasons: string[];
  description: string;
  source: string;
};

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  content?: string;
};

type LeverJob = {
  text?: string;
  hostedUrl?: string;
  descriptionPlain?: string;
  descriptionBodyPlain?: string;
  openingPlain?: string;
  categories?: { location?: string };
  workplaceType?: string;
};

type AshbyJob = {
  id?: string;
  title?: string;
  location?: string;
  jobUrl?: string;
  isListed?: boolean;
  descriptionPlain?: string;
  descriptionHtml?: string;
};

type Candidate = {
  company: string;
  title: string;
  location: string;
  url: string;
  description: string;
  source: string;
  load?: () => Promise<string>;
};

export function listingAllowed(title: string, location: string): boolean {
  if (!TITLE.test(title) || SKIP.test(title)) return false;
  if (!location) return true;
  if (INDIA.test(location)) return true;
  if (AWAY.test(location)) return false;
  return OPEN.test(location);
}

export function indiaPlace(location: string): boolean {
  return INDIA.test(location);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function companyName(token: string): string {
  return NAMES.get(token) ?? token.replace(/(^|-)(\w)/g, (_match, dash: string, char: string) => `${dash ? " " : ""}${char.toUpperCase()}`);
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": "desk" },
    signal: AbortSignal.timeout(12_000),
    redirect: "error",
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const current = cursor;
      cursor += 1;
      results[current] = await fn(items[current]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function greenhouseJobs(board: GreenhouseBoard): Promise<Candidate[]> {
  const body = (await getJson(
    `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs?content=false`,
  )) as { jobs?: GreenhouseJob[] };
  return (body.jobs ?? []).map((job) => ({
    company: board.company,
    title: job.title,
    location: job.location?.name ?? "",
    url: job.absolute_url,
    description: "",
    source: "Greenhouse",
    load: async () => {
      const detail = (await getJson(
        `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs/${job.id}`,
      )) as { content?: string };
      return stripHtml(detail.content ?? "").slice(0, 6000);
    },
  }));
}

function leverText(job: LeverJob): string {
  return [job.descriptionPlain, job.descriptionBodyPlain, job.openingPlain].filter(Boolean).join("\n").slice(0, 6000);
}

async function leverJobs(board: LeverBoard): Promise<Candidate[]> {
  const body = (await getJson(`https://api.lever.co/v0/postings/${board.token}?mode=json`)) as LeverJob[];
  if (!Array.isArray(body)) return [];
  return body.map((job) => ({
    company: board.company,
    title: job.text ?? "",
    location: [job.categories?.location, job.workplaceType].filter(Boolean).join(", "),
    url: job.hostedUrl ?? "",
    description: leverText(job),
    source: "Lever",
  }));
}

async function ashbyJobs(board: AshbyBoard): Promise<Candidate[]> {
  const body = (await getJson(`https://api.ashbyhq.com/posting-api/job-board/${board.token}`)) as {
    jobs?: AshbyJob[];
  };
  return (body.jobs ?? [])
    .filter((job) => job.isListed !== false)
    .map((job) => ({
      company: board.company,
      title: job.title ?? "",
      location: job.location ?? "",
      url: job.jobUrl ?? "",
      description: (job.descriptionPlain || stripHtml(job.descriptionHtml ?? "")).slice(0, 6000),
      source: "Ashby",
    }));
}

async function remotiveJobs(): Promise<Candidate[]> {
  const body = (await getJson("https://remotive.com/api/remote-jobs?category=software-dev")) as {
    jobs?: {
      title?: string;
      company_name?: string;
      candidate_required_location?: string;
      url?: string;
      description?: string;
    }[];
  };
  return (body.jobs ?? []).slice(0, 40).map((job) => ({
    company: job.company_name ?? "Remotive",
    title: job.title ?? "",
    location: job.candidate_required_location ?? "Worldwide",
    url: job.url ?? "",
    description: stripHtml(job.description ?? "").slice(0, 6000),
    source: "Remotive",
  }));
}

async function listBoard(board: Board): Promise<Candidate[]> {
  if (board.kind === "greenhouse") return greenhouseJobs(board);
  if (board.kind === "lever") return leverJobs(board);
  return ashbyJobs(board);
}

function scoreOpening(candidate: Candidate): Opening | null {
  const jd = `${candidate.title}\n${candidate.location}\n${candidate.description}`;
  const analysis = analyzeJd(jd, candidate.title);
  if (analysis.blockers.length > 0 || analysis.score < 3) return null;
  return {
    company: candidate.company,
    title: candidate.title,
    location: candidate.location || "Location not listed",
    url: candidate.url,
    score: analysis.score,
    reasons: analysis.reasons.slice(0, 2),
    description: candidate.description || jd,
    source: candidate.source,
  };
}

export async function findOpenings(query = ""): Promise<Opening[]> {
  const needle = query.trim().toLowerCase();
  const listed = await Promise.all([
    ...BOARDS.map((board) => listBoard(board).catch(() => [] as Candidate[])),
    remotiveJobs().catch(() => [] as Candidate[]),
  ]);
  const allowed = listed
    .flat()
    .filter((job) => job.title && job.url && listingAllowed(job.title, job.location))
    .filter((job) => !needle || `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(needle));
  const india = allowed.filter((job) => indiaPlace(job.location));
  const rest = allowed.filter((job) => !indiaPlace(job.location));
  const short = [...india.slice(0, 18), ...rest.slice(0, 6)];
  await mapPool(short, 6, async (job) => {
    if (!job.load || job.description) return;
    job.description = await job.load().catch(() => "");
  });
  const scored = short.map(scoreOpening).filter((job): job is Opening => job !== null);
  return scored
    .sort((a, b) => Number(indiaPlace(b.location)) - Number(indiaPlace(a.location)) || b.score - a.score)
    .slice(0, 12);
}

const HOSTS: Record<string, "greenhouse" | "lever" | "ashby"> = {
  "boards.greenhouse.io": "greenhouse",
  "boards.eu.greenhouse.io": "greenhouse",
  "job-boards.greenhouse.io": "greenhouse",
  "job-boards.eu.greenhouse.io": "greenhouse",
  "jobs.lever.co": "lever",
  "jobs.ashbyhq.com": "ashby",
};

export async function readPosting(raw: string): Promise<Opening | null> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const kind = HOSTS[url.hostname];
  if (!kind) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const token = parts[0];
  const id = parts[1] === "jobs" ? parts[2] : parts[1];
  if (!token || !id || !/^[a-z0-9-]+$/i.test(token)) return null;

  let candidate: Candidate | null = null;
  if (kind === "greenhouse" && /^\d+$/.test(id)) {
    const detail = (await getJson(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs/${id}`)) as GreenhouseJob;
    candidate = {
      company: companyName(token),
      title: detail.title,
      location: detail.location?.name ?? "",
      url: detail.absolute_url,
      description: stripHtml(detail.content ?? "").slice(0, 6000),
      source: "Greenhouse",
    };
  } else if (kind === "lever") {
    const detail = (await getJson(`https://api.lever.co/v0/postings/${token}/${id}`)) as LeverJob;
    candidate = {
      company: companyName(token),
      title: detail.text ?? "",
      location: detail.categories?.location ?? "",
      url: detail.hostedUrl ?? raw,
      description: leverText(detail),
      source: "Lever",
    };
  } else if (kind === "ashby") {
    const body = (await getJson(`https://api.ashbyhq.com/posting-api/job-board/${token}`)) as { jobs?: AshbyJob[] };
    const job = (body.jobs ?? []).find((item) => item.id === id || item.jobUrl?.includes(id));
    if (!job) return null;
    candidate = {
      company: companyName(token),
      title: job.title ?? "",
      location: job.location ?? "",
      url: job.jobUrl ?? raw,
      description: (job.descriptionPlain || stripHtml(job.descriptionHtml ?? "")).slice(0, 6000),
      source: "Ashby",
    };
  }
  if (!candidate?.title || !candidate.url) return null;
  const jd = `${candidate.title}\n${candidate.location}\n${candidate.description}`;
  const analysis = analyzeJd(jd, candidate.title);
  return {
    company: candidate.company,
    title: candidate.title,
    location: candidate.location || "Location not listed",
    url: candidate.url,
    score: analysis.score,
    reasons: analysis.reasons.slice(0, 2),
    description: candidate.description || jd,
    source: candidate.source,
  };
}
