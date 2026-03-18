import { Link } from "@/components/ui/Link";
import { formatDate } from "@/shared/utils";
import type { Report } from "@/shared/types";
import { CategoryBadge } from "./CategoryBadge";

export function ReportCard({
  report,
  className,
}: {
  report: Report;
  className?: string;
}) {
  return (
    <Link
      href={`/reports/${report.slug}`}
      className={`group relative block rounded-lg border border-(--tm-color-neutral-100) bg-white p-5 transition-all duration-200 hover:border-(--tm-color-neutral-300) hover:shadow-md ${className ?? ""}`}
    >
      {report.featured && (
        <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-(--tm-color-accent-500)" />
      )}

      <div className="flex items-center gap-2 text-xs text-(--tm-color-neutral-600)">
        <CategoryBadge category={report.category} />
        <span aria-hidden>·</span>
        <span>{report.geography}</span>
        <span aria-hidden>·</span>
        <time dateTime={report.publishedAt}>{formatDate(report.publishedAt)}</time>
      </div>

      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-(--tm-color-primary-900) group-hover:text-(--tm-color-primary-600) transition-colors line-clamp-2">
        {report.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-(--tm-color-neutral-600) line-clamp-2">
        {report.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {report.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded bg-(--tm-color-primary-100) px-2 py-0.5 text-[11px] font-medium text-(--tm-color-primary-600)"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
