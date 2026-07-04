import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AudienceId, BrandVoiceProfile, CriticScores, CritiqueResult, Issue } from "@/types";
import { AUDIENCES } from "@/lib/demoData";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CriticResponse {
  scores: Omit<CriticScores, "overall">;
  overall: number;
  issues: Issue[];
  strengths: string[];
}

async function runCritic(
  content: string,
  audienceId: AudienceId,
  milestone: string,
  brandProfile: BrandVoiceProfile | null,
  formatSpec: string
): Promise<CriticResponse> {
  const audience = AUDIENCES.find(a => a.id === audienceId)!;

  const audienceProfiles: Record<AudienceId, string> = {
    investor:
      "Partners and principals at growth-stage and Series A/B funds. They skim for signal — velocity, capital efficiency, market size, defensibility. They read hundreds of updates a week and are allergic to hype.",
    partner:
      "VP-level and above at companies that could become customers or strategic partners. They get 40+ cold emails a day and respond only to peer-to-peer tone, specificity, and a clear 'why now.'",
    technical:
      "Senior engineers, ML practitioners, and researchers on Twitter/X. They stop scrolling for intellectual honesty and specific technical details. They instantly dismiss anything that reads like a press release.",
    talent:
      "Senior engineers and operators who are currently employed and quietly evaluating options. They want to know what's actually hard, what they'll build, and whether this is a place to do meaningful work.",
    press:
      "Technology and science journalists at national publications. They want a story their readers will find surprising or counterintuitive — not a distribution channel for your press release.",
  };

  const brandVoiceSection = brandProfile
    ? `Brand voice signals to check against:
- Signature phrases: ${brandProfile.signature_phrases.slice(0, 3).join("; ")}
- Avoid: ${brandProfile.avoid_list.slice(0, 3).join("; ")}`
    : "Brand voice signals: not available (user pasted content manually)";

  const system = `You are a senior content strategist and editor. Evaluate a piece of marketing content written for a specific audience and identify exactly what's weak, generic, or misaligned.

Audience: ${audience.label}
Audience profile: ${audienceProfiles[audienceId]}
Content format required: ${formatSpec}
${brandVoiceSection}

Evaluate on 5 dimensions. For each, give a score 1–10 and 1–2 sentences of specific feedback — callouts to specific lines or structural choices, not generic advice.

Return JSON:
{
  "scores": {
    "hook": N,
    "audience_fit": N,
    "brand_voice": N,
    "claim_grounding": N,
    "format_compliance": N
  },
  "overall": N,
  "issues": [
    {
      "dimension": "...",
      "severity": "high|medium|low",
      "callout": "Specific line or structural issue quoted from the content",
      "fix_direction": "What the reviser should do instead"
    }
  ],
  "strengths": ["1-2 specific things that are working well"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Original milestone: ${milestone}\n\nContent to evaluate:\n${content}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as CriticResponse;
}

async function runReviser(
  original: string,
  critique: CriticResponse,
  audienceId: AudienceId,
  brandProfile: BrandVoiceProfile | null,
  formatSpec: string
): Promise<string> {
  const audience = AUDIENCES.find(a => a.id === audienceId)!;

  const brandVoiceSection = brandProfile
    ? `Brand voice signals:
- Signature phrases: ${brandProfile.signature_phrases.slice(0, 5).join("; ")}
- Avoid: ${brandProfile.avoid_list.join("; ")}`
    : "Brand voice signals: not available.";

  const system = `You are a senior copywriter. You are given a piece of marketing content, a structured critique of its weaknesses, and the brand voice signals of the company. Your job is to rewrite the content to fix the specific issues identified — nothing more. Do not change what's working. Do not add new claims. Do not change the format or approximate length. Fix the hook if it's weak. Fix the framing if it's misaligned. Tighten the brand voice if it's drifting.

Audience: ${audience.label}
Format required: ${formatSpec}
${brandVoiceSection}

Return only the revised content. No preamble, no explanation.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 500,
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Original content:\n${original}\n\nCritique:\n${JSON.stringify(critique, null, 2)}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? original;
}

function toScores(c: CriticResponse): CriticScores {
  const vals = Object.values(c.scores) as number[];
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { ...c.scores, overall: Math.round(avg * 10) / 10 };
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  try {
    const body = await req.json() as {
      output: string;
      audienceId: AudienceId;
      milestone: string;
      brandProfile: BrandVoiceProfile | null;
      formatSpec: string;
    };

    const { output, audienceId, milestone, brandProfile, formatSpec } = body;

    // Iteration 1: Critic
    const critique1 = await runCritic(output, audienceId, milestone, brandProfile, formatSpec);
    const scores1 = toScores(critique1);

    if (scores1.overall >= 8.0) {
      const result: CritiqueResult = {
        original: output,
        revised: null,
        finalVersion: output,
        iteration1Scores: scores1,
        iteration2Scores: null,
        issues: critique1.issues,
        strengths: critique1.strengths,
        wasRevised: false,
      };
      return NextResponse.json({ result });
    }

    // Iteration 2: Reviser + second Critic
    const revised = await runReviser(output, critique1, audienceId, brandProfile, formatSpec);
    const critique2 = await runCritic(revised, audienceId, milestone, brandProfile, formatSpec);
    const scores2 = toScores(critique2);

    const finalVersion = scores2.overall >= scores1.overall ? revised : output;

    const result: CritiqueResult = {
      original: output,
      revised,
      finalVersion,
      iteration1Scores: scores1,
      iteration2Scores: scores2,
      issues: critique1.issues,
      strengths: critique1.strengths,
      wasRevised: true,
    };

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Critique failed";
    console.error("[/api/agent/critique]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
