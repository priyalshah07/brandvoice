"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import AgentLogPanel from "./AgentLogPanel";
import BrandProfileCard from "./BrandProfileCard";
import DemoButton from "./DemoButton";
import { BrandVoiceProfile } from "@/types";
import { DEMO_BRAND_PROFILE, DEMO_AGENT_LOG_LINES, DEMO_BRAND_CONTENT } from "@/lib/demoData";

interface BrandVoiceAgentProps {
  onComplete: (brandContent: string, profile: BrandVoiceProfile | null, pagesAnalyzed: string[]) => void;
  // Manual fallback
  brandContent: string;
  onBrandContentChange: (v: string) => void;
}

type AgentStatus = "idle" | "running" | "done" | "error" | "partial";

export default function BrandVoiceAgent({
  onComplete,
  brandContent,
  onBrandContentChange,
}: BrandVoiceAgentProps) {
  const [url, setUrl] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [profile, setProfile] = useState<BrandVoiceProfile | null>(null);
  const [pagesAnalyzed, setPagesAnalyzed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const brandCharCount = brandContent.length;
  const brandMinChars = 500;

  const appendLog = (line: string) => setLogs(prev => [...prev, line]);

  // ── Demo simulation ─────────────────────────────────────────

  const runDemoSimulation = async () => {
    setIsDemo(true);
    setStatus("running");
    setLogs([]);
    setProfile(null);
    setError(null);
    setNotice(null);

    for (const line of DEMO_AGENT_LOG_LINES) {
      await new Promise(r => setTimeout(r, 600));
      appendLog(line);
    }

    setProfile(DEMO_BRAND_PROFILE);
    setPagesAnalyzed(["Homepage", "About", "Blog — Shipping ML", "Blog — Last Mile", "Platform", "Press"]);
    setStatus("done");

    const chunks = DEMO_BRAND_PROFILE.raw_chunks.join("\n\n");
    onComplete(chunks, DEMO_BRAND_PROFILE, ["Homepage", "About", "Blog — Shipping ML", "Blog — Last Mile", "Platform", "Press"]);
  };

  // ── Live agent ──────────────────────────────────────────────

  const runAgent = async () => {
    if (!url.trim()) return;

    if (url.trim() === "demo.meridian.ai") {
      await runDemoSimulation();
      return;
    }

    setStatus("running");
    setLogs([]);
    setProfile(null);
    setError(null);
    setNotice(null);
    setIsDemo(false);

    try {
      const res = await fetch("/api/agent/brand-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}` }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(chunk.slice(6));

            if (data.type === "log") {
              appendLog(data.message);
            } else if (data.type === "profile") {
              const p: BrandVoiceProfile = data.brandProfile;
              const pages: string[] = data.pagesAnalyzed ?? [];
              setProfile(p);
              setPagesAnalyzed(pages);
              setStatus("done");
              const chunks = p.raw_chunks.join("\n\n");
              onComplete(chunks, p, pages);
            } else if (data.type === "error") {
              setError(data.message);
              setStatus("error");
            } else if (data.type === "partial") {
              setNotice(data.message);
              onBrandContentChange(data.partialContent ?? "");
              setStatus("partial");
              setShowManual(true);
            } else if (data.type === "notice") {
              setNotice(data.message);
            }
          } catch { /* malformed chunk */ }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setLogs([]);
    setProfile(null);
    setError(null);
    setNotice(null);
    setIsDemo(false);
  };

  return (
    <div className="space-y-4">
      {/* URL input */}
      {status === "idle" || status === "error" ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runAgent()}
                placeholder="yourcompany.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={runAgent}
              disabled={!url.trim()}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Analyze Brand Voice
            </button>
          </div>

          <div className="flex items-center justify-between">
            <DemoButton
              onClick={() => { setUrl("demo.meridian.ai"); setTimeout(runDemoSimulation, 50); }}
              label="Try with demo.meridian.ai"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      ) : null}

      {/* Agent log */}
      {(status === "running" || (logs.length > 0 && status !== "idle")) && (
        <AgentLogPanel lines={logs} done={status !== "running"} />
      )}

      {/* Notice */}
      {notice && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {notice}
        </div>
      )}

      {/* Re-analyze option when done */}
      {(status === "done" || status === "partial") && (
        <button
          onClick={handleReset}
          className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          ← Analyze a different URL
        </button>
      )}

      {/* Brand profile card */}
      {profile && status === "done" && (
        <BrandProfileCard
          profile={profile}
          pagesAnalyzed={pagesAnalyzed}
          isDemo={isDemo}
          onReanalyze={handleReset}
        />
      )}

      {/* Manual fallback toggle */}
      <div className="border-t border-zinc-200 pt-4">
        <button
          onClick={() => setShowManual(v => !v)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
        >
          {showManual ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showManual ? "Hide manual input" : "Or paste content manually"}
        </button>

        {showManual && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-zinc-700">Brand content</label>
              <DemoButton onClick={() => onBrandContentChange(DEMO_BRAND_CONTENT)} />
            </div>
            <textarea
              value={brandContent}
              onChange={e => onBrandContentChange(e.target.value)}
              placeholder={`Paste your company's published content here. Examples:\n\n• Your last press release or funding announcement\n• 3–5 LinkedIn posts from your CEO or founders\n• Your About page or company description\n• A blog post explaining what you do and why`}
              className="w-full h-64 p-4 text-sm bg-white border border-zinc-200 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-zinc-400 leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs">
              <span className={brandCharCount >= brandMinChars ? "text-emerald-600 font-semibold" : "text-zinc-400"}>
                {brandCharCount.toLocaleString()} characters
                {brandCharCount < brandMinChars && ` · aim for ${brandMinChars}+`}
              </span>
              {brandCharCount >= brandMinChars && <span className="text-emerald-600 font-semibold">✓ Good to go</span>}
            </div>
            {brandCharCount >= brandMinChars && (
              <button
                onClick={() => onComplete(brandContent, null, [])}
                className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Use this content →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
