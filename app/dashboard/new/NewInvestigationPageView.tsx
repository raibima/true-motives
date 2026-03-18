"use client";

import { useFormStatus } from "react-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Select, SelectItem } from "@/components/ui/Select";
import { Form } from "@/components/ui/Form";
import { Label } from "@/components/ui/Field";
import { TextField as AriaTextField, TextArea as AriaTextArea } from "react-aria-components";
import { useNewInvestigation, type Step } from "@/hooks/use-new-investigation";
import type { InvestigationWorkflowInput } from "@/lib/investigations/schema";

const STEPS: ReadonlyArray<{ key: Step; label: string }> = [
  { key: "prompt", label: "Describe" },
  { key: "review", label: "Review plan" },
  { key: "launch", label: "Launch" },
];

const CATEGORIES = [
  { value: "policy", label: "Public policy" },
  { value: "regulation", label: "Regulation" },
  { value: "corporate-decision", label: "Corporate decision" },
  { value: "government-action", label: "Government action" },
  { value: "legislation", label: "Legislation" },
  {
    value: "culture-and-society",
    label: "Culture, sports & public narratives",
  },
];

const PROMPT_PLACEHOLDER =
  "e.g. I want to understand the real incentives behind recent EU enforcement actions " +
  "around the Digital Markets Act, especially how large tech platforms and national " +
  "regulators are shaping the timeline and scope of implementation.";

const PLAN_FEATURES = [
  "Proposed title and 1–3 sentence summary",
  "Issue category and geography inferred from your description",
  "Customized research phases tailored to your investigation",
  "Review screen where you can tweak everything before running",
];

function GeneratePlanButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      isPending={pending}
      className="h-auto px-5 py-2.5 font-semibold"
    >
      <Sparkles className="h-4 w-4" />
      <span>Generate AI plan</span>
    </Button>
  );
}

export function NewInvestigationPageView() {
  const {
    state,
    remainingCharacters,
    isStartPending,
    generatePlanAction,
    handleStartInvestigation,
    setPrompt,
    editPlan,
    proceedToLaunch,
    resetToPrompt,
    backToReview,
  } = useNewInvestigation();

  const { step, prompt, promptError, planError, startError, plannedInput } = state;

  return (
    <div className="px-8 py-8 max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Investigations
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-(--tm-color-primary-900) mb-2">
          New investigation
        </h1>
        <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed">
          Start with a single description of what you want to investigate. TrueMotives will
          infer the structured fields for you, then let you review before launching deep research.
        </p>
      </div>

      <ProgressStepper steps={STEPS} currentStep={step} className="mb-8" />

      {step === "prompt" && (
        <Form action={generatePlanAction} className="space-y-6">
          <AriaTextField
            name="prompt"
            value={prompt}
            onChange={setPrompt}
            className="space-y-2"
          >
            <Label className="block font-semibold text-(--tm-color-primary-900)">
              What do you want to investigate?
              <span className="ml-1 text-(--tm-color-danger-500)">*</span>
            </Label>
            <p className="text-xs text-(--tm-color-neutral-600)">
              Write a short brief in your own words — the decision, policy, pattern, or situation
              you want to understand, plus any hints about who&apos;s involved.
            </p>
            <AriaTextArea
              rows={8}
              placeholder={PROMPT_PLACEHOLDER}
              className="w-full rounded-xl border border-(--tm-color-neutral-100) bg-white/80 px-3.5 py-3 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/40 resize-none leading-relaxed shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
            />
            <div className="flex items-center justify-between text-[11px] text-(--tm-color-neutral-400)">
              <span>
                Try including: key actors, geography, time horizon, and what you&apos;re suspicious about.
              </span>
              <span
                className={
                  remainingCharacters < 0
                    ? "font-medium text-(--tm-color-danger-500)"
                    : "font-mono"
                }
              >
                {remainingCharacters} chars left
              </span>
            </div>
            {promptError && (
              <p className="text-xs text-(--tm-color-danger-500)">{promptError}</p>
            )}
          </AriaTextField>

          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-linear-to-br from-(--tm-color-neutral-50) via-white to-(--tm-color-neutral-50) p-4">
            <p className="text-[11px] font-semibold text-(--tm-color-primary-900) mb-2.5 uppercase tracking-wide">
              AI-drafted investigation plan
            </p>
            <ul className="space-y-1.5">
              {PLAN_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--tm-color-success-500)" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <GeneratePlanButton />
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors"
            >
              Cancel
            </Link>
          </div>

          <p className="text-xs text-(--tm-color-neutral-300)">
            The full investigation usually completes in 60–120 seconds once you start it. You can
            navigate away and return — the process continues in the background.
          </p>
          {planError && (
            <p className="text-xs text-(--tm-color-danger-500) mt-1">{planError}</p>
          )}
        </Form>
      )}

      {step === "review" && plannedInput && (
        <div className="space-y-6">
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--tm-color-neutral-400)">
                  AI-generated draft
                </p>
                <p className="text-xs text-(--tm-color-neutral-600)">
                  Review and adjust anything before moving on.
                </p>
              </div>
              <Button
                variant="quiet"
                onPress={resetToPrompt}
                className="text-xs font-medium underline underline-offset-4"
              >
                Refine prompt instead
              </Button>
            </div>

            <div className="space-y-4">
              <TextField
                label="Title"
                value={plannedInput.title}
                onChange={(value) => editPlan({ title: value })}
              />

              <TextAreaField
                label="Short description"
                rows={3}
                value={plannedInput.description ?? ""}
                onChange={(value) => editPlan({ description: value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Issue type"
                  selectedKey={plannedInput.category}
                  onSelectionChange={(key) =>
                    editPlan({ category: key as InvestigationWorkflowInput["category"] })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} id={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </Select>

                <TextField
                  label="Geography"
                  value={plannedInput.geography || "Global"}
                  onChange={(value) => editPlan({ geography: value })}
                />
              </div>
            </div>
          </div>

          {plannedInput.phases && plannedInput.phases.length > 0 && (
            <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-(--tm-color-neutral-400) mb-3">
                Planned research phases
              </p>
              <p className="text-xs text-(--tm-color-neutral-600) mb-4">
                The AI will follow this customized research plan. Phases may be adjusted during the investigation if new angles emerge.
              </p>
              <ol className="space-y-2.5">
                {plannedInput.phases.map((phase, index) => (
                  <li key={phase.id} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--tm-color-neutral-50) text-[10px] font-semibold text-(--tm-color-neutral-600) ring-1 ring-inset ring-(--tm-color-neutral-100) mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--tm-color-primary-900)">
                        {phase.label}
                      </p>
                      <p className="text-xs text-(--tm-color-neutral-600) mt-0.5">
                        {phase.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Button
              onPress={proceedToLaunch}
              variant="primary"
              className="h-auto px-5 py-2.5 font-semibold"
            >
              Continue
            </Button>
            <Button
              variant="quiet"
              onPress={resetToPrompt}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {step === "launch" && plannedInput && (
        <div className="space-y-6">
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-5 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-(--tm-color-neutral-400) mb-3">
                Investigation summary
              </p>
              <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-1">
                {plannedInput.title}
              </h2>
              {plannedInput.description && (
                <p className="text-sm text-(--tm-color-neutral-600) leading-relaxed">
                  {plannedInput.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center rounded-md bg-(--tm-color-neutral-50) px-2.5 py-1 font-medium text-(--tm-color-neutral-600) ring-1 ring-inset ring-(--tm-color-neutral-100)">
                {CATEGORIES.find((c) => c.value === plannedInput.category)?.label ?? plannedInput.category}
              </span>
              <span className="inline-flex items-center rounded-md bg-(--tm-color-neutral-50) px-2.5 py-1 font-medium text-(--tm-color-neutral-600) ring-1 ring-inset ring-(--tm-color-neutral-100)">
                {plannedInput.geography || "Global"}
              </span>
            </div>

            {plannedInput.phases && plannedInput.phases.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--tm-color-neutral-400) mb-2">
                  Research plan — {plannedInput.phases.length} phases
                </p>
                <div className="flex flex-wrap gap-2">
                  {plannedInput.phases.map((phase, index) => (
                    <span
                      key={phase.id}
                      className="inline-flex items-center gap-1.5 rounded-md bg-(--tm-color-neutral-50) px-2.5 py-1 text-xs font-medium text-(--tm-color-neutral-600) ring-1 ring-inset ring-(--tm-color-neutral-100)"
                    >
                      <span className="text-(--tm-color-neutral-300)">{index + 1}.</span>
                      {phase.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-(--tm-color-neutral-400) leading-relaxed">
            The investigation usually completes in 60–120 seconds. You can navigate away and return
            — the process continues in the background.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Button
              isPending={isStartPending}
              onPress={handleStartInvestigation}
              className="bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) pressed:bg-(--tm-color-primary-600) h-auto px-5 py-2.5 font-semibold shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start investigation</span>
            </Button>
            <Button
              variant="quiet"
              onPress={backToReview}
            >
              Back
            </Button>
          </div>

          {startError && (
            <p className="text-xs text-(--tm-color-danger-500) mt-1">{startError}</p>
          )}
        </div>
      )}
    </div>
  );
}
