import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { type Status } from "./statuses";

export type { Status };

export type Application = {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  fit: number;
  secondProject: string;
  status: Status;
  jdExcerpt: string;
  warnings: string[];
  resumeTex: string | null;
  coverTex: string | null;
};

const file = path.join(process.cwd(), "data", "applications.json");

async function readAll(): Promise<Application[]> {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Application[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(rows: Application[]): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(rows, null, 2));
}

export async function listApplications(): Promise<Application[]> {
  const rows = await readAll();
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addApplication(row: Application): Promise<void> {
  const rows = await readAll();
  rows.push(row);
  await writeAll(rows);
}

export async function getApplication(id: string): Promise<Application | null> {
  const rows = await readAll();
  return rows.find((row) => row.id === id) ?? null;
}

export async function updateStatus(id: string, status: Status): Promise<Application | null> {
  const rows = await readAll();
  const row = rows.find((item) => item.id === id);
  if (!row) return null;
  row.status = status;
  await writeAll(rows);
  return row;
}
