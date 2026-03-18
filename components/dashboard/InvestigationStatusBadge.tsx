import type { InvestigationStatus } from "@/shared/types";

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

export function InvestigationStatusBadge({
  status,
  className,
}: {
  status: InvestigationStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={["h-1.5 w-1.5 rounded-full", config.dotClassName].join(" ")}
      />
      {config.label}
    </span>
  );
}
