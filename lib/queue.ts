export const QUEUE_KEY = "desk-queue";

export type QueueItem = {
  company: string;
  role: string;
  jd: string;
};

export function parseQueue(raw: string | null): QueueItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as QueueItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.jd === "string" && item.jd.trim().length >= 40)
      .slice(0, 12)
      .map((item) => ({
        company: String(item.company ?? "").slice(0, 80),
        role: String(item.role ?? "").slice(0, 80),
        jd: item.jd.slice(0, 20000),
      }));
  } catch {
    return [];
  }
}
