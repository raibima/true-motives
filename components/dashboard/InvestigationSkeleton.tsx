export function InvestigationCardSkeleton() {
  return (
    <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="animate-shimmer h-4 w-3/4 rounded" />
          <div className="animate-shimmer h-4 w-1/2 rounded" />
        </div>
        <div className="animate-shimmer h-6 w-20 flex-shrink-0 rounded-full" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="animate-shimmer h-3.5 w-full rounded" />
        <div className="animate-shimmer h-3.5 w-5/6 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="animate-shimmer h-5 w-20 rounded-md" />
        <div className="animate-shimmer h-3.5 w-24 rounded" />
        <div className="animate-shimmer ml-auto h-3.5 w-16 rounded" />
      </div>
    </div>
  );
}

export function InvestigationDetailSkeleton() {
  return (
    <div className="max-w-3xl px-8 py-8">
      {/* Back link */}
      <div className="animate-shimmer mb-6 h-4 w-32 rounded" />

      {/* Title area */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="animate-shimmer h-6 w-24 rounded-full" />
          <div className="animate-shimmer h-5 w-16 rounded" />
        </div>
        <div className="mb-3 space-y-2">
          <div className="animate-shimmer h-7 w-5/6 rounded" />
          <div className="animate-shimmer h-7 w-2/3 rounded" />
        </div>
        <div className="animate-shimmer h-4 w-1/3 rounded" />
      </div>

      {/* Description block */}
      <div className="mb-6 space-y-3 rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
        <div className="animate-shimmer h-5 w-32 rounded" />
        <div className="animate-shimmer h-4 w-full rounded" />
        <div className="animate-shimmer h-4 w-5/6 rounded" />
        <div className="animate-shimmer h-4 w-3/4 rounded" />
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="mb-4 space-y-3 rounded-xl border border-(--tm-color-neutral-100) bg-white p-6"
        >
          <div className="animate-shimmer h-5 w-40 rounded" />
          <div className="animate-shimmer h-4 w-full rounded" />
          <div className="animate-shimmer h-4 w-4/5 rounded" />
        </div>
      ))}
    </div>
  );
}
