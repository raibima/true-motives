import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { getReportBySlug, REPORTS } from "@/lib/mock-data";
import type { Stakeholder, MotivationHypothesis, EvidenceItem } from "@/lib/types";

export async function generateStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) return { title: "Report not found — TrueMotives" };
  return {
    title: `${report.title} — TrueMotives`,
    description: report.summary,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function StakeholderCard({ stakeholder }: { stakeholder: Stakeholder }) {
  return (
    <div className="rounded-lg border border-(--tm-color-neutral-100) bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-(--tm-color-primary-900)">
            {stakeholder.name}
          </h4>
          <p className="mt-0.5 text-sm text-(--tm-color-neutral-600)">
            {stakeholder.role}
          </p>
        </div>
        <ConfidenceBadge level={stakeholder.confidence} className="shrink-0" />
      </div>
      <ul className="mt-3 space-y-1.5">
        {stakeholder.incentives.map((inc, i) => (
          <li key={i} className="flex gap-2 text-sm text-(--tm-color-neutral-900)">
            <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-(--tm-color-accent-500)" />
            {inc}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MotivationCard({ motivation }: { motivation: MotivationHypothesis }) {
  return (
    <div className="relative rounded-lg border border-(--tm-color-neutral-100) bg-white p-5">
      <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-(--tm-color-accent-500)" />
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-serif text-lg font-semibold text-(--tm-color-primary-900)">
          {motivation.title}
        </h4>
        <ConfidenceBadge level={motivation.confidence} className="shrink-0" />
      </div>
      <p className="mt-2 font-serif text-[15px] leading-relaxed text-(--tm-color-neutral-900)">
        {motivation.summary}
      </p>
      {motivation.supportingEvidence.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-(--tm-color-neutral-600)">
            Supporting evidence
          </p>
          <ul className="mt-2 space-y-1.5">
            {motivation.supportingEvidence.map((ev, i) => (
              <li key={i} className="flex gap-2 text-sm text-(--tm-color-neutral-600)">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-info-500)"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.03a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.344 8.25"
                  />
                </svg>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EvidenceRow({ item }: { item: EvidenceItem }) {
  const confidenceLabel =
    item.confidence === "high"
      ? "High"
      : item.confidence === "medium"
      ? "Medium"
      : "Low";

  const confidenceColor =
    item.confidence === "high"
      ? "text-(--tm-color-success-500)"
      : item.confidence === "medium"
      ? "text-(--tm-color-info-500)"
      : "text-(--tm-color-danger-500)";

  return (
    <div className="border-b border-(--tm-color-neutral-100) py-4 last:border-b-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-(--tm-color-neutral-600)">
        <span className={confidenceColor}>{confidenceLabel}</span>{" "}
        <span className="text-(--tm-color-neutral-400)">confidence</span>
      </p>
      <p className="mt-1 text-sm leading-relaxed text-(--tm-color-neutral-900)">
        {item.claim}
      </p>
      <p className="mt-1 text-xs text-(--tm-color-neutral-600)">
        Source:{" "}
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--tm-color-info-500) underline underline-offset-2 hover:text-(--tm-color-info-500)/80 transition-colors"
        >
          {item.source}
        </a>
      </p>
    </div>
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="grain-overlay min-h-screen">
      <SiteHeader />

      {/* Back link */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-(--tm-color-neutral-600) transition-colors hover:text-(--tm-color-primary-900)"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to reports
        </Link>
      </div>

      {/* Report sheet */}
      <article className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white shadow-sm">
          {/* Report header */}
          <div className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12 sm:py-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-(--tm-color-neutral-600)">
              <CategoryBadge category={report.category} />
              <span aria-hidden>·</span>
              <span>{report.geography}</span>
              <span aria-hidden>·</span>
              <time dateTime={report.publishedAt}>
                {formatDate(report.publishedAt)}
              </time>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-snug tracking-tight text-(--tm-color-primary-900) sm:text-4xl sm:leading-snug">
              {report.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-(--tm-color-primary-100) px-2 py-0.5 text-[11px] font-medium text-(--tm-color-primary-600)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-b border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50) px-8 py-3 sm:px-12">
            <p className="text-xs italic text-(--tm-color-neutral-600)">
              This is an AI-assisted analysis, not definitive fact. It is
              intended as a starting point for investigation. All hypotheses
              should be independently verified.
            </p>
          </div>

          {/* Executive summary */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Executive summary
            </h2>
            <p className="mt-4 font-serif text-base leading-[1.8] text-(--tm-color-neutral-900)">
              {report.executiveSummary}
            </p>
          </section>

          {/* Core motivations */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Core motivation hypotheses
            </h2>
            <p className="mt-1 text-xs text-(--tm-color-neutral-600)">
              Ranked by assessed plausibility. Each hypothesis includes
              supporting evidence and a confidence level.
            </p>
            <div className="mt-6 space-y-4">
              {report.motivations.map((m, i) => (
                <MotivationCard key={i} motivation={m} />
              ))}
            </div>
          </section>

          {/* Stakeholder map */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Stakeholder map &amp; incentives
            </h2>
            <p className="mt-1 text-xs text-(--tm-color-neutral-600)">
              Key actors identified in this analysis, with their assessed roles
              and incentives.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {report.stakeholders.map((s, i) => (
                <StakeholderCard key={i} stakeholder={s} />
              ))}
            </div>
          </section>

          {/* Evidence and citations */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Evidence &amp; citations
            </h2>
            <p className="mt-1 text-xs text-(--tm-color-neutral-600)">
              Sourced claims supporting the analysis. Confidence reflects source
              reliability and corroboration.
            </p>
            <div>
              {report.evidence.map((ev, i) => (
                <EvidenceRow key={i} item={ev} />
              ))}
            </div>
          </section>

          {/* Assumptions */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Key assumptions
            </h2>
            <ul className="mt-4 space-y-2">
              {report.assumptions.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-(--tm-color-neutral-900)">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-(--tm-color-neutral-100) text-[10px] font-bold text-(--tm-color-neutral-600)">
                    A
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          {/* Alternative explanations */}
          <section className="border-b border-(--tm-color-neutral-100) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Alternative explanations
            </h2>
            <p className="mt-1 text-xs text-(--tm-color-neutral-600)">
              Plausible alternative motivations that should be considered.
            </p>
            <ul className="mt-4 space-y-2">
              {report.alternativeExplanations.map((alt, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-(--tm-color-neutral-900)">
                  <span className="mt-0.5 text-(--tm-color-neutral-300)">
                    {i + 1}.
                  </span>
                  {alt}
                </li>
              ))}
            </ul>
          </section>

          {/* Limitations */}
          <section className="rounded-b-xl bg-(--tm-color-neutral-50) px-8 py-8 sm:px-12">
            <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
              Limitations &amp; uncertainty
            </h2>
            <ul className="mt-4 space-y-2">
              {report.limitations.map((lim, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-(--tm-color-neutral-600)">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-danger-500)"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  {lim}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-(--tm-color-neutral-300) bg-white px-8 py-10 text-center">
          <h3 className="font-serif text-lg font-semibold text-(--tm-color-primary-900)">
            Investigate your own topic
          </h3>
          <p className="max-w-md text-sm text-(--tm-color-neutral-600)">
            Generate custom motivation analyses on any public policy, government
            decision, or corporate action.
          </p>
          <span className="mt-2 inline-flex items-center rounded-lg bg-(--tm-color-primary-800) px-5 py-2 text-sm font-semibold text-white cursor-default opacity-75">
            Coming soon
          </span>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-12 border-t border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50)">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-0.5 rounded-sm bg-(--tm-color-accent-500)" />
            <span className="font-serif text-sm font-semibold text-(--tm-color-primary-900)">
              TrueMotives
            </span>
          </div>
          <p className="text-xs text-(--tm-color-neutral-600)">
            AI-assisted analysis — not definitive fact.
          </p>
        </div>
      </footer>
    </div>
  );
}
