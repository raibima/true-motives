import { InvestigationCardSkeleton } from "@/components/dashboard/InvestigationSkeleton";

export default function DashboardLoading() {
  return (
    <div className="px-8 py-8">
      {/* Page header skeleton */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded animate-shimmer" />
          <div className="h-4 w-56 rounded animate-shimmer" />
        </div>
        <div className="h-9 w-40 rounded-lg animate-shimmer" />
      </div>

      {/* Tab skeletons */}
      <div className="flex items-center gap-4 mb-6 border-b border-(--tm-color-neutral-100) pb-3">
        {[80, 90, 95, 70, 70].map((w, i) => (
          <div key={i} className="h-4 rounded animate-shimmer" style={{ width: w }} />
        ))}
      </div>

      {/* Card grid skeletons */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <InvestigationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
