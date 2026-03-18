import Link from "next/link";
import { getInvestigations } from "@/lib/mock-data";
import { InvestigationCard } from "@/components/dashboard/InvestigationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBanner } from "@/components/ui/StatusBanner";
import type { InvestigationStatus } from "@/lib/types";

const STATUS_TABS: { id: InvestigationStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "generating", label: "Generating" },
  { id: "draft", label: "Drafts" },
  { id: "failed", label: "Failed" },
];

export default function DashboardPage() {
  const investigations = getInvestigations();

  return (
    <div className="px-8 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-(--tm-color-primary-900) mb-1">
            Investigations
          </h1>
          <p className="text-sm text-(--tm-color-neutral-600)">
            {investigations.length} total &mdash;{" "}
            {investigations.filter((i) => i.status === "generating").length >
              0 && (
              <>
                <span className="text-(--tm-color-accent-700) font-medium">
                  {
                    investigations.filter((i) => i.status === "generating")
                      .length
                  }{" "}
                  generating now
                </span>
                {` `}&mdash;{` `}
              </>
            )}
            {investigations.filter((i) => i.status === "completed").length}{" "}
            completed
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm"
        >
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
          New investigation
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-(--tm-color-neutral-100) pb-0">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? investigations.length
              : investigations.filter((i) => i.status === tab.id).length;

          return (
            <Link
              key={tab.id}
              href={
                tab.id === "all" ? "/dashboard" : `/dashboard?status=${tab.id}`
              }
              className={[
                "relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                tab.id === "all"
                  ? "border-(--tm-color-primary-900) text-(--tm-color-primary-900)"
                  : "border-transparent text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900)",
              ].join(" ")}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px] font-mono font-semibold",
                    tab.id === "all"
                      ? "bg-(--tm-color-primary-900) text-white"
                      : "bg-(--tm-color-neutral-100) text-(--tm-color-neutral-600)",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Generating alert */}
      {investigations.some((i) => i.status === "generating") && (
        <StatusBanner
          variant="accent"
          className="mb-6"
          action={
            <Link
              href={`/dashboard/investigations/${investigations.find((i) => i.status === "generating")?.id}`}
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
    </div>
  );
}
