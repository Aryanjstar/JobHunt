import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const doc = await getDocumentProxy(bytes);
    const extracted = await extractText(doc, { mergePages: true });
    return NextResponse.json({ text: extracted.text });
  }
  const text = await file.text();
  return NextResponse.json({ text });
}
