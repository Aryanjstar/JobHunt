import { NextResponse } from "next/server";
import { listApplications } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const rows = await listApplications();
  return NextResponse.json({
    applications: rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      company: row.company,
      role: row.role,
      fit: row.fit,
      secondProject: row.secondProject,
      status: row.status,
      jdExcerpt: row.jdExcerpt,
      warnings: row.warnings,
      hasResume: Boolean(row.resumeTex),
      hasCover: Boolean(row.coverTex),
    })),
  });
}
