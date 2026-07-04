import { NextRequest, NextResponse } from "next/server";
import { generateSingleOutput } from "@/lib/anthropic";
import { AudienceId } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audienceId, brandContent, milestone } = body as {
      audienceId: AudienceId;
      brandContent: string;
      milestone: string;
    };

    if (!audienceId || !brandContent || !milestone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const output = await generateSingleOutput(audienceId, brandContent, milestone);
    return NextResponse.json({ output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("[/api/regenerate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
