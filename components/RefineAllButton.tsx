"use client";

import { Wand2 } from "lucide-react";

interface RefineAllButtonProps {
  onClick: () => void;
  loading: boolean;
  progress: { done: number; total: number } | null;
  isDemo?: boolean;
}

export default function RefineAllButton({ onClick, loading, progress, isDemo = false }: RefineAllButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-violet-200 bg-violet-50 text-sm font-medium text-violet-700 hover:bg-violet-100 hover:border-violet-300 transition-all disabled:opacity-50"
    >
      <Wand2 className={`w-3.5 h-3.5 ${loading ? "animate-pulse" : ""}`} />
      {loading && progress
        ? `Refining… (${progress.done}/${progress.total})`
        : isDemo ? "Refine All (Demo)" : "Refine All"}
    </button>
  );
}
