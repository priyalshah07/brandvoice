"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import StepIndicator from "@/components/StepIndicator";
import AudienceToggle from "@/components/AudienceToggle";
import DemoButton from "@/components/DemoButton";
import BrandVoiceAgent from "@/components/BrandVoiceAgent";
import { useApp } from "@/lib/appContext";
import { DEMO_MILESTONE } from "@/lib/demoData";
import { AudienceId, BrandVoiceProfile } from "@/types";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    onboarding, setOnboarding, setOutputs,
    brandVoiceProfile, setBrandVoiceProfile,
    setBrandVoiceSource,
    pagesAnalyzed, setPagesAnalyzed,
  } = useApp();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandContent, setBrandContent] = useState(onboarding.brandContent);
  const [selectedAudiences, setSelectedAudiences] = useState<AudienceId[]>(onboarding.selectedAudiences);
  const [milestone, setMilestone] = useState(onboarding.milestone);
  const [step1Ready, setStep1Ready] = useState(onboarding.brandContent.length >= 500);

  useEffect(() => {
    if (searchParams.get("demo") === "true") setMilestone(DEMO_MILESTONE);
  }, [searchParams]);

  const handleBrandContentChange = (v: string) => {
    setBrandContent(v);
    setStep1Ready(v.length >= 500);
  };

  const handleAgentComplete = (content: string, profile: BrandVoiceProfile | null, pages: string[]) => {
    setBrandContent(content);
    setBrandVoiceProfile(profile);
    setPagesAnalyzed(pages);
    setBrandVoiceSource(profile ? "url" : "manual");
    setStep1Ready(content.length >= 100 || profile !== null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const state = { brandContent, selectedAudiences, milestone };
    setOnboarding(state);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutputs(data.outputs);
      router.push("/outputs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const STEP_META = [
    { title: "Teach BrandVoice your tone", subtitle: "Enter your website URL. The agent reads your brand pages and builds a voice profile automatically." },
    { title: "Choose your audiences", subtitle: "Select which stakeholder groups this announcement needs to reach. All five are on by default." },
    { title: "Paste your announcement", subtitle: "Write your milestone in plain language — don't polish it yet. BrandVoice handles the translation." },
  ];

  const meta = STEP_META[step - 1];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 bg-white border-b border-zinc-200 sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-zinc-900 tracking-tight">BrandVoice</span>
        </Link>
        <StepIndicator currentStep={step} totalSteps={3} />
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-100">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3">
              <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold">{step}</span>
              Step {step} of 3
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">{meta.title}</h1>
            <p className="mt-2 text-zinc-500 leading-relaxed">{meta.subtitle}</p>
          </div>

          {/* ── Step 1: Brand Voice ── */}
          {step === 1 && (
            <div className="space-y-5">
              <BrandVoiceAgent
                onComplete={handleAgentComplete}
                brandContent={brandContent}
                onBrandContentChange={handleBrandContentChange}
              />
              {step1Ready && brandVoiceProfile && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Brand voice captured from {pagesAnalyzed.length} page{pagesAnalyzed.length !== 1 ? "s" : ""}. Ready to continue.
                </div>
              )}
              {step1Ready && !brandVoiceProfile && brandContent.length >= 500 && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Brand content ready — {brandContent.length.toLocaleString()} characters.
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Audiences ── */}
          {step === 2 && (
            <div className="space-y-5">
              <AudienceToggle selected={selectedAudiences} onChange={setSelectedAudiences} />
              <p className="text-xs text-zinc-400">
                {selectedAudiences.length} of 5 selected · You can regenerate individual outputs any time
              </p>
            </div>
          )}

          {/* ── Step 3: Milestone ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-700">Raw milestone or announcement</label>
                <DemoButton onClick={() => setMilestone(DEMO_MILESTONE)} label="Load demo milestone" />
              </div>
              <textarea
                value={milestone}
                onChange={e => setMilestone(e.target.value)}
                placeholder={`Example: "We just raised $40M Series B led by Andreessen Horowitz. The round will fund expansion of our AI platform into two new verticals and hiring 50 engineers. We've gone from 12 to 80 enterprise customers in 18 months and our NRR is 140%."\n\nInclude: what happened, key metrics, what it enables next. No need to polish — BrandVoice handles that.`}
                className="w-full h-52 p-4 text-sm bg-white border border-zinc-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-zinc-400 leading-relaxed shadow-sm"
              />
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{milestone.trim().split(/\s+/).filter(Boolean).length} words</span>
                {milestone.trim().length > 50 && <span className="text-emerald-600 font-medium">✓ Looks good</span>}
              </div>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                  <strong className="font-semibold">Generation failed: </strong>{error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200">
            {step > 1 ? (
              <button
                onClick={() => { setStep(s => s - 1); setError(null); }}
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => { setStep(s => s + 1); setError(null); }}
                disabled={step === 1 ? !step1Ready : selectedAudiences.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={milestone.trim().length <= 50 || loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating {selectedAudiences.length} outputs…
                  </>
                ) : (
                  <>
                    Generate {selectedAudiences.length} outputs
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <svg className="w-4 h-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading…
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
