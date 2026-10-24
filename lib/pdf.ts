import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { inflateSync } from "node:zlib";
import { extractTextItems } from "unpdf";
import { fallbackPdf } from "./pdf-fallback";

const execFileAsync = promisify(execFile);

export function tectonicPath(): string {
  return process.env.TECTONIC_PATH || "/opt/homebrew/bin/tectonic";
}

export function pageCount(pdf: Buffer): number {
  const chunks: Buffer[] = [pdf];
  const streams = pdf.toString("latin1").match(/stream\r?\n[\s\S]*?\r?\nendstream/g) ?? [];
  for (const block of streams) {
    const start = block.indexOf("\n") + 1;
    const end = block.lastIndexOf("endstream");
    const body = Buffer.from(block.slice(start, end).replace(/\r?\n$/, ""), "latin1");
    try {
      chunks.push(inflateSync(body));
    } catch {
      // Not every stream is deflate.
    }
  }
  const all = Buffer.concat(chunks);
  const pages = all.toString("latin1").match(/\/Type\s*\/Page(?!s)/g);
  return pages?.length ?? 0;
}

/** How far down the first page the text reaches, as a percent of the page height. */
export async function pageFill(pdf: Buffer): Promise<number> {
  const extracted = await extractTextItems(new Uint8Array(pdf));
  const lines = (extracted.items[0] ?? []).filter((item) => item.str.trim());
  if (lines.length === 0) return 0;
  const lowest = Math.min(...lines.map((item) => item.y));
  const media = pdf.toString("latin1").match(/\/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+[\d.]+\s+([\d.]+)\s*\]/);
  const height = media ? Number(media[1]) : Math.max(...lines.map((item) => item.y + item.height), 792);
  if (!Number.isFinite(height) || height <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(((height - lowest) / height) * 100)));
}

function tectonicDetail(error: unknown): string {
  const stderr =
    error && typeof error === "object" && "stderr" in error ? String((error as { stderr?: unknown }).stderr) : "";
  const line = stderr
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .at(-1);
  if (line) return line.slice(0, 180);
  if (error instanceof Error && error.message) return error.message.split("\n")[0].slice(0, 180);
  return "Tectonic did not produce a PDF.";
}

async function compileWithTectonic(tex: string): Promise<{ pdf: Buffer; pages: number }> {
  const dir = await mkdtemp(path.join(tmpdir(), "desk-"));
  const file = path.join(dir, "doc.tex");
  const pdfPath = path.join(dir, "doc.pdf");
  try {
    await writeFile(file, tex, "utf8");
    let failure: unknown;
    try {
      await execFileAsync(tectonicPath(), [file, "--outdir", dir, "--chatter", "minimal"], {
        timeout: 120_000,
        maxBuffer: 20 * 1024 * 1024,
      });
    } catch (error) {
      failure = error;
    }
    const pdf = await readFile(pdfPath).catch(() => null);
    if (pdf && pdf.subarray(0, 5).toString() === "%PDF-") {
      return { pdf, pages: pageCount(pdf) };
    }
    throw new Error(tectonicDetail(failure));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function compileTex(tex: string): Promise<{ pdf: Buffer; pages: number; engine: "tectonic" | "fallback" }> {
  try {
    const compiled = await compileWithTectonic(tex);
    return { ...compiled, engine: "tectonic" };
  } catch {
    const pdf = await fallbackPdf(tex);
    const pages = pageCount(pdf);
    return { pdf, pages: pages > 0 ? pages : 1, engine: "fallback" };
  }
}
