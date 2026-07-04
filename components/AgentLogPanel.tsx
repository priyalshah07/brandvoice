"use client";

import { useEffect, useRef } from "react";

export default function AgentLogPanel({ lines, done = false }: { lines: string[]; done?: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs text-zinc-500 font-mono">brand-voice-agent</span>
      </div>
      {/* Log body */}
      <div className="bg-zinc-950 px-4 py-4 font-mono text-xs leading-relaxed overflow-y-auto max-h-52">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2.5 py-0.5">
            <span className="text-violet-500 shrink-0 select-none mt-px">❯</span>
            <span className="text-zinc-300">{line}</span>
          </div>
        ))}
        {!done && lines.length > 0 && (
          <div className="flex items-center gap-2 mt-2 pl-5">
            <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse rounded-sm" />
          </div>
        )}
        {lines.length === 0 && (
          <span className="text-zinc-600">Waiting for agent to start…</span>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
