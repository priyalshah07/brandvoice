"use client";

import { RefreshCw, Globe } from "lucide-react";
import { BrandVoiceProfile } from "@/types";

interface BrandProfileCardProps {
  profile: BrandVoiceProfile;
  pagesAnalyzed: string[];
  isDemo?: boolean;
  onReanalyze?: () => void;
}

export default function BrandProfileCard({ profile, pagesAnalyzed, isDemo = false, onReanalyze }: BrandProfileCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900">Brand Voice Profile</span>
          {isDemo && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 border border-violet-200 font-medium">
              Demo
            </span>
          )}
        </div>
        {onReanalyze && (
          <button
            onClick={onReanalyze}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-600 transition-colors font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Re-analyze
          </button>
        )}
      </div>

      <div className="px-5 py-5 space-y-5">
        {profile.tone_descriptors.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Tone</p>
            <div className="flex flex-wrap gap-2">
              {profile.tone_descriptors.map((t, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.signature_phrases.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Signature Phrases</p>
            <ul className="space-y-1.5">
              {profile.signature_phrases.map((p, i) => (
                <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                  <span className="text-violet-300 shrink-0 mt-0.5 font-bold">·</span>
                  <span className="italic text-zinc-600">"{p}"</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.avoid_list.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Avoids</p>
            <ul className="space-y-1.5">
              {profile.avoid_list.map((a, i) => (
                <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 mt-0.5 font-bold text-xs">✗</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.content_style && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Style</p>
            <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 rounded-xl p-3 border border-zinc-100">{profile.content_style}</p>
          </section>
        )}

        {profile.values_emphasis.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">Core Values</p>
            <div className="flex flex-wrap gap-2">
              {profile.values_emphasis.map((v, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-medium">
                  {v}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center gap-1.5">
        <Globe className="w-3 h-3 text-zinc-400" />
        <p className="text-xs text-zinc-400">
          {pagesAnalyzed.length} page{pagesAnalyzed.length !== 1 ? "s" : ""} analyzed
          {pagesAnalyzed.length > 0 && <> · {pagesAnalyzed.join(", ")}</>}
        </p>
      </div>
    </div>
  );
}
