import { NextResponse } from "next/server";
import { authToken } from "@/lib/auth";

export async function POST(request: Request) {
  const password = process.env.APP_PASSWORD;
  if (!password) return NextResponse.json({ ok: true });
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || body.password !== password) {
    return NextResponse.json({ error: "That password does not match." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("desk", await authToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
