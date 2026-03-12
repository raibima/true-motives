import type { ConfidenceLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<ConfidenceLevel, string> = {
  high: "bg-(--tm-color-success-100) text-(--tm-color-success-500)",
  medium: "bg-(--tm-color-info-100) text-(--tm-color-info-500)",
  low: "bg-(--tm-color-danger-100) text-(--tm-color-danger-500)",
};

const labels: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export function ConfidenceBadge({
  level,
  className,
}: {
  level: ConfidenceLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}
