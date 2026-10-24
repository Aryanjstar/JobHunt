import { forbiddenClaims } from "./profile";

const TOKEN = /\d[\d,]*(?:\.\d+)?(?:\s*(?:%|×|x))?(?:k\+|\+|k)?/gi;

export function numberTokens(text: string): string[] {
  return text.match(TOKEN) ?? [];
}

function norm(token: string): string {
  return token.replace(/\s+/g, "").replace(/×/g, "x").replace(/,/g, "").toLowerCase();
}

export function factTrace(text: string, sources: string[]): { used: string[]; unknown: string[] } {
  const unknown = [...new Set(unknownNumbers(text, sources))];
  const blocked = new Set(unknown.map((token) => norm(token).replace(/\+$/, "")));
  const used: string[] = [];
  const seen = new Set<string>();
  for (const token of numberTokens(text)) {
    const value = norm(token).replace(/\+$/, "");
    if (blocked.has(value) || seen.has(value)) continue;
    seen.add(value);
    used.push(token);
  }
  return { used, unknown };
}

export function unknownNumbers(text: string, sources: string[]): string[] {
  const allowed = new Set<string>();
  for (const source of sources) {
    for (const token of numberTokens(source)) {
      const value = norm(token);
      allowed.add(value);
      allowed.add(value.replace(/\+$/, ""));
    }
  }
  const bad: string[] = [];
  for (const token of numberTokens(text)) {
    const value = norm(token);
    if (!allowed.has(value) && !allowed.has(value.replace(/\+$/, ""))) {
      bad.push(token);
    }
  }
  const yearPhrase = /(\d+(?:\.\d+)?)\s*\+?\s*-?\s*years?/gi;
  const sourceYears = new Set<string>();
  for (const source of sources) {
    for (const match of source.matchAll(yearPhrase)) {
      sourceYears.add(norm(match[1]));
    }
  }
  for (const match of text.matchAll(yearPhrase)) {
    if (!sourceYears.has(norm(match[1]))) bad.push(match[0]);
  }
  return bad;
}

export function forbiddenHits(text: string): string[] {
  const lower = text.toLowerCase();
  return forbiddenClaims.filter((claim) => {
    if (claim === "c#") return lower.includes("c#");
    return new RegExp(`\\b${claim}\\b`, "i").test(lower);
  });
}

export function acceptPolish(
  original: string[],
  polished: string[] | null,
  sources: string[],
  required: string[],
): { paragraphs: string[]; warning?: string } {
  if (!polished) return { paragraphs: original };
  const joined = polished.join("\n\n");
  if (polished.length !== 5) {
    return { paragraphs: original, warning: "The polished letter did not keep five paragraphs, so the plain version was kept." };
  }
  if (!/would make me a valuable asset/i.test(polished[4] ?? "")) {
    return {
      paragraphs: original,
      warning: "The polished letter dropped the closing line, so the plain version was kept.",
    };
  }
  const unknown = unknownNumbers(joined, sources);
  if (unknown.length > 0) {
    return {
      paragraphs: original,
      warning: `The polished letter added ${unknown.join(", ")}, which is not in your profile, so the plain version was kept.`,
    };
  }
  const forbidden = forbiddenHits(joined);
  if (forbidden.length > 0) {
    return {
      paragraphs: original,
      warning: `The polished letter mentioned ${forbidden.join(", ")}, which is not in your profile, so the plain version was kept.`,
    };
  }
  for (const phrase of required) {
    if (!joined.toLowerCase().includes(phrase.toLowerCase())) {
      return {
        paragraphs: original,
        warning: "The polished letter dropped a project or the company, so the plain version was kept.",
      };
    }
  }
  return { paragraphs: polished };
}
