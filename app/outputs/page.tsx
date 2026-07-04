"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Edit3, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import OutputCard from "@/components/OutputCard";
import LoadingCard from "@/components/LoadingCard";
import CriticReviserPanel from "@/components/CriticReviserPanel";
import RefineAllButton from "@/components/RefineAllButton";
import { useApp } from "@/lib/appContext";
import { AUDIENCES, DEMO_OUTPUTS } from "@/lib/demoData";
import { GeneratedOutput, AudienceId, CritiqueResult } from "@/types";

export default function OutputsPage() {
  const router = useRouter();
  const { onboarding, outputs, setOutputs, brandVoiceProfile } = useApp();
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refineAllLoading, setRefineAllLoading] = useState(false);
  const [refineAllProgress, setRefineAllProgress] = useState<{ done: number; total: number } | null>(null);

  const displayOutputs = outputs.length > 0 ? outputs : DEMO_OUTPUTS;
  const isDemo = outputs.length === 0;
  const selectedAudiences = isDemo
    ? (DEMO_OUTPUTS.map(o => o.audienceId) as AudienceId[])
    : onboarding.selectedAudiences;

  const [liveContent, setLiveContent] = useState<Partial<Record<AudienceId, string>>>({});
  const getContent = (id: AudienceId, original: string) => liveContent[id] ?? original;

  const handleRegenerate = (audienceId: AudienceId, newOutput: GeneratedOutput) => {
    setOutputs(displayOutputs.map(o => (o.audienceId === audienceId ? newOutput : o)));
    setLiveContent(prev => { const n = { ...prev }; delete n[audienceId]; return n; });
  };

  const handleRefined = useCallback((audienceId: AudienceId, newContent: string) => {
    setLiveContent(prev => ({ ...prev, [audienceId]: newContent }));
  }, []);

  const handleRegenerateAll = async () => {
    if (isDemo) { router.push("/onboarding"); return; }
    setRegeneratingAll(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboarding),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regeneration failed");
      setOutputs(data.outputs);
      setLiveContent({});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRegeneratingAll(false);
    }
  };

  const handleRefineAll = async () => {
    const toRefine = displayOutputs.filter(o => selectedAudiences.includes(o.audienceId));
    setRefineAllLoading(true);
    setRefineAllProgress({ done: 0, total: toRefine.length });
    await Promise.allSettled(
      toRefine.map(async (output) => {
        const audience = AUDIENCES.find(a => a.id === output.audienceId)!;
        const content = getContent(output.audienceId, output.content);
        if (isDemo) {
          await new Promise(r => setTimeout(r, 1500 + Math.random() * 800));
          setRefineAllProgress(prev => prev ? { ...prev, done: prev.done + 1 } : null);
          return;
        }
        try {
          const res = await fetch("/api/agent/critique", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ output: content, audienceId: output.audienceId, milestone: onboarding.milestone, brandProfile: brandVoiceProfile, formatSpec: audience.format }),
          });
          const data = await res.json();
          if (res.ok && data.result?.wasRevised) {
            setLiveContent(prev => ({ ...prev, [output.audienceId]: data.result.finalVersion }));
          }
        } catch { /* continue */ } finally {
          setRefineAllProgress(prev => prev ? { ...prev, done: prev.done + 1 } : null);
        }
      })
    );
    setRefineAllLoading(false);
    setRefineAllProgress(null);
  };

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
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <RefineAllButton onClick={handleRefineAll} loading={refineAllLoading} progress={refineAllProgress} isDemo={isDemo} />
          <button
            onClick={handleRegenerateAll}
            disabled={regeneratingAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingAll ? "animate-spin" : ""}`} />
            {regeneratingAll ? "Regenerating…" : "Regenerate all"}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-10">
        {/* Demo banner */}
        {isDemo && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-violet-900">Viewing demo outputs</p>
              <p className="text-xs text-violet-600 mt-0.5">Pre-generated for Meridian's $28M Series A. Click "Review & Refine (Demo)" on any card to see the Critic-Reviser in action.</p>
            </div>
            <button
              onClick={() => router.push("/onboarding")}
              className="shrink-0 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Try with your content
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">{error}</div>
        )}

        {/* Milestone pill */}
        {!isDemo && onboarding.milestone && (
          <div className="mb-8 px-4 py-3 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Announcement</p>
            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">{onboarding.milestone}</p>
          </div>
        )}

        {/* Output grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {regeneratingAll
            ? selectedAudiences.map(id => <LoadingCard key={id} label={AUDIENCES.find(a => a.id === id)!.label} />)
            : displayOutputs.filter(o => selectedAudiences.includes(o.audienceId)).map(output => (
                <div key={output.audienceId} className="flex flex-col">
                  {/* Output card */}
                  <OutputCard
                    output={{
                      ...output,
                      content: getContent(output.audienceId, output.content),
                      wordCount: getContent(output.audienceId, output.content).trim().split(/\s+/).length,
                    }}
                    brandContent={onboarding.brandContent}
                    milestone={onboarding.milestone}
                    onRegenerate={handleRegenerate}
                  />
                  {/* Critic-Reviser panel stitched below */}
                  <div className="bg-white border border-t-0 border-zinc-200 rounded-b-2xl px-5 pb-5 -mt-2 pt-2">
                    <CriticReviserPanel
                      audienceId={output.audienceId}
                      output={getContent(output.audienceId, output.content)}
                      milestone={onboarding.milestone || "Meridian closed a $28M Series A led by Benchmark."}
                      brandProfile={brandVoiceProfile}
                      isDemo={isDemo}
                      onRefined={nc => handleRefined(output.audienceId, nc)}
                    />
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200">
          <button
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            New announcement
          </button>
        </div>
      </div>
    </div>
  );
}
