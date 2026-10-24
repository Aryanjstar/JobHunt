type ChatResponse = {
  choices?: { message?: { content?: string } }[];
};

export function llmConfigured(): boolean {
  return Boolean(
    process.env.AZURE_OPENAI_API_KEY &&
      process.env.AZURE_OPENAI_ENDPOINT &&
      process.env.AZURE_OPENAI_DEPLOYMENT,
  );
}

export async function polishCover(input: {
  paragraphs: string[];
  sources: string[];
  company: string;
  role: string;
}): Promise<string[] | null> {
  if (!llmConfigured()) return null;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, "");
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
  const version = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.AZURE_OPENAI_API_KEY!,
    },
    body: JSON.stringify({
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You tighten a cover letter. You may change rhythm and word choice. You may not add employers, tools, numbers, or awards. Keep exactly five paragraphs. The last paragraph must contain the exact phrase \"would make me a valuable asset\". Return JSON: {\"paragraphs\":[...]}",
        },
        {
          role: "user",
          content: JSON.stringify({
            company: input.company,
            role: input.role,
            factsYouMayUse: input.sources,
            paragraphs: input.paragraphs,
          }),
        },
      ],
    }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as ChatResponse;
  const content = body.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as { paragraphs?: unknown };
    if (!Array.isArray(parsed.paragraphs)) return null;
    if (!parsed.paragraphs.every((item) => typeof item === "string")) return null;
    return parsed.paragraphs as string[];
  } catch {
    return null;
  }
}
