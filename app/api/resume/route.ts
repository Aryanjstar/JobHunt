import { NextResponse } from "next/server";
import { z } from "zod";
import { pinnedResume } from "@/lib/render";

export const runtime = "nodejs";

const schema = z.object({
  projectIds: z.array(z.string()).max(2),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose two projects." }, { status: 400 });
  }
  try {
    const pdf = await pinnedResume(parsed.data.projectIds);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="aryan-jaiswal-resume.pdf"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The PDF did not compile.";
    return NextResponse.json({ error: message.slice(0, 240) }, { status: 500 });
  }
}
