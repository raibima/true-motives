import { Link } from "@/components/ui/Link";
import type { Investigation, InvestigationStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  InvestigationStatus,
  { label: string; className: string; dotClassName: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-(--tm-color-success-100) text-(--tm-color-success-500)",
    dotClassName: "bg-(--tm-color-success-500)",
  },
  generating: {
    label: "Generating",
    className: "bg-(--tm-color-accent-400)/15 text-(--tm-color-accent-700)",
    dotClassName: "bg-(--tm-color-accent-500) animate-pulse",
  },
  draft: {
    label: "Draft",
    className: "bg-(--tm-color-neutral-100) text-(--tm-color-neutral-600)",
    dotClassName: "bg-(--tm-color-neutral-300)",
  },
  failed: {
    label: "Failed",
    className: "bg-(--tm-color-danger-100) text-(--tm-color-danger-500)",
    dotClassName: "bg-(--tm-color-danger-500)",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  policy: "Policy",
  regulation: "Regulation",
  "corporate-decision": "Corporate",
  "government-action": "Government",
  legislation: "Legislation",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvestigationCard({
  investigation,
  animationClass,
}: {
  investigation: Investigation;
  animationClass?: string;
}) {
  const status = STATUS_CONFIG[investigation.status];

  return (
    <Link
      href={`/dashboard/investigations/${investigation.id}`}
      className={[
        "group block rounded-xl border border-(--tm-color-neutral-100) bg-white p-5 transition-all",
        "hover:border-(--tm-color-primary-600)/30 hover:shadow-sm hover:-translate-y-px",
        "animate-fade-in-up",
        animationClass ?? "",
      ].join(" ")}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-semibold leading-snug text-(--tm-color-primary-900) group-hover:text-(--tm-color-primary-600) transition-colors line-clamp-2">
            {investigation.title}
          </h3>
        </div>
        {/* Status badge */}
        <span
          className={[
            "flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            status.className,
          ].join(" ")}
        >
          <span className={["h-1.5 w-1.5 rounded-full", status.dotClassName].join(" ")} />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed line-clamp-2 mb-4">
        {investigation.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center rounded-md bg-(--tm-color-neutral-100) px-2 py-0.5 text-xs font-medium text-(--tm-color-neutral-600)">
          {CATEGORY_LABELS[investigation.category] ?? investigation.category}
        </span>
        {investigation.geography && (
          <span className="inline-flex items-center gap-1 text-xs text-(--tm-color-neutral-600)">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {investigation.geography}
          </span>
        )}
        <span className="ml-auto text-xs text-(--tm-color-neutral-300)">
          {formatDate(investigation.updatedAt)}
        </span>
      </div>

      {/* Generating progress hint */}
      {investigation.status === "generating" && investigation.generationProgress && (
        <div className="mt-3 pt-3 border-t border-(--tm-color-neutral-100)">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-(--tm-color-accent-700)">
              Generating report…
            </span>
            <span className="text-xs font-mono text-(--tm-color-neutral-600)">
              {investigation.generationProgress.percentage}%
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-(--tm-color-neutral-100)">
            <div
              className="h-full rounded-full bg-(--tm-color-accent-500) transition-all duration-700"
              style={{ width: `${investigation.generationProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
