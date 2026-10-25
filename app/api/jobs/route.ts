import { NextResponse } from "next/server";
import { z } from "zod";
import { findOpenings, IrrelevantTitleError, readPosting } from "@/lib/jobs";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().max(80),
});

const linkSchema = z.object({
  url: z.string().min(12).max(500),
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse({ q: new URL(request.url).searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Keep the keyword under 80 characters.", openings: [] }, { status: 400 });
  }
  try {
    const openings = await findOpenings(parsed.data.q);
    return NextResponse.json({ openings });
  } catch {
    return NextResponse.json({ error: "The job boards did not answer.", openings: [] }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = linkSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paste a posting link." }, { status: 400 });
  }
  try {
    const opening = await readPosting(parsed.data.url);
    if (!opening) {
      return NextResponse.json(
        { error: "That link is not a public Greenhouse, Lever, or Ashby posting." },
        { status: 400 },
      );
    }
    return NextResponse.json({ opening });
  } catch (error) {
    if (error instanceof IrrelevantTitleError) {
      return NextResponse.json(
        {
          error:
            "That posting's title doesn't read like AI, backend, frontend, full-stack, SDE, platform, infrastructure, or member-of-technical-staff work, so Desk will not tailor documents for it.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "That posting did not load." }, { status: 502 });
  }
}
