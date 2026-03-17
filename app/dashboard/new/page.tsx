"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

type Step = "prompt" | "review";

export default function NewInvestigationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("prompt");
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState<string | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [plannedInput, setPlannedInput] =
    useState<InvestigationWorkflowInput | null>(null);

  const characterCount = prompt.length;
  const characterLimit = 2000;
  const remainingCharacters = characterLimit - characterCount;

  async function handleGeneratePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = prompt.trim();
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
    setIsPlanning(true);

    try {
      const response = await fetch("/api/investigations/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          body?.error || "Failed to analyze your investigation idea.",
        );
      }

      const body = (await response.json()) as {
        plan: InvestigationWorkflowInput;
      };

      setPlannedInput({
        ...body.plan,
        geography: body.plan.geography || "Global",
      });
      setStep("review");
    } catch (error) {
      setPlanError(
        error instanceof Error
          ? error.message
          : "Failed to analyze your investigation idea.",
      );
    } finally {
      setIsPlanning(false);
    }
  }

  async function handleStartInvestigation() {
    if (!plannedInput) return;

    setStartError(null);
    setIsStarting(true);

    try {
      const payload = {
        title: plannedInput.title,
        description: plannedInput.description ?? "",
        category: plannedInput.category,
        geography: plannedInput.geography || "Global",
        context: plannedInput.context ?? "",
      };

      const response = await fetch("/api/investigations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Failed to start investigation.");
      }

      const body = (await response.json()) as { runId: string };
      router.push(`/dashboard/investigations/${body.runId}`);
    } catch (error) {
      setStartError(
        error instanceof Error
          ? error.message
          : "Failed to start investigation.",
      );
      setIsStarting(false);
    }
  }

  function resetToPrompt() {
    setStep("prompt");
    setPlanError(null);
    setStartError(null);
  }

  return (
    <div className="px-8 py-8 max-w-2xl">
      {/* Breadcrumb */}
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

      {/* Header */}
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
        <form onSubmit={handleGeneratePlan} className="space-y-6">
          {/* Freeform investigation idea */}
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-semibold text-(--tm-color-primary-900)"
            >
              What do you want to investigate?
              <span className="ml-1 text-(--tm-color-danger-500)">*</span>
            </label>
            <p className="text-xs text-(--tm-color-neutral-600)">
              Write a short brief in your own words — the decision, policy, pattern, or situation
              you want to understand, plus any hints about who&apos;s involved.
            </p>
            <textarea
              id="prompt"
              name="prompt"
              rows={8}
              value={prompt}
              onChange={(e) => {
                if (e.target.value.length <= characterLimit) {
                  setPrompt(e.target.value);
                }
              }}
              placeholder={[
                "e.g. I want to understand the real incentives behind recent EU enforcement actions",
                "around the Digital Markets Act, especially how large tech platforms and national",
                "regulators are shaping the timeline and scope of implementation.",
              ].join(" ")}
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
          </div>

          {/* What you’ll receive */}
          <div className="rounded-xl border border-(--tm-color-neutral-100) bg-linear-to-br from-(--tm-color-neutral-50) via-white to-(--tm-color-neutral-50) p-4">
            <p className="text-[11px] font-semibold text-(--tm-color-primary-900) mb-2.5 uppercase tracking-wide">
              AI-drafted investigation plan
            </p>
            <ul className="space-y-1.5">
              {[
                "Proposed title and 1–3 sentence summary",
                "Issue category and geography inferred from your description",
                "Optional context field capturing constraints, leads, or angles",
                "Review screen where you can tweak everything before running",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)"
                >
                  <svg
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--tm-color-success-500)"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPlanning}
              className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-sm"
            >
              {isPlanning ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Analyzing your investigation…
                </>
              ) : (
                <>
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
                  Generate AI plan
                </>
              )}
            </button>
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
        </form>
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
              <button
                type="button"
                onClick={resetToPrompt}
                className="text-xs font-medium text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) underline underline-offset-4"
              >
                Refine prompt instead
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-(--tm-color-primary-900)"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={plannedInput.title}
                  onChange={(e) =>
                    setPlannedInput({ ...(plannedInput as InvestigationWorkflowInput), title: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-(--tm-color-primary-900)"
                >
                  Short description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={plannedInput.description ?? ""}
                  onChange={(e) =>
                    setPlannedInput({
                      ...(plannedInput as InvestigationWorkflowInput),
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-(--tm-color-primary-900)"
                  >
                    Issue type
                  </label>
                  <select
                    id="category"
                    value={plannedInput.category}
                    onChange={(e) =>
                      setPlannedInput({
                        ...(plannedInput as InvestigationWorkflowInput),
                        category: e.target.value as InvestigationWorkflowInput["category"],
                      })
                    }
                    className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 appearance-none cursor-default"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="geography"
                    className="block text-sm font-semibold text-(--tm-color-primary-900)"
                  >
                    Geography
                  </label>
                  <input
                    id="geography"
                    type="text"
                    value={plannedInput.geography || "Global"}
                    onChange={(e) =>
                      setPlannedInput({
                        ...(plannedInput as InvestigationWorkflowInput),
                        geography: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="context"
                  className="block text-sm font-semibold text-(--tm-color-primary-900)"
                >
                  Additional context
                  <span className="ml-2 text-xs font-normal text-(--tm-color-neutral-300)">
                    optional
                  </span>
                </label>
                <textarea
                  id="context"
                  rows={4}
                  value={plannedInput.context ?? ""}
                  onChange={(e) =>
                    setPlannedInput({
                      ...(plannedInput as InvestigationWorkflowInput),
                      context: e.target.value,
                    })
                  }
                  placeholder="Add any links, leads, red flags, or constraints you want the system to prioritize."
                  className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled={isStarting}
              onClick={handleStartInvestigation}
              className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-sm"
            >
              {isStarting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Starting investigation…
                </>
              ) : (
                <>
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
                  Start investigation
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetToPrompt}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors"
            >
              Back to prompt
            </button>
          </div>

          {startError && (
            <p className="text-xs text-(--tm-color-danger-500) mt-1">{startError}</p>
          )}
        </div>
      )}
    </div>
  );
}
