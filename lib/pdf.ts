import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { inflateSync } from "node:zlib";

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

export async function compileTex(tex: string): Promise<{ pdf: Buffer; pages: number }> {
  const dir = await mkdtemp(path.join(tmpdir(), "desk-"));
  const file = path.join(dir, "doc.tex");
  try {
    await writeFile(file, tex, "utf8");
    await execFileAsync(tectonicPath(), [file, "--outdir", dir, "--chatter", "minimal"], {
      timeout: 120_000,
    });
    const pdf = await readFile(path.join(dir, "doc.pdf"));
    return { pdf, pages: pageCount(pdf) };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
