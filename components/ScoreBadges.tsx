import { CriticScores } from "@/types";

const LABELS: Array<{ key: keyof Omit<CriticScores, "overall">; label: string }> = [
  { key: "hook", label: "Hook" },
  { key: "audience_fit", label: "Fit" },
  { key: "brand_voice", label: "Voice" },
  { key: "claim_grounding", label: "Claims" },
  { key: "format_compliance", label: "Format" },
];

function scoreColor(n: number) {
  if (n >= 8) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (n >= 6) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export default function ScoreBadges({ scores }: { scores: CriticScores }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {LABELS.map(({ key, label }) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${scoreColor(scores[key])}`}
        >
          {label} <span className="font-bold">{scores[key]}</span>
        </span>
      ))}
      <span className="ml-1.5 text-sm font-bold text-zinc-900">
        {scores.overall.toFixed(1)}
        <span className="text-zinc-400 font-normal text-xs"> / 10</span>
      </span>
    </div>
  );
}
