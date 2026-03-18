import { Suspense } from "react";
import { ReportCard } from "@/components/ReportCard";
import { ReportFilters } from "@/components/ReportFilters";
import { filterReports } from "@/server/mock-data";

export const metadata = {
  title: "Browse reports — TrueMotives",
  description:
    "Explore AI-powered motivation analyses of public policies, government decisions, and corporate actions.",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const geography =
    typeof params.geography === "string" ? params.geography : undefined;

  const reports = filterReports({ query, category, geography });

  const hasActiveFilters = query || category || geography;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-(--tm-color-primary-900)">
          Report library
        </h1>
        <p className="mt-2 text-sm text-(--tm-color-neutral-600)">
          Browse investigations into the motivations behind major global
          decisions. Filter by topic, region, or category.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg border border-(--tm-color-neutral-100) bg-white p-4">
        <Suspense>
          <ReportFilters />
        </Suspense>
      </div>

      {/* Results */}
      {reports.length > 0 ? (
        <>
          <p className="mb-4 text-xs font-medium text-(--tm-color-neutral-600)">
            {reports.length} report{reports.length !== 1 && "s"}
            {hasActiveFilters && " matching your filters"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, i) => (
              <ReportCard
                key={report.slug}
                report={report}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-(--tm-color-neutral-300) bg-white px-8 py-16 text-center">
          <svg
            className="h-8 w-8 text-(--tm-color-neutral-300)"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <p className="text-sm font-medium text-(--tm-color-neutral-600)">
            No reports match your filters
          </p>
          <p className="text-xs text-(--tm-color-neutral-300)">
            Try broadening your search or removing filters.
          </p>
        </div>
      )}
    </div>
  );
}
