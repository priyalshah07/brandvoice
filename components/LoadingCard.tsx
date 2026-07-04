export default function LoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-violet-200 via-indigo-300 to-violet-200 animate-pulse" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="h-5 w-28 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-4 w-10 bg-zinc-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2.5">
          {[1, 11/12, 1, 4/5, 1, 10/12, 3/4].map((w, i) => (
            <div
              key={i}
              className="h-3 bg-zinc-100 rounded animate-pulse"
              style={{ width: `${Math.round(w * 100)}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 150, 300].map(delay => (
              <div
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-400">Writing for {label}…</span>
        </div>
      </div>
    </div>
  );
}
