import { NextResponse } from "next/server";
import { findOpenings } from "@/lib/jobs";

export const runtime = "nodejs";

export async function GET() {
  try {
    const openings = await findOpenings();
    return NextResponse.json({ openings });
  } catch {
    return NextResponse.json({ error: "The job boards did not answer.", openings: [] }, { status: 502 });
  }
}
