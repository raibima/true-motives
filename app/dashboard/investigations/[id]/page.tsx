import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import { getRun } from "workflow/api";
import { getInvestigationById } from "@/lib/mock-data";
import { GenerationProgress } from "@/components/dashboard/GenerationProgress";
import { InvestigationStatusBadge } from "@/components/dashboard/InvestigationStatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { PlaceholderCard } from "@/components/dashboard/PlaceholderCard";
import { ReportSection } from "@/components/dashboard/ReportSection";
import { reportSchema } from "@/lib/report-schema";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowDownToLine,
  Info,
  MapPin,
  MessageCircle,
  Pencil,
  RotateCw,
  Share2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { Investigation } from "@/lib/types";

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

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Investigations
      </Link>

      {/* Investigation header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <InvestigationStatusBadge status={investigation.status} />
          <CategoryBadge
            category={investigation.category}
            className="rounded-md px-2 py-1"
          />
          {investigation.geography && (
            <span className="flex items-center gap-1 text-xs text-(--tm-color-neutral-600)">
              <MapPin className="h-3 w-3" />
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
          Created {formatDate(investigation.createdAt, { month: "long" })}
          {investigation.updatedAt !== investigation.createdAt && (
            <> &middot; Updated {formatDate(investigation.updatedAt, { month: "long" })}</>
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
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-(--tm-color-danger-500)" />
            <div>
              <h2 className="text-sm font-semibold text-(--tm-color-danger-500) mb-1">
                Generation failed
              </h2>
              <p className="text-sm text-(--tm-color-danger-500)/80 mb-4">
                Something went wrong during deep research. Your investigation has been
                saved and you can try generating it again.
              </p>
              <Button variant="destructive" className="h-auto px-4 py-2">
                <RotateCw className="h-4 w-4" />
                <span>Retry generation</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {investigation.status === "draft" && (
        <PlaceholderCard
          icon={<Pencil className="h-5 w-5 text-(--tm-color-neutral-600)" />}
          title="Draft saved"
          description="This investigation hasn't been generated yet. Ready to uncover the true motives?"
          action={
            <Button
              variant="primary"
              className="h-auto px-5 py-2.5 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate motives analysis</span>
            </Button>
          }
        />
      )}

      {investigation.status === "completed" && investigation.report && (
        <div className="space-y-6 animate-fade-in-up stagger-2">
          {/* AI disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50) px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-neutral-600)" />
            <p className="text-xs text-(--tm-color-neutral-600) leading-relaxed">
              This is an AI-assisted motivation analysis. All claims are hypothesis-grade
              unless explicitly marked as verified facts. Always corroborate with
              primary sources before publication.
            </p>
          </div>

          {/* Executive summary */}
          <ReportSection title="Executive summary">
            <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed">
              {investigation.report.executiveSummary}
            </p>
          </ReportSection>

          {/* Motivations */}
          <ReportSection title="Motivation hypotheses">
            <div className="space-y-5">
              {investigation.report.motivations.map((motivation, index) => (
                <div
                  key={index}
                  className="border-l-2 border-(--tm-color-accent-500)/30 pl-4 space-y-2"
                >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-(--tm-color-primary-900)">
                        {motivation.title}
                      </h3>
                      <ConfidenceBadge
                        level={motivation.confidence}
                        className="shrink-0 text-[10px] px-2 py-0.5"
                      />
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
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--tm-color-accent-500)" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </ReportSection>

          {/* Stakeholders */}
          <ReportSection title="Stakeholder map">
            <div className="space-y-4">
              {investigation.report.stakeholders.map((stakeholder, index) => (
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
                      <ConfidenceBadge
                        level={stakeholder.confidence}
                        className="shrink-0 text-[10px] px-2 py-0.5"
                      />
                    </div>
                    <ul className="mt-2 space-y-1">
                      {stakeholder.incentives.map((incentive, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--tm-color-info-500)" />
                          {incentive}
                        </li>
                      ))}
                    </ul>
                </div>
              ))}
            </div>
          </ReportSection>

          {/* Assumptions & Limitations */}
          <div className="grid grid-cols-2 gap-4">
            <ReportSection title="Assumptions" headingSize="base">
              <ul className="space-y-2">
                {investigation.report.assumptions.map((assumption, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--tm-color-neutral-300)" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </ReportSection>
            <ReportSection title="Limitations" headingSize="base">
              <ul className="space-y-2">
                {investigation.report.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--tm-color-neutral-300)" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </ReportSection>
          </div>

          {/* Alternative explanations */}
          {investigation.report.alternativeExplanations.length > 0 && (
            <ReportSection title="Alternative explanations" headingSize="base">
              <ul className="space-y-2.5">
                {investigation.report.alternativeExplanations.map((alt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-(--tm-color-neutral-50) px-3 py-2.5 text-sm text-(--tm-color-neutral-600)"
                  >
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-neutral-300)" />
                    {alt}
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 pb-8">
            <Button variant="outline">
              <Pencil className="h-4 w-4" />
              <span>Edit notes</span>
            </Button>
            <Button variant="outline">
              <ArrowDownToLine className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button variant="primary">
              <Share2 className="h-4 w-4" />
              <span>Publish to library</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
