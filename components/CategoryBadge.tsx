import type { ReportCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<ReportCategory, string> = {
  policy: "Policy",
  regulation: "Regulation",
  "corporate-decision": "Corporate decision",
  "government-action": "Government action",
  legislation: "Legislation",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: ReportCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-(--tm-color-neutral-100) px-2.5 py-0.5 text-xs font-medium text-(--tm-color-neutral-600)",
        className
      )}
    >
      {labels[category]}
    </span>
  );
}
