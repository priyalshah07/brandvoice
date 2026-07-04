import { NextRequest, NextResponse } from "next/server";
import { generateAllOutputs } from "@/lib/anthropic";
import { GenerateRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { brandContent, selectedAudiences, milestone } = body;

    if (!brandContent || !milestone || !selectedAudiences?.length) {
      return NextResponse.json(
        { error: "Missing required fields: brandContent, milestone, or selectedAudiences" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const outputs = await generateAllOutputs(brandContent, selectedAudiences, milestone);
    return NextResponse.json({ outputs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("[/api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
