import { NextResponse } from "next/server";
import { compileTex } from "@/lib/pdf";
import { getApplication } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const doc = new URL(request.url).searchParams.get("doc");
  const row = await getApplication(id);
  if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const tex = doc === "cover" ? row.coverTex : row.resumeTex;
  if (!tex) return NextResponse.json({ error: "That file was not made." }, { status: 404 });
  try {
    const compiled = await compileTex(tex);
    const slug = `${row.company}-${doc === "cover" ? "letter" : "resume"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return new NextResponse(new Uint8Array(compiled.pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="aryan-${slug || "document"}.pdf"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The PDF did not compile.";
    return NextResponse.json({ error: message.slice(0, 240) }, { status: 500 });
  }
}
