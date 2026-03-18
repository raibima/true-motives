"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Select, SelectItem } from "@/components/ui/Select";
import { Form } from "@/components/ui/Form";
import { Label } from "@/components/ui/Field";
import { TextField as AriaTextField, TextArea as AriaTextArea } from "react-aria-components";
import { generatePlan, startInvestigation } from "@/lib/investigations-api";

import type { InvestigationWorkflowInput } from "@/workflows/investigation/workflow";

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
  "Optional context field capturing constraints, leads, or angles",
  "Review screen where you can tweak everything before running",
];

type Step = "prompt" | "review";

function GeneratePlanButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      isPending={pending}
      className="bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) pressed:bg-(--tm-color-primary-600) h-auto px-5 py-2.5 font-semibold shadow-sm"
    >
      <Sparkles className="h-4 w-4" />
      <span>Generate AI plan</span>
    </Button>
  );
}

export default function NewInvestigationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("prompt");
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState<string | null>(null);
  const [isStartPending, startInvestigationTransition] = useTransition();
  const [planError, setPlanError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [plannedInput, setPlannedInput] =
    useState<InvestigationWorkflowInput | null>(null);

  const characterCount = prompt.length;
  const characterLimit = 2000;
  const remainingCharacters = characterLimit - characterCount;

  async function generatePlanAction(formData: FormData) {
    const trimmed = (formData.get("prompt") as string || "").trim();
    if (!trimmed) {
      setPromptError("Describe what you want to investigate first.");
      return;
    }
    if (trimmed.length < 40) {
      setPromptError(
        "Add a bit more detail so we can infer a useful plan (at least a sentence or two).",
      );
      return;
    }

    setPromptError(null);
    setPlanError(null);

    try {
      const plan = await generatePlan(trimmed);
      setPlannedInput({
        ...plan,
        geography: plan.geography || "Global",
      });
      setStep("review");
    } catch (error) {
      setPlanError(
        error instanceof Error
          ? error.message
          : "Failed to analyze your investigation idea.",
      );
    }
  }

  function handleStartInvestigation() {
    if (!plannedInput) return;

    setStartError(null);

    startInvestigationTransition(async () => {
      try {
        const runId = await startInvestigation({
          title: plannedInput.title,
          description: plannedInput.description ?? "",
          category: plannedInput.category,
          geography: plannedInput.geography || "Global",
          context: plannedInput.context ?? "",
        });
        router.push(`/dashboard/investigations/${runId}`);
      } catch (error) {
        setStartError(
          error instanceof Error
            ? error.message
            : "Failed to start investigation.",
        );
      }
    });
  }

  function resetToPrompt() {
    setStep("prompt");
    setPlanError(null);
    setStartError(null);
  }

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

      {step === "prompt" && (
        <Form action={generatePlanAction} className="space-y-6">
          <AriaTextField
            name="prompt"
            value={prompt}
            onChange={(value: string) => {
              if (value.length <= characterLimit) {
                setPrompt(value);
              }
            }}
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
                  Review and adjust anything before starting deep research.
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
                onChange={(value) =>
                  setPlannedInput((prev) =>
                    prev ? { ...prev, title: value } : prev,
                  )
                }
              />

              <TextAreaField
                label="Short description"
                rows={3}
                value={plannedInput.description ?? ""}
                onChange={(value) =>
                  setPlannedInput((prev) =>
                    prev ? { ...prev, description: value } : prev,
                  )
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Issue type"
                  selectedKey={plannedInput.category}
                  onSelectionChange={(key) =>
                    setPlannedInput((prev) =>
                      prev
                        ? {
                            ...prev,
                            category: key as InvestigationWorkflowInput["category"],
                          }
                        : prev,
                    )
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
                  onChange={(value) =>
                    setPlannedInput((prev) =>
                      prev ? { ...prev, geography: value } : prev,
                    )
                  }
                />
              </div>

              <TextAreaField
                label="Additional context"
                description="optional"
                rows={4}
                value={plannedInput.context ?? ""}
                onChange={(value) =>
                  setPlannedInput((prev) =>
                    prev ? { ...prev, context: value } : prev,
                  )
                }
                placeholder="Add any links, leads, red flags, or constraints you want the system to prioritize."
              />
            </div>
          </div>

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
              onPress={resetToPrompt}
            >
              Back to prompt
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
