import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
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

// The repo checkout (process.cwd()) is read-only on Vercel's serverless
// filesystem. Writes there throw, which used to crash /api/generate with a
// bare 500 and leave the "Generating..." button stuck. Fall back to the
// container's writable /tmp so a request never crashes over logging, even
// though that file does not persist across cold starts there.
const primaryFile = path.join(process.cwd(), "data", "applications.json");
const fallbackFile = path.join(os.tmpdir(), "desk-applications.json");
let useFallback = false;

function currentFile(): string {
  return useFallback ? fallbackFile : primaryFile;
}

async function readAll(): Promise<Application[]> {
  try {
    const raw = await readFile(currentFile(), "utf8");
    const parsed = JSON.parse(raw) as Application[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(rows: Application[]): Promise<void> {
  const json = JSON.stringify(rows, null, 2);
  if (!useFallback) {
    try {
      await mkdir(path.dirname(primaryFile), { recursive: true });
      await writeFile(primaryFile, json);
      return;
    } catch {
      useFallback = true;
    }
  }
  try {
    await mkdir(path.dirname(fallbackFile), { recursive: true });
    await writeFile(fallbackFile, json);
  } catch {
    // Neither location is writable. Don't crash the request over logging.
  }
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
