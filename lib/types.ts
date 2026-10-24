export type Family =
  | "ai"
  | "voice"
  | "backend"
  | "fullstack"
  | "frontend"
  | "sde";

export type Bullet = {
  id: string;
  latex: string;
  plain: string;
  letter: string;
  asset: string;
  keywords: string[];
};

export type Project = {
  id: string;
  name: string;
  stack: string;
  links: { label: string; url: string }[];
  bullets: Bullet[];
  keywords: string[];
  lean: Partial<Record<Family, number>>;
  /** False keeps the project in the profile and off the one-page resume. */
  onResume: boolean;
  note?: string;
};

export type Role = {
  id: string;
  company: string;
  title: string;
  dates: string;
  url: string;
  bullets: Bullet[];
};

export type Accomplishment = {
  id: string;
  latex: string;
  plain: string;
  letter: string;
  asset: string;
  keywords: string[];
  base: number;
};

export type Budget = {
  internBullets: number;
  accomplishments: number;
  projectBullets: number;
};

export type Term = {
  display: string;
  pattern: RegExp;
  possessed: boolean;
  generic?: boolean;
};

export type JdAnalysis = {
  family: Family;
  matched: string[];
  gaps: string[];
  focus: string;
  workMode: string | null;
  warnings: string[];
  blockers: string[];
  score: 1 | 2 | 3 | 4 | 5;
  reasons: string[];
};

export type Letter = {
  date: string;
  roleLines: string[];
  salutation: string;
  companyLine: string;
  teamLine: string;
  paragraphs: string[];
};

export type Selection = {
  family: Family;
  fde: Bullet[];
  intern: Bullet[];
  projects: Project[];
  projectBullets: Record<string, Bullet[]>;
  accomplishments: Accomplishment[];
  skills: { label: string; tokens: string[] }[];
  secondProjectReason: string;
  experienceLetter: Bullet;
  accomplishmentLetter: Accomplishment;
};
