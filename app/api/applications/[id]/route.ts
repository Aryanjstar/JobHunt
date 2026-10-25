import { NextResponse } from "next/server";
import { deleteApplication, updateStatus } from "@/lib/store";
import { STATUSES, type Status } from "@/lib/statuses";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !STATUSES.includes(body.status as Status)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }
  const row = await updateStatus(id, body.status as Status);
  if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, status: row.status });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const removed = await deleteApplication(id);
  if (!removed) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
