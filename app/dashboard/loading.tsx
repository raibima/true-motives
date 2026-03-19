import {InvestigationCardSkeleton} from '@/components/dashboard/InvestigationSkeleton';

export default function DashboardLoading() {
  return (
    <div className="px-8 py-8">
      {/* Page header skeleton */}
      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-2">
          <div className="animate-shimmer h-7 w-40 rounded" />
          <div className="animate-shimmer h-4 w-56 rounded" />
        </div>
        <div className="animate-shimmer h-9 w-40 rounded-lg" />
      </div>

      {/* Tab skeletons */}
      <div className="mb-6 flex items-center gap-4 border-b border-(--tm-color-neutral-100) pb-3">
        {[80, 90, 95, 70, 70].map((w, i) => (
          <div key={i} className="animate-shimmer h-4 rounded" style={{width: w}} />
        ))}
      </div>

      {/* Card grid skeletons */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {Array.from({length: 4}).map((_, i) => (
          <InvestigationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
