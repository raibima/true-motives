"use client";

import { useTransition } from "react";
import { useImmerReducer } from "use-immer";
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

type State = {
  step: Step;
  prompt: string;
  promptError: string | null;
  planError: string | null;
  startError: string | null;
  plannedInput: InvestigationWorkflowInput | null;
};

/** Domain events — what happened, not what to set */
type Action =
  | { type: "PROMPT_CHANGED"; payload: string }
  | { type: "PROMPT_VALIDATION_FAILED"; payload: string }
  | { type: "PLAN_GENERATION_STARTED" }
  | { type: "PLAN_GENERATED"; payload: InvestigationWorkflowInput }
  | { type: "PLAN_GENERATION_FAILED"; payload: string }
  | { type: "PLAN_EDITED"; payload: Partial<InvestigationWorkflowInput> }
  | { type: "INVESTIGATION_START_REQUESTED" }
  | { type: "INVESTIGATION_START_FAILED"; payload: string }
  | { type: "BACK_TO_PROMPT_REQUESTED" };

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "PROMPT_CHANGED":
      draft.prompt = action.payload;
      break;
    case "PROMPT_VALIDATION_FAILED":
      draft.promptError = action.payload;
      break;
    case "PLAN_GENERATION_STARTED":
      draft.promptError = null;
      draft.planError = null;
      break;
    case "PLAN_GENERATED":
      draft.plannedInput = action.payload;
      draft.step = "review";
      draft.promptError = null;
      draft.planError = null;
      break;
    case "PLAN_GENERATION_FAILED":
      draft.planError = action.payload;
      break;
    case "PLAN_EDITED":
      if (draft.plannedInput) {
        Object.assign(draft.plannedInput, action.payload);
      }
      break;
    case "INVESTIGATION_START_REQUESTED":
      draft.startError = null;
      break;
    case "INVESTIGATION_START_FAILED":
      draft.startError = action.payload;
      break;
    case "BACK_TO_PROMPT_REQUESTED":
      draft.step = "prompt";
      draft.planError = null;
      draft.startError = null;
      break;
  }
}

const initialState: State = {
  step: "prompt",
  prompt: "",
  promptError: null,
  planError: null,
  startError: null,
  plannedInput: null,
};

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
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const [isStartPending, startInvestigationTransition] = useTransition();

  const characterCount = state.prompt.length;
  const characterLimit = 2000;
  const remainingCharacters = characterLimit - characterCount;

  async function generatePlanAction(formData: FormData) {
    const trimmed = (formData.get("prompt") as string || "").trim();
    if (!trimmed) {
      dispatch({ type: "PROMPT_VALIDATION_FAILED", payload: "Describe what you want to investigate first." });
      return;
    }
    if (trimmed.length < 40) {
      dispatch({
        type: "PROMPT_VALIDATION_FAILED",
        payload: "Add a bit more detail so we can infer a useful plan (at least a sentence or two).",
      });
      return;
    }

    dispatch({ type: "PLAN_GENERATION_STARTED" });

    try {
      const plan = await generatePlan(trimmed);
      dispatch({
        type: "PLAN_GENERATED",
        payload: { ...plan, geography: plan.geography || "Global" },
      });
    } catch (error) {
      dispatch({
        type: "PLAN_GENERATION_FAILED",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to analyze your investigation idea.",
      });
    }
  }

  function handleStartInvestigation() {
    if (!state.plannedInput) return;

    dispatch({ type: "INVESTIGATION_START_REQUESTED" });

    startInvestigationTransition(async () => {
      const plannedInput = state.plannedInput!;
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
        dispatch({
          type: "INVESTIGATION_START_FAILED",
          payload:
            error instanceof Error
              ? error.message
              : "Failed to start investigation.",
        });
      }
    });
  }

  function resetToPrompt() {
    dispatch({ type: "BACK_TO_PROMPT_REQUESTED" });
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

      {state.step === "prompt" && (
        <Form action={generatePlanAction} className="space-y-6">
          <AriaTextField
            name="prompt"
            value={state.prompt}
            onChange={(value: string) => {
              if (value.length <= characterLimit) {
                dispatch({ type: "PROMPT_CHANGED", payload: value });
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
            {state.promptError && (
              <p className="text-xs text-(--tm-color-danger-500)">{state.promptError}</p>
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
          {state.planError && (
            <p className="text-xs text-(--tm-color-danger-500) mt-1">{state.planError}</p>
          )}
        </Form>
      )}

      {state.step === "review" && state.plannedInput && (
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
                value={state.plannedInput.title}
                onChange={(value) =>
                  dispatch({ type: "PLAN_EDITED", payload: { title: value } })
                }
              />

              <TextAreaField
                label="Short description"
                rows={3}
                value={state.plannedInput.description ?? ""}
                onChange={(value) =>
                  dispatch({ type: "PLAN_EDITED", payload: { description: value } })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Issue type"
                  selectedKey={state.plannedInput.category}
                  onSelectionChange={(key) =>
                    dispatch({
                      type: "PLAN_EDITED",
                      payload: { category: key as InvestigationWorkflowInput["category"] },
                    })
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
                  value={state.plannedInput.geography || "Global"}
                  onChange={(value) =>
                    dispatch({ type: "PLAN_EDITED", payload: { geography: value } })
                  }
                />
              </div>

              <TextAreaField
                label="Additional context"
                description="optional"
                rows={4}
                value={state.plannedInput.context ?? ""}
                onChange={(value) =>
                  dispatch({ type: "PLAN_EDITED", payload: { context: value } })
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

          {state.startError && (
            <p className="text-xs text-(--tm-color-danger-500) mt-1">{state.startError}</p>
          )}
        </div>
      )}
    </div>
  );
}
