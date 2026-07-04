"use client";

import { Zap } from "lucide-react";

export default function DemoButton({ onClick, label = "Load Demo Content" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors"
    >
      <Zap className="w-3 h-3" />
      {label}
    </button>
  );
}
