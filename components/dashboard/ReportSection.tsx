import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

export interface ReportSectionProps {
  title: string;
  children: ReactNode;
  /** Use "base" for smaller headings (e.g. Assumptions). @default "lg" */
  headingSize?: "lg" | "base";
  className?: string;
}

export function ReportSection({
  title,
  children,
  headingSize = "lg",
  className,
}: ReportSectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-(--tm-color-neutral-100) bg-white p-6",
        className,
      )}
    >
      <h2
        className={cn(
          "font-serif font-semibold text-(--tm-color-primary-900)",
          headingSize === "lg" ? "text-lg mb-5" : "text-base mb-4",
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
