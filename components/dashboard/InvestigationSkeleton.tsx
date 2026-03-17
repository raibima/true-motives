export function InvestigationCardSkeleton() {
  return (
    <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded animate-shimmer" />
          <div className="h-4 w-1/2 rounded animate-shimmer" />
        </div>
        <div className="h-6 w-20 rounded-full animate-shimmer flex-shrink-0" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3.5 w-full rounded animate-shimmer" />
        <div className="h-3.5 w-5/6 rounded animate-shimmer" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-5 w-20 rounded-md animate-shimmer" />
        <div className="h-3.5 w-24 rounded animate-shimmer" />
        <div className="ml-auto h-3.5 w-16 rounded animate-shimmer" />
      </div>
    </div>
  );
}

export function InvestigationDetailSkeleton() {
  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Back link */}
      <div className="h-4 w-32 rounded animate-shimmer mb-6" />

      {/* Title area */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-24 rounded-full animate-shimmer" />
          <div className="h-5 w-16 rounded animate-shimmer" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-7 w-5/6 rounded animate-shimmer" />
          <div className="h-7 w-2/3 rounded animate-shimmer" />
        </div>
        <div className="h-4 w-1/3 rounded animate-shimmer" />
      </div>

      {/* Description block */}
      <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6 mb-6 space-y-3">
        <div className="h-5 w-32 rounded animate-shimmer" />
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-4 w-5/6 rounded animate-shimmer" />
        <div className="h-4 w-3/4 rounded animate-shimmer" />
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6 mb-4 space-y-3">
          <div className="h-5 w-40 rounded animate-shimmer" />
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-4/5 rounded animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
