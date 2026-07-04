export type AudienceId =
  | "investor"
  | "partner"
  | "technical"
  | "talent"
  | "press";

export interface Audience {
  id: AudienceId;
  label: string;
  description: string;
  format: string;
}

export interface GeneratedOutput {
  audienceId: AudienceId;
  content: string;
  wordCount: number;
  consistencyFlags?: string[];
}

export interface OnboardingState {
  brandContent: string;
  selectedAudiences: AudienceId[];
  milestone: string;
}

export interface GenerateRequest {
  brandContent: string;
  selectedAudiences: AudienceId[];
  milestone: string;
}

export interface GenerateResponse {
  outputs: GeneratedOutput[];
  error?: string;
}

export interface EmbedRequest {
  texts: string[];
}

export interface EmbedResponse {
  embeddings: number[][];
}

// ── Brand Voice Agent ──────────────────────────────────────────

export interface BrandVoiceProfile {
  tone_descriptors: string[];
  signature_phrases: string[];
  avoid_list: string[];
  content_style: string;
  values_emphasis: string[];
  raw_chunks: string[];
}

export interface PageAnalysis {
  url: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | "SKIP";
  page_type: string;
  fetched: boolean;
  error?: string;
}

// ── Critic-Reviser Agent ───────────────────────────────────────

export interface CriticScores {
  hook: number;
  audience_fit: number;
  brand_voice: number;
  claim_grounding: number;
  format_compliance: number;
  overall: number;
}

export interface Issue {
  dimension: string;
  severity: "high" | "medium" | "low";
  callout: string;
  fix_direction: string;
}

export interface CritiqueResult {
  original: string;
  revised: string | null;
  finalVersion: string;
  iteration1Scores: CriticScores;
  iteration2Scores: CriticScores | null;
  issues: Issue[];
  strengths: string[];
  wasRevised: boolean;
}
