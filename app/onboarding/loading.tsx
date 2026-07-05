export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <div className="flex items-center gap-3 text-zinc-400 text-sm">
        <svg className="w-4 h-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading…
      </div>
    </div>
  );
}
