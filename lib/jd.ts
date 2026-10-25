import type { Family, JdAnalysis, Term } from "./types";

const TERMS: Term[] = [
  { display: "Python", pattern: /\bpython\b/i, possessed: true },
  { display: "Java", pattern: /\bjava(?!script)\b/i, possessed: true },
  { display: "C++", pattern: /c\+\+/i, possessed: true },
  // Case-sensitive on purpose: "go" lowercase is one of the most common
  // words in English prose ("as you go", "go live"), and a posting that
  // never mentions the language otherwise should not get credit for it.
  { display: "Go", pattern: /\b[Gg]olang\b|(?<![a-zA-Z])Go(?![a-zA-Z-])/, possessed: true },
  { display: "TypeScript", pattern: /\btypescript\b/i, possessed: true },
  { display: "JavaScript", pattern: /\bjavascript\b|\bjs\b/i, possessed: true, generic: true },
  { display: "React", pattern: /\breact(?:\.js)?\b/i, possessed: true },
  { display: "Next.js", pattern: /\bnext(?:\.js)?\b/i, possessed: true },
  { display: "Node.js", pattern: /\bnode(?:\.js)?\b/i, possessed: true },
  { display: "Express", pattern: /\bexpress(?:\.js)?\b/i, possessed: true },
  { display: "FastAPI", pattern: /\bfastapi\b/i, possessed: true },
  { display: "Flask", pattern: /\bflask\b/i, possessed: true },
  { display: "MongoDB", pattern: /\bmongodb\b|\bmongo\b/i, possessed: true },
  { display: "PostgreSQL", pattern: /\bpostgres(?:ql)?\b/i, possessed: true },
  { display: "Redis", pattern: /\bredis\b/i, possessed: true },
  { display: "SQL", pattern: /\bsql\b/i, possessed: true },
  { display: "Docker", pattern: /\bdocker\b/i, possessed: true },
  { display: "Kubernetes", pattern: /\bkubernetes\b|\bk8s\b/i, possessed: true },
  { display: "Azure", pattern: /\bazure\b/i, possessed: true },
  { display: "AWS", pattern: /\baws\b|\bec2\b/i, possessed: true },
  { display: "GCP", pattern: /\bgcp\b|\bgoogle cloud\b/i, possessed: true },
  { display: "RAG", pattern: /\brag\b|retrieval-augmented/i, possessed: true },
  { display: "LangChain", pattern: /\blangchain\b/i, possessed: true },
  { display: "LangGraph", pattern: /\blanggraph\b/i, possessed: true },
  { display: "agents", pattern: /\bagents?\b/i, possessed: true },
  { display: "LLMs", pattern: /\bllms?\b|\blarge language models?\b/i, possessed: true },
  { display: "MCP", pattern: /\bmcp\b|model context protocol/i, possessed: true },
  { display: "PyTorch", pattern: /\bpytorch\b/i, possessed: true },
  { display: "TensorFlow", pattern: /\btensorflow\b/i, possessed: true },
  { display: "System Design", pattern: /\bsystem design\b/i, possessed: true },
  { display: "WebSockets", pattern: /\bwebsockets?\b/i, possessed: true },
  { display: "Prometheus", pattern: /\bprometheus\b/i, possessed: true },
  { display: "Grafana", pattern: /\bgrafana\b/i, possessed: true },
  { display: "Playwright", pattern: /\bplaywright\b/i, possessed: true },
  { display: "Gemini", pattern: /\bgemini\b/i, possessed: true },
  { display: "voice", pattern: /\b(voicebots?|voice ai|voice agents?|telephony|asr|tts)\b/i, possessed: true },
  { display: "Git", pattern: /\bgit\b/i, possessed: true, generic: true },
  { display: "HTML", pattern: /\bhtml\b/i, possessed: true, generic: true },
  { display: "CSS", pattern: /\bcss\b/i, possessed: true, generic: true },
  { display: "Linux", pattern: /\blinux\b/i, possessed: true, generic: true },
  { display: "Kafka", pattern: /\bkafka\b/i, possessed: false },
  { display: "Rust", pattern: /\brust\b/i, possessed: false },
  { display: "Scala", pattern: /\bscala\b/i, possessed: false },
  { display: "Hadoop", pattern: /\bhadoop\b/i, possessed: false },
  { display: "Spark", pattern: /\bspark\b/i, possessed: false },
  { display: "Django", pattern: /\bdjango\b/i, possessed: false },
  { display: "Spring", pattern: /\bspring\b/i, possessed: false },
  { display: "GraphQL", pattern: /\bgraphql\b/i, possessed: false },
  { display: "WebRTC", pattern: /\bwebrtc\b/i, possessed: false },
  { display: "Ruby", pattern: /\bruby\b/i, possessed: false },
  { display: "Swift", pattern: /\bswift\b/i, possessed: false },
  { display: "Kotlin", pattern: /\bkotlin\b/i, possessed: false },
];

const AWAY = [
  "san francisco",
  "new york",
  "seattle",
  "austin",
  "london",
  "berlin",
  "toronto",
  "singapore",
  "sydney",
];

export function detectFamily(role: string, jd: string): Family {
  const title = role.toLowerCase();
  const head = `${title}\n${jd.slice(0, 900).toLowerCase()}`;
  if (/\b(voicebots?|voice ai|voice agents?|telephony|\basr\b|\btts\b)\b/.test(head)) {
    return "voice";
  }
  const aiHeavy = /\b(llm|rag|agentic|machine learning|langchain|langgraph)\b/.test(head);
  const productHeavy = /\b(full-?stack|next\.?js|product engineer)\b/.test(head);
  if (/\b(ai|ml|llm|machine learning|applied scientist|research engineer)\b/.test(title)) {
    return "ai";
  }
  if (/front-?end|ui engineer/.test(title)) return "frontend";
  if (/full-?stack|product engineer/.test(title)) return "fullstack";
  if (/member of technical staff|\bmts\b/.test(title)) return aiHeavy ? "ai" : "sde";
  if (aiHeavy && productHeavy) return "ai";
  if (aiHeavy) return "ai";
  if (productHeavy) return "fullstack";
  if (/backend|back-end|platform engineer|infrastructure/.test(title)) return "backend";
  return "sde";
}

function workMode(jd: string): string | null {
  const remote = /\bremote\b/i.test(jd);
  const hybrid = /\bhybrid\b/i.test(jd);
  const onsite = /\bon-?site\b|\bin[- ]office\b/i.test(jd);
  if (remote && hybrid) return "Remote and hybrid";
  if (remote) return "Remote";
  if (hybrid) return "Hybrid";
  if (onsite) return "On-site";
  return null;
}

function indexOfTerm(jd: string, display: string): number {
  const term = TERMS.find((item) => item.display === display);
  if (!term) return Number.POSITIVE_INFINITY;
  const match = new RegExp(term.pattern.source, term.pattern.flags).exec(jd);
  return match ? match.index : Number.POSITIVE_INFINITY;
}

function listPhrase(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function analyzeJd(jd: string, role: string): JdAnalysis {
  const matched: string[] = [];
  const gaps: string[] = [];
  for (const term of TERMS) {
    if (!term.pattern.test(jd)) continue;
    if (term.possessed) matched.push(term.display);
    else gaps.push(term.display);
  }
  const specificMatched = matched
    .filter((name) => {
      const term = TERMS.find((item) => item.display === name);
      return !term?.generic;
    })
    .sort((a, b) => indexOfTerm(jd, a) - indexOfTerm(jd, b));
  const focus = listPhrase(specificMatched.slice(0, 3));
  const family = detectFamily(role, jd);
  const warnings: string[] = [];
  const blockers: string[] = [];
  const mode = workMode(jd);
  const lower = jd.toLowerCase();

  if (/\b([5-9]|[1-9]\d)\s*\+?\s*years?\b/i.test(jd)) {
    blockers.push(
      "Asks for 5 or more years. You are early in a full-time role, so this is a weak fit.",
    );
  }
  if (/\b(principal|distinguished|director of engineering)\b/i.test(jd)) {
    blockers.push("The level reads as principal or director. The documents will still be written.");
  }
  if (
    /\bstaff (software|engineer)\b/i.test(jd) &&
    !/member of technical staff/i.test(jd)
  ) {
    blockers.push("This is a staff engineer posting, above the level of your current role.");
  }
  if (
    /\b(u\.s\.|us|united states) citizen\b/i.test(jd) ||
    (/\bno sponsorship\b/i.test(jd) && /\b(u\.s\.|united states)\b/i.test(jd))
  ) {
    blockers.push("Asks for US work authorization, which is not in your profile.");
  }
  if (/\bsenior\b/i.test(jd) && blockers.length === 0) {
    warnings.push(
      "The word senior is in the description. Your full-time role started in June 2026. Read the level before you apply.",
    );
  }
  if (
    mode === "On-site" &&
    AWAY.some((city) => lower.includes(city)) &&
    !/bengaluru|bangalore|india|remote/.test(lower)
  ) {
    warnings.push("This reads as on-site outside Bengaluru. Your profile lists Bengaluru.");
  }

  const denom = specificMatched.length + gaps.length;
  const ratio = denom === 0 ? 0.5 : specificMatched.length / denom;
  let score: 1 | 2 | 3 | 4 | 5 =
    ratio >= 0.85 ? 5 : ratio >= 0.65 ? 4 : ratio >= 0.45 ? 3 : ratio >= 0.25 ? 2 : 1;
  // One shared keyword is not a strong signal on its own -- it is often a
  // single coincidental overlap with a role that has nothing else to do
  // with the profile. Reserve 4s and 5s for postings with real depth.
  if (specificMatched.length < 2 && score > 3) score = 3;
  if (blockers.length > 0) score = Math.min(score, 2) as 1 | 2 | 3 | 4 | 5;

  const reasons: string[] = [];
  if (specificMatched.length > 0) {
    reasons.push(`Overlaps your profile on ${listPhrase(specificMatched.slice(0, 6))}.`);
  } else {
    reasons.push("Little direct overlap with the tools in your profile.");
  }
  if (gaps.length > 0) {
    reasons.push(`Left out, because they are not in your profile: ${listPhrase(gaps)}.`);
  }
  reasons.push(...blockers, ...warnings);

  return {
    family,
    matched,
    gaps,
    focus,
    workMode: mode,
    warnings,
    blockers,
    score,
    reasons,
  };
}

export function mentions(jd: string, token: string): boolean {
  const term = TERMS.find((item) => item.display.toLowerCase() === token.toLowerCase());
  if (term) return term.pattern.test(jd);
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(jd);
}
