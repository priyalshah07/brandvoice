"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Globe } from "lucide-react";
import { DEMO_OUTPUTS, AUDIENCES } from "@/lib/demoData";
import { AUDIENCE_COLORS } from "@/lib/audienceColors";

const PREVIEW_AUDIENCES = ["investor", "technical", "press"];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Globe,
    title: "Teach your brand voice",
    body: "Enter your website URL. The Brand Voice Agent reads your About, Blog, Press, and Product pages and builds a structured voice profile — no copy-pasting.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Choose your audiences",
    body: "Select which of the 5 stakeholder groups matter for this announcement. Each gets a different format, tone, and framing.",
  },
  {
    step: "03",
    icon: Wand2,
    title: "Generate, review, refine",
    body: "All 5 outputs generate in parallel. Then the Critic-Reviser agent scores each piece and rewrites anything that misses — before you share it.",
  },
];

const AUDIENCE_FEATURES = [
  { label: "Investor / VC", format: "LinkedIn post · 150–200w", desc: "Leads with implication, not announcement. Capital efficiency, velocity, what this unlocks next." },
  { label: "Strategic Partner", format: "Cold email + 3 bullets · 150w", desc: "Peer-to-peer tone, outcome-oriented. Soft CTA that opens a door without pitching through it." },
  { label: "Technical Community", format: "Twitter/X thread · 5 tweets", desc: "What was actually hard, what was built, what's still open. Earns credibility through specificity." },
  { label: "Top-of-Funnel Talent", format: "LinkedIn post · 150–180w", desc: "Mission-driven, honest about the stage. No 'we're hiring' until the last line." },
  { label: "Press / Journalist", format: "Pitch paragraph · 100–130w", desc: "Story angle up front, company name in sentence two. Gives journalists a thesis, not a press release." },
];

export default function HomePage() {
  const previews = DEMO_OUTPUTS.filter(o => PREVIEW_AUDIENCES.includes(o.audienceId));

  return (
    <main className="flex flex-col min-h-screen">

      {/* ── Hero (dark) ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(124,58,237,0.28) 0%, transparent 65%), #09090b",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">BrandVoice</span>
          </div>
          <Link
            href="/onboarding"
            className="text-sm text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Get started →
          </Link>
        </nav>

        {/* Hero content */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-28">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium text-zinc-300 mb-10 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Brand Voice Agent · Critic-Reviser · Parallel generation
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06] max-w-3xl">
            <span className="text-white">One announcement.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Five audiences.
            </span>
            <br />
            <span className="text-white">Zero rewrites.</span>
          </h1>

          <p className="mt-7 text-lg text-zinc-400 max-w-lg leading-relaxed">
            Point BrandVoice at your website. It reads your brand voice, then transforms any milestone into investor posts, journalist pitches, talent copy, and more — all in your tone.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Try it with your next announcement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/outputs"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
            >
              See demo
            </Link>
          </div>

          {/* Social proof hint */}
          <p className="mt-8 text-xs text-zinc-600">
            Works without API keys · Demo mode available · No account required
          </p>
        </section>
      </div>

      {/* ── Preview output cards ────────────────────────────── */}
      <section className="bg-white px-6 sm:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Live example</p>
              <h2 className="text-xl font-bold text-zinc-900">Meridian's $28M Series A — 3 of 5 outputs</h2>
            </div>
            <Link
              href="/outputs"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              See all 5 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {previews.map(output => {
              const audience = AUDIENCES.find(a => a.id === output.audienceId)!;
              const colors = AUDIENCE_COLORS[output.audienceId];
              return (
                <div
                  key={output.audienceId}
                  className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Colored header bar */}
                  <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
                        {audience.label}
                      </span>
                      <span className="text-xs text-zinc-400">{output.wordCount}w</span>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed line-clamp-8 whitespace-pre-wrap flex-1">
                      {output.content}
                    </p>
                    <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-100">{audience.format}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="bg-zinc-50 border-y border-zinc-200 px-6 sm:px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">From URL to five polished outputs</h2>
            <p className="mt-3 text-zinc-500 max-w-lg mx-auto">Two AI agents do the heavy lifting so you can focus on the announcement, not the adaptation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line on desktop */}
            <div className="hidden sm:block absolute top-8 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200" />

            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200 flex items-center justify-center mb-5 shadow-sm">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <span className="text-xs font-mono font-bold text-violet-400 mb-1">{item.step}</span>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5 audiences ─────────────────────────────────────── */}
      <section className="bg-white px-6 sm:px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Five outputs, one run</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Every audience gets the right message</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUDIENCE_FEATURES.map((a, i) => {
              const audienceId = AUDIENCES[i]?.id;
              const colors = audienceId ? AUDIENCE_COLORS[audienceId] : null;
              return (
                <div key={a.label} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                  {colors && (
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-3 ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
                      {a.label}
                    </div>
                  )}
                  <p className="text-xs text-zinc-400 mb-2 font-medium">{a.format}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
            {/* Agents feature card */}
            <div className="p-5 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-violet-200 bg-violet-100 text-violet-700 mb-3">
                  AI Agents
                </div>
                <p className="text-xs text-violet-500 mb-2 font-medium">Brand Voice + Critic-Reviser</p>
                <p className="text-sm text-violet-800 leading-relaxed">Built-in agents analyze your website voice and review every output before you publish — with dimension scores and a before/after diff.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 py-20 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 70% 80% at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%), #09090b",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Your next announcement is already written.
          </h2>
          <p className="text-zinc-400 mb-8">You just haven't translated it yet.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            Try BrandVoice free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-zinc-950 border-t border-white/[0.06] px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-sm text-zinc-500 font-medium">BrandVoice</span>
        </div>
        <span className="text-xs text-zinc-600">Powered by OpenAI · Built with Next.js</span>
      </footer>
    </main>
  );
}
