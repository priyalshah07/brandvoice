"use client";

import { AudienceId } from "@/types";
import { AUDIENCES } from "@/lib/demoData";
import { AUDIENCE_COLORS } from "@/lib/audienceColors";

interface AudienceToggleProps {
  selected: AudienceId[];
  onChange: (selected: AudienceId[]) => void;
}

export default function AudienceToggle({ selected, onChange }: AudienceToggleProps) {
  const toggle = (id: AudienceId) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {AUDIENCES.map(audience => {
        const isSelected = selected.includes(audience.id);
        const c = AUDIENCE_COLORS[audience.id];
        return (
          <button
            key={audience.id}
            onClick={() => toggle(audience.id)}
            className={`text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              isSelected
                ? `${c.selectedBorder} ${c.selectedBg}`
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-sm font-semibold ${isSelected ? c.selectedLabelText : "text-zinc-800"}`}>
                {audience.label}
              </span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? `${c.checkBg} ${c.checkBorder}` : "border-zinc-300 bg-white"
              }`}>
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <p className={`text-xs leading-relaxed mb-1.5 ${isSelected ? c.selectedDescText : "text-zinc-500"}`}>
              {audience.description}
            </p>
            <p className={`text-xs font-medium ${isSelected ? c.selectedFormatText : "text-zinc-400"}`}>
              {audience.format}
            </p>
          </button>
        );
      })}
    </div>
  );
}
