"use client";

import { useState } from "react";
import { Wand2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import ScoreBadges from "./ScoreBadges";
import BeforeAfterToggle from "./BeforeAfterToggle";
import CopyButton from "./CopyButton";
import { AudienceId, BrandVoiceProfile, CritiqueResult } from "@/types";
import { AUDIENCES, DEMO_CRITIQUE_RESULTS } from "@/lib/demoData";

interface CriticReviserPanelProps {
  audienceId: AudienceId;
  output: string;
  milestone: string;
  brandProfile: BrandVoiceProfile | null;
  isDemo?: boolean;
  onRefined?: (newContent: string) => void;
}

type PanelStatus = "idle" | "critiquing" | "revising" | "done" | "error";

export default function CriticReviserPanel({
  audienceId,
  output,
  milestone,
  brandProfile,
  isDemo = false,
  onRefined,
}: CriticReviserPanelProps) {
  const [status, setStatus] = useState<PanelStatus>("idle");
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [view, setView] = useState<"before" | "after">("after");
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audience = AUDIENCES.find(a => a.id === audienceId)!;

  const handleRefine = async () => {
    setStatus("critiquing");
    setError(null);

    // Demo simulation
    if (isDemo) {
      await new Promise(r => setTimeout(r, 900));
      setStatus("revising");
      await new Promise(r => setTimeout(r, 800));
      const demoResult = DEMO_CRITIQUE_RESULTS[audienceId];
      setResult(demoResult);
      setStatus("done");
      if (demoResult.wasRevised && onRefined) onRefined(demoResult.finalVersion);
      return;
    }

    try {
      const res = await fetch("/api/agent/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          output,
          audienceId,
          milestone,
          brandProfile,
          formatSpec: audience.format,
        }),
      });

      if (status !== "done") setStatus("revising"); // will flip quickly but shows the step

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Critique failed");

      const r: CritiqueResult = data.result;
      setResult(r);
      setStatus("done");
      if (r.wasRevised && onRefined) onRefined(r.finalVersion);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  // ── Idle state ──────────────────────────────────────────────

  if (status === "idle" || status === "error") {
    return (
      <div className="pt-3 border-t border-neutral-100 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleRefine}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {isDemo ? "Review & Refine (Demo)" : "Review & Refine"}
          </button>
          <span className="text-xs text-neutral-400">AI reviews and rewrites weak sections</span>
        </div>
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────

  if (status === "critiquing" || status === "revising") {
    return (
      <div className="pt-3 border-t border-neutral-100">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <svg className="w-3.5 h-3.5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className={status === "critiquing" ? "text-neutral-900 font-medium" : "text-neutral-400"}>
              Step 1: Reviewing...
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <div className="w-3.5 h-3.5 shrink-0" />
            <span className={status === "revising" ? "text-neutral-900 font-medium" : ""}>
              Step 2: Rewriting...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Done state ──────────────────────────────────────────────

  if (status === "done" && result) {
    const displayContent = view === "after" ? result.finalVersion : result.original;
    const currentScores = view === "after" && result.iteration2Scores
      ? result.iteration2Scores
      : result.iteration1Scores;

    return (
      <div className="pt-3 border-t border-neutral-100 space-y-4">
        {/* Score row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ScoreBadges scores={currentScores} />
          {isDemo && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
              Demo
            </span>
          )}
        </div>

        {/* No revision needed */}
        {!result.wasRevised && (
          <p className="text-xs text-neutral-500 italic">
            This output scored well — no rewrite needed.
          </p>
        )}

        {/* Before/After toggle */}
        {result.wasRevised && (
          <div className="flex items-center gap-2">
            <BeforeAfterToggle view={view} onChange={setView} />
            {view === "after" && result.iteration2Scores && (
              <span className="text-xs text-green-600 font-medium">
                +{(result.iteration2Scores.overall - result.iteration1Scores.overall).toFixed(1)} improvement
              </span>
            )}
          </div>
        )}

        {/* Content with optional before-highlights */}
        <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap bg-neutral-50 rounded-lg p-4 border border-neutral-100">
          {view === "before" && result.issues.length > 0
            ? highlightIssues(displayContent, result.issues)
            : displayContent}
        </div>

        <CopyButton text={displayContent} />

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">What's working</p>
            {result.strengths.map((s, i) => (
              <p key={i} className="text-xs text-neutral-600 leading-relaxed">· {s}</p>
            ))}
          </div>
        )}

        {/* Issues (collapsible) */}
        {result.issues.length > 0 && (
          <div>
            <button
              onClick={() => setIssuesOpen(v => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-medium"
            >
              {issuesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} identified
            </button>

            {issuesOpen && (
              <div className="mt-3 space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className="p-3 rounded-lg border border-neutral-200 bg-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-700">{issue.dimension}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          issue.severity === "high"
                            ? "bg-red-50 text-red-600"
                            : issue.severity === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 italic">"{issue.callout}"</p>
                    <p className="text-xs text-neutral-500">→ {issue.fix_direction}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Highlight called-out lines in the "before" view
function highlightIssues(content: string, issues: import("@/types").Issue[]): React.ReactNode {
  // Simple approach: wrap sentences that appear in callouts with a highlight span
  const callouts = issues.map(i => i.callout.slice(1, -1).slice(0, 60)).filter(Boolean); // strip quotes, trim
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        const shouldHighlight = callouts.some(c => line.toLowerCase().includes(c.toLowerCase().slice(0, 30)));
        return (
          <span key={i}>
            {shouldHighlight ? (
              <mark className="bg-amber-100 rounded px-0.5">{line}</mark>
            ) : (
              line
            )}
            {i < lines.length - 1 ? "\n" : ""}
          </span>
        );
      })}
    </>
  );
}
