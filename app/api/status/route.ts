import { NextResponse } from "next/server";
import { llmConfigured } from "@/lib/llm";

export function GET() {
  return NextResponse.json({
    llm: llmConfigured(),
    model: process.env.AZURE_OPENAI_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT || null,
  });
}
