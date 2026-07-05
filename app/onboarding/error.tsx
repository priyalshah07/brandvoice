"use client";

export default function OnboardingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf9] px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Something went wrong</h2>
        <p className="text-sm text-zinc-500">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
