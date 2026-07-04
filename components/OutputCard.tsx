"use client";

import { useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import CopyButton from "./CopyButton";
import LoadingCard from "./LoadingCard";
import { GeneratedOutput, AudienceId } from "@/types";
import { AUDIENCES } from "@/lib/demoData";
import { AUDIENCE_COLORS } from "@/lib/audienceColors";

interface OutputCardProps {
  output: GeneratedOutput;
  brandContent: string;
  milestone: string;
  onRegenerate: (audienceId: AudienceId, newOutput: GeneratedOutput) => void;
}

export default function OutputCard({ output, brandContent, milestone, onRegenerate }: OutputCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audience = AUDIENCES.find(a => a.id === output.audienceId)!;
  const colors = AUDIENCE_COLORS[output.audienceId];

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceId: output.audienceId, brandContent, milestone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regeneration failed");
      onRegenerate(output.audienceId, data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingCard label={audience.label} />;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Colored top accent */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`inline-flex text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
              {audience.label}
            </span>
            <p className="text-xs text-zinc-400 mt-1">{audience.format}</p>
          </div>
          <span className="text-xs text-zinc-400 shrink-0 mt-0.5">{output.wordCount}w</span>
        </div>

        {output.consistencyFlags && output.consistencyFlags.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Consistency check flagged</p>
              <ul className="text-xs text-amber-700 mt-1 space-y-0.5 list-disc list-inside">
                {output.consistencyFlags.map((flag, i) => <li key={i}>{flag}</li>)}
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>
        )}

        {/* Content */}
        <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap flex-1 min-h-0">
          {output.content || <span className="text-zinc-400 italic">No content generated.</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
          <CopyButton text={output.content} />
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
