import { Link } from "@/components/ui/Link";
import { getInvestigations } from "@/server/mock-data";
import { InvestigationCard } from "@/components/dashboard/InvestigationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { StatusTabs } from "@/components/dashboard/StatusTabs";
import type { InvestigationStatus } from "@/shared/types";

const VALID_STATUSES: (InvestigationStatus | "all")[] = [
  "all",
  "completed",
  "generating",
  "draft",
  "failed",
];

function parseStatus(
  status: string | string[] | undefined,
): InvestigationStatus | "all" {
  if (
    typeof status === "string" &&
    VALID_STATUSES.includes(status as InvestigationStatus | "all")
  ) {
    return status as InvestigationStatus | "all";
  }
  return "all";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = parseStatus(params.status);
  const allInvestigations = getInvestigations();
  const investigations =
    statusFilter === "all"
      ? allInvestigations
      : allInvestigations.filter((i) => i.status === statusFilter);

  return (
    <div className="px-8 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-(--tm-color-primary-900) mb-1">
            Investigations
          </h1>
          <p className="text-sm text-(--tm-color-neutral-600)">
            Your recent investigations will appear here.
          </p>
        </div>
        <Link href="/dashboard/new" variant="button">
          <PlusIcon />
          New investigation
        </Link>
      </div>

      {/* Status filter tabs */}
      <StatusTabs investigations={allInvestigations} selectedKey={statusFilter}>
        {/* Generating alert */}
        {investigations.some((i) => i.status === "generating") && (
          <StatusBanner
            variant="accent"
            className="mb-6"
            action={
              <Link
                href={`/dashboard/investigations/${investigations.find((i) => i.status === "generating")?.id}`}
                variant="plain"
                className="text-xs font-semibold text-(--tm-color-accent-700) hover:text-(--tm-color-accent-500) transition-colors"
              >
                View progress →
              </Link>
            }
          >
            <span className="font-semibold">Deep research running</span> &mdash;{" "}
            {investigations
              .filter((i) => i.status === "generating")
              .map((i) => i.title)
              .join(", ")}
          </StatusBanner>
        )}

        {/* Investigations grid */}
        {investigations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {investigations.map((investigation, index) => (
              <InvestigationCard
                key={investigation.id}
                investigation={investigation}
                animationClass={`stagger-${Math.min(index + 1, 6)}`}
              />
            ))}
          </div>
        )}
      </StatusTabs>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
