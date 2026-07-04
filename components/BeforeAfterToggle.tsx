"use client";

export default function BeforeAfterToggle({ view, onChange }: { view: "before" | "after"; onChange: (v: "before" | "after") => void }) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 p-0.5 gap-0.5">
      {(["before", "after"] as const).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize ${
            view === v
              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
