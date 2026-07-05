"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import CopyButton from "./CopyButton";
import CriticReviserPanel from "./CriticReviserPanel";
import PublishButton from "./PublishButton";
import { GeneratedOutput, AudienceId, BrandVoiceProfile, CritiqueResult } from "@/types";
import { AUDIENCES } from "@/lib/demoData";
import { AUDIENCE_COLORS } from "@/lib/audienceColors";

interface OutputCardProps {
  output: GeneratedOutput;
  brandContent: string;
  milestone: string;
  brandProfile: BrandVoiceProfile | null;
  isDemo: boolean;
  onRegenerate: (audienceId: AudienceId, newOutput: GeneratedOutput) => void;
  onRefined: (audienceId: AudienceId, content: string) => void;
  onContentChange?: (audienceId: AudienceId, content: string) => void;
  onToast: (message: string, icon?: "linkedin" | "email" | "x") => void;
}

export default function OutputCard({
  output,
  brandContent,
  milestone,
  brandProfile,
  isDemo,
  onRegenerate,
  onRefined,
  onContentChange,
  onToast,
}: OutputCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState(output.content);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [criticView, setCriticView] = useState<"before" | "after">("after");
  const [criticResult, setCriticResult] = useState<CritiqueResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when parent content changes externally (after regeneration or RefineAll)
  useEffect(() => {
    if (!hasUserEdited) {
      setEditedContent(output.content);
    }
  }, [output.content]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-resize textarea whenever displayed content changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [editedContent, criticView, criticResult]);

  const audience = AUDIENCES.find(a => a.id === output.audienceId)!;
  const colors = AUDIENCE_COLORS[output.audienceId];

  const inBeforeMode = criticView === "before" && !!criticResult?.wasRevised;
  const displayContent = inBeforeMode ? criticResult!.original : editedContent;
  const liveWordCount = displayContent.trim().split(/\s+/).filter(Boolean).length;

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setEditedContent(val);
      setHasUserEdited(true);
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      onContentChange?.(output.audienceId, val);
    },
    [output.audienceId, onContentChange]
  );

  const doRegenerate = async () => {
    setLoading(true);
    setError(null);
    setHasUserEdited(false);
    setCriticResult(null);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceId: output.audienceId, brandContent, milestone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regeneration failed");
      onRegenerate(output.audienceId, data.output);
      setEditedContent(data.output.content);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (hasUserEdited) {
      setShowConfirmDialog(true);
    } else {
      doRegenerate();
    }
  };

  const handleRefinedFromCritic = (newContent: string) => {
    setEditedContent(newContent);
    setHasUserEdited(false);
    onRefined(output.audienceId, newContent);
  };

  return (
    <>
      <div className="flex flex-col">
        {/* ── Main card ── */}
        <div className="rounded-t-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
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
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                {isEditing && !inBeforeMode && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                    Editing
                  </span>
                )}
                <span className="text-xs text-zinc-400">{liveWordCount}w</span>
              </div>
            </div>

            {/* Consistency flags */}
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

            {/* Content — loading skeleton or editable textarea */}
            {loading ? (
              <div className="space-y-2.5 flex-1">
                {[1, 11 / 12, 1, 4 / 5, 1, 10 / 12, 3 / 4].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 bg-zinc-100 rounded animate-pulse"
                    style={{ width: `${Math.round(w * 100)}%`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={displayContent}
                readOnly={inBeforeMode}
                onChange={inBeforeMode ? undefined : handleTextareaChange}
                onFocus={() => { if (!inBeforeMode) setIsEditing(true); }}
                onBlur={() => setIsEditing(false)}
                className={`w-full text-sm text-zinc-700 leading-relaxed resize-none transition-all duration-150 focus:outline-none rounded-lg px-3 py-2.5 ${
                  inBeforeMode
                    ? "bg-zinc-50 cursor-default border border-transparent"
                    : isEditing
                      ? "bg-zinc-50 border border-violet-200 cursor-text"
                      : "bg-transparent border border-transparent hover:border-zinc-200 hover:bg-zinc-50/40 cursor-text"
                }`}
                style={{ minHeight: "8rem" }}
              />
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-start gap-2 pt-3 border-t border-zinc-100">
              <CopyButton text={displayContent} />
              <PublishButton
                audienceId={output.audienceId}
                content={displayContent}
                milestone={milestone}
                onToast={onToast}
              />
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 transition-all disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* ── Critic panel stitched below ── */}
        <div className="bg-white border border-t-0 border-zinc-200 rounded-b-2xl px-5 pb-5 pt-2">
          <CriticReviserPanel
            audienceId={output.audienceId}
            output={editedContent}
            milestone={milestone}
            brandProfile={brandProfile}
            isDemo={isDemo}
            view={criticView}
            onViewChange={setCriticView}
            onResult={setCriticResult}
            onRefined={handleRefinedFromCritic}
          />
        </div>
      </div>

      {/* ── Confirm regenerate dialog ── */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirmDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-zinc-900">Replace your edits?</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              This will replace your edits with a new AI-generated version. Continue?
            </p>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirmDialog(false); doRegenerate(); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
