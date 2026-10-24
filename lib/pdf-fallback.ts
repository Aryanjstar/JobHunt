import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

function winAnsi(value: string): string {
  return value
    .replace(/[–—−]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/×/g, "x")
    .replace(/[•·]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

export function texToPlain(tex: string): string {
  let body = tex.split("\\begin{document}")[1] ?? tex;
  body = body.split("\\end{document}")[0] ?? body;
  body = body.replace(/\\\\/g, "\n");
  for (let pass = 0; pass < 10; pass += 1) {
    const next = body
      .replace(/\\href\{[^{}]*\}\{([^{}]*)\}/g, "$1")
      .replace(/\\initialcap\{[^{}]*\}\{([^{}]*)\}/g, "$1")
      .replace(
        /\\(?:textbf|textit|emph|textsc|scshape|small|normalsize|Huge|huge|LARGE|Large|large|footnotesize|textnormal|textcolor\{[^{}]*\}|color\{[^{}]*\})\{([^{}]*)\}/g,
        "$1",
      );
    if (next === body) break;
    body = next;
  }
  body = body
    .replace(/\\%/g, "%")
    .replace(/\\&/g, "&")
    .replace(/\\\$/g, "$")
    .replace(/\\section\*?\{([^{}]*)\}/g, "\n\n$1\n")
    .replace(/\\resumeItem\{([^{}]*)\}/g, "\n- $1")
    .replace(/\\item\b/g, "\n- ")
    .replace(/\$\|\$/g, " | ")
    .replace(/\\textbar\b/g, "|")
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{[^{}]*\})*/g, "")
    .replace(/[{}$]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ");
  return winAnsi(body).trim();
}

type Line = { text: string; size: number; bold: boolean; gap: number };

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines;
}

function plan(text: string, font: PDFFont, bold: PDFFont, size: number, width: number): Line[] {
  const blocks = text.split(/\n/);
  const lines: Line[] = [];
  let first = true;
  for (const raw of blocks) {
    const line = raw.trim();
    if (!line) {
      lines.push({ text: "", size, bold: false, gap: size * 0.45 });
      continue;
    }
    const heading = /^[A-Z][A-Z &/|-]{3,}$/.test(line);
    const bullet = line.startsWith("- ");
    const useSize = first ? size + 8 : heading ? size + 1 : size;
    const useFont = first || heading ? bold : font;
    const useBold = first || heading;
    const chunks = wrap(line, useFont, useSize, width);
    chunks.forEach((chunk, index) => {
      lines.push({
        text: chunk,
        size: useSize,
        bold: useBold || (bullet && index === 0),
        gap: index === chunks.length - 1 ? useSize * 0.42 : useSize * 0.28,
      });
    });
    first = false;
  }
  return lines;
}

function heightOf(lines: Line[]): number {
  return lines.reduce((sum, line) => sum + (line.text ? line.size : 0) + line.gap, 0);
}

export async function fallbackPdf(tex: string): Promise<Buffer> {
  const text = texToPlain(tex);
  const a4 = /\\documentclass\[[^\]]*a4paper/.test(tex);
  const pageSize: [number, number] = a4 ? [595.28, 841.89] : [612, 792];
  const margin = 40;
  const width = pageSize[0] - margin * 2;
  const limit = pageSize[1] - margin * 2;

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let chosen = 7;
  for (const size of [10, 9.5, 9, 8.5, 8, 7.5, 7]) {
    if (heightOf(plan(text, font, bold, size, width)) <= limit) {
      chosen = size;
      break;
    }
  }
  const lines = plan(text, font, bold, chosen, width);
  const page = doc.addPage(pageSize);
  let y = pageSize[1] - margin;
  for (const line of lines) {
    const step = (line.text ? line.size : 0) + line.gap;
    if (y - line.size < margin) break;
    if (line.text) {
      page.drawText(line.text, {
        x: margin,
        y: y - line.size,
        size: line.size,
        font: line.bold ? bold : font,
        color: rgb(0.11, 0.1, 0.08),
      });
    }
    y -= step;
  }
  return Buffer.from(await doc.save());
}
