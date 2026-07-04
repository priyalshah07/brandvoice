"use client";

const STEP_LABELS = ["Brand Voice", "Audiences", "Announcement"];

export default function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                  isCompleted
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : isActive
                    ? "bg-violet-600 text-white ring-4 ring-violet-100 shadow-sm shadow-violet-500/30"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step}
              </div>
              <span className={`text-sm font-medium hidden sm:block transition-colors ${
                isActive ? "text-zinc-900" : isCompleted ? "text-zinc-500" : "text-zinc-400"
              }`}>
                {STEP_LABELS[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`mx-3 h-px w-8 sm:w-14 transition-all duration-300 ${isCompleted ? "bg-violet-400" : "bg-zinc-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
