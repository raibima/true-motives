import { notFound } from "next/navigation";
import Link from "next/link";
import { getRun } from "workflow/api";
import { getInvestigationById } from "@/lib/mock-data";
import { GenerationProgress } from "@/components/dashboard/GenerationProgress";
import { reportSchema } from "@/lib/report-schema";
import type { ConfidenceLevel, Investigation, InvestigationStatus } from "@/lib/types";

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

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { label: string; className: string }
> = {
  high: {
    label: "High confidence",
    className: "bg-(--tm-color-success-100) text-(--tm-color-success-500)",
  },
  medium: {
    label: "Medium confidence",
    className: "bg-(--tm-color-accent-400)/15 text-(--tm-color-accent-700)",
  },
  low: {
    label: "Low confidence",
    className: "bg-(--tm-color-neutral-100) text-(--tm-color-neutral-600)",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  policy: "Policy",
  regulation: "Regulation",
  "corporate-decision": "Corporate Decision",
  "government-action": "Government Action",
  legislation: "Legislation",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function InvestigationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isMockInvestigation = id.startsWith("inv-");

  let investigation: Investigation | null = null;

  if (isMockInvestigation) {
    investigation = getInvestigationById(id) ?? null;
    if (!investigation) {
      notFound();
    }
  } else {
    const run = getRun(id);
    if (!(await run.exists)) {
      notFound();
    }

    const runStatus = await run.status;
    const createdAt = (await run.createdAt).toISOString();
    const completedAt = (await run.completedAt)?.toISOString();

    if (runStatus === "completed") {
      const report = reportSchema.parse(await run.returnValue);
      investigation = {
        id,
        title: report.title,
        description: report.summary,
        status: "completed",
        category: report.category,
        geography: report.geography,
        createdAt,
        updatedAt: completedAt ?? createdAt,
        report,
      };
    } else if (runStatus === "failed" || runStatus === "cancelled") {
      investigation = {
        id,
        title: `Investigation ${id}`,
        description:
          "This workflow run did not complete successfully. You can retry with a new investigation.",
        status: "failed",
        category: "policy",
        geography: "Global",
        createdAt,
        updatedAt: completedAt ?? createdAt,
      };
    } else {
      investigation = {
        id,
        title: `Investigation ${id}`,
        description:
          "Deep research is currently running. Live progress will stream below.",
        status: "generating",
        category: "policy",
        geography: "Global",
        createdAt,
        updatedAt: createdAt,
      };
    }
  }

  if (!investigation) {
    notFound();
  }

  const status = STATUS_CONFIG[investigation.status];

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors mb-6"
      >
        <svg
          className="h-3.5 w-3.5"
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
        Investigations
      </Link>

      {/* Investigation header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              status.className,
            ].join(" ")}
          >
            <span
              className={["h-1.5 w-1.5 rounded-full", status.dotClassName].join(" ")}
            />
            {status.label}
          </span>
          <span className="rounded-md bg-(--tm-color-neutral-100) px-2 py-1 text-xs font-medium text-(--tm-color-neutral-600)">
            {CATEGORY_LABELS[investigation.category] ?? investigation.category}
          </span>
          {investigation.geography && (
            <span className="flex items-center gap-1 text-xs text-(--tm-color-neutral-600)">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              {investigation.geography}
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl font-semibold leading-snug text-(--tm-color-primary-900) mb-2">
          {investigation.title}
        </h1>

        <p className="text-sm text-(--tm-color-neutral-600) mb-3 leading-relaxed">
          {investigation.description}
        </p>

        <p className="text-xs text-(--tm-color-neutral-300)">
          Created {formatDate(investigation.createdAt)}
          {investigation.updatedAt !== investigation.createdAt && (
            <> &middot; Updated {formatDate(investigation.updatedAt)}</>
          )}
        </p>
      </div>

      {/* Conditional content based on status */}
      {investigation.status === "generating" && (
        <div className="animate-fade-in-up stagger-2">
          <GenerationProgress runId={id} />
        </div>
      )}

      {investigation.status === "failed" && (
        <div className="animate-fade-in-up stagger-2 rounded-xl border border-(--tm-color-danger-500)/30 bg-(--tm-color-danger-100)/60 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-(--tm-color-danger-500)"
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
            <div>
              <h2 className="text-sm font-semibold text-(--tm-color-danger-500) mb-1">
                Generation failed
              </h2>
              <p className="text-sm text-(--tm-color-danger-500)/80 mb-4">
                Something went wrong during deep research. Your investigation has been
                saved and you can try generating it again.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-danger-500) px-4 py-2 text-sm font-semibold text-white hover:bg-(--tm-color-danger-500)/90 transition-colors"
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Retry generation
              </button>
            </div>
          </div>
        </div>
      )}

      {investigation.status === "draft" && (
        <div className="animate-fade-in-up stagger-2 rounded-xl border border-(--tm-color-neutral-100) bg-white p-6 text-center">
          <div className="mb-3 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--tm-color-neutral-100)">
              <svg
                className="h-5 w-5 text-(--tm-color-neutral-600)"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                />
              </svg>
            </div>
          </div>
          <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-2">
            Draft saved
          </h2>
          <p className="text-sm text-(--tm-color-neutral-600) mb-5">
            This investigation hasn&apos;t been generated yet. Ready to uncover the
            true motives?
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--tm-color-primary-800) transition-colors shadow-sm"
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
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            </svg>
            Generate motives analysis
          </button>
        </div>
      )}

      {investigation.status === "completed" && investigation.report && (
        <div className="space-y-6 animate-fade-in-up stagger-2">
          {/* AI disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50) px-4 py-3">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-(--tm-color-neutral-600)"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            <p className="text-xs text-(--tm-color-neutral-600) leading-relaxed">
              This is an AI-assisted motivation analysis. All claims are hypothesis-grade
              unless explicitly marked as verified facts. Always corroborate with
              primary sources before publication.
            </p>
          </div>

          {/* Executive summary */}
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-4">
              Executive summary
            </h2>
            <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed">
              {investigation.report.executiveSummary}
            </p>
          </div>

          {/* Motivations */}
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-5">
              Motivation hypotheses
            </h2>
            <div className="space-y-5">
              {investigation.report.motivations.map((motivation, index) => {
                const conf = CONFIDENCE_CONFIG[motivation.confidence];
                return (
                  <div
                    key={index}
                    className="border-l-2 border-(--tm-color-accent-500)/30 pl-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-(--tm-color-primary-900)">
                        {motivation.title}
                      </h3>
                      <span
                        className={[
                          "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          conf.className,
                        ].join(" ")}
                      >
                        {conf.label}
                      </span>
                    </div>
                    <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed">
                      {motivation.summary}
                    </p>
                    {motivation.supportingEvidence.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {motivation.supportingEvidence.map((ev, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)"
                          >
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--tm-color-accent-500)" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stakeholders */}
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-5">
              Stakeholder map
            </h2>
            <div className="space-y-4">
              {investigation.report.stakeholders.map((stakeholder, index) => {
                const conf = CONFIDENCE_CONFIG[stakeholder.confidence];
                return (
                  <div
                    key={index}
                    className="rounded-lg border border-(--tm-color-neutral-100) p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-(--tm-color-primary-900)">
                          {stakeholder.name}
                        </h3>
                        <p className="text-xs text-(--tm-color-neutral-600) mt-0.5">
                          {stakeholder.role}
                        </p>
                      </div>
                      <span
                        className={[
                          "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          conf.className,
                        ].join(" ")}
                      >
                        {conf.label}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {stakeholder.incentives.map((incentive, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)"
                        >
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--tm-color-info-500)" />
                          {incentive}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assumptions & Limitations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
              <h2 className="font-serif text-base font-semibold text-(--tm-color-primary-900) mb-4">
                Assumptions
              </h2>
              <ul className="space-y-2">
                {investigation.report.assumptions.map((assumption, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--tm-color-neutral-300)" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
              <h2 className="font-serif text-base font-semibold text-(--tm-color-primary-900) mb-4">
                Limitations
              </h2>
              <ul className="space-y-2">
                {investigation.report.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--tm-color-neutral-300)" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alternative explanations */}
          {investigation.report.alternativeExplanations.length > 0 && (
            <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
              <h2 className="font-serif text-base font-semibold text-(--tm-color-primary-900) mb-4">
                Alternative explanations
              </h2>
              <ul className="space-y-2.5">
                {investigation.report.alternativeExplanations.map((alt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-(--tm-color-neutral-50) px-3 py-2.5 text-sm text-(--tm-color-neutral-600)"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-(--tm-color-neutral-300)"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                      />
                    </svg>
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-3 pt-2 pb-8">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-(--tm-color-neutral-100) bg-white px-4 py-2 text-sm font-medium text-(--tm-color-neutral-600) hover:bg-(--tm-color-neutral-50) hover:text-(--tm-color-primary-900) transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                />
              </svg>
              Edit notes
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-(--tm-color-neutral-100) bg-white px-4 py-2 text-sm font-medium text-(--tm-color-neutral-600) hover:bg-(--tm-color-neutral-50) hover:text-(--tm-color-primary-900) transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
              Publish to library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
