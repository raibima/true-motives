"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  TextField,
  TextArea,
  Label,
  FieldError,
  Input,
} from "react-aria-components";

const CATEGORIES = [
  { value: "policy", label: "Public policy" },
  { value: "regulation", label: "Regulation" },
  { value: "corporate-decision", label: "Corporate decision" },
  { value: "government-action", label: "Government action" },
  { value: "legislation", label: "Legislation" },
];

const GEOGRAPHIES = [
  "Global",
  "United States",
  "European Union",
  "United Kingdom",
  "China",
  "Brazil",
  "India",
  "Russia",
  "Germany",
  "France",
  "Japan",
  "Other",
];

export default function NewInvestigationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGeography, setSelectedGeography] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call — in production this would create the investigation
    await new Promise((resolve) => setTimeout(resolve, 1800));
    // Redirect to the generating investigation (using mock inv-003)
    router.push("/dashboard/investigations/inv-003");
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
          Describe the issue or decision you want to investigate. TrueMotives will
          research stakeholders, map incentives, and generate a structured motives
          analysis in 60–120 seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-(--tm-color-primary-900)"
          >
            Topic title
            <span className="ml-1 text-(--tm-color-danger-500)">*</span>
          </label>
          <p className="text-xs text-(--tm-color-neutral-600)">
            A specific, focused topic — e.g. &ldquo;EU Digital Markets Act enforcement timeline&rdquo;
          </p>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. US pharmaceutical industry lobbying on drug pricing reform"
            className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30"
          />
        </div>

        {/* Research question */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-(--tm-color-primary-900)"
          >
            Research question
          </label>
          <p className="text-xs text-(--tm-color-neutral-600)">
            Frame the underlying question: &ldquo;What are the true motivations behind…?&rdquo;
          </p>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What are the hidden incentives driving this decision? Who benefits and who loses?"
            className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 resize-none leading-relaxed"
          />
        </div>

        {/* Category + Geography row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-(--tm-color-primary-900)"
            >
              Issue type
              <span className="ml-1 text-(--tm-color-danger-500)">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 appearance-none cursor-default"
            >
              <option value="" disabled>
                Select type…
              </option>
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
            <select
              id="geography"
              name="geography"
              value={selectedGeography}
              onChange={(e) => setSelectedGeography(e.target.value)}
              className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 appearance-none cursor-default"
            >
              <option value="">Any / global</option>
              {GEOGRAPHIES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Context links / documents */}
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
          <p className="text-xs text-(--tm-color-neutral-600)">
            Paste URLs to key documents, news articles, or official reports you want included
          </p>
          <textarea
            id="context"
            name="context"
            rows={4}
            placeholder="https://ec.europa.eu/...&#10;https://www.reuters.com/...&#10;&#10;Or paste relevant text excerpts here"
            className="w-full rounded-lg border border-(--tm-color-neutral-100) bg-white px-3.5 py-2.5 text-sm text-(--tm-color-primary-900) placeholder:text-(--tm-color-neutral-300) outline-none ring-0 transition-all focus:border-(--tm-color-primary-600)/50 focus:ring-2 focus:ring-(--tm-color-accent-400)/30 resize-none leading-relaxed font-mono text-xs"
          />
        </div>

        {/* What to expect callout */}
        <div className="rounded-xl border border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50) p-4">
          <p className="text-xs font-semibold text-(--tm-color-primary-900) mb-2.5 uppercase tracking-wide">
            What you&apos;ll receive
          </p>
          <ul className="space-y-1.5">
            {[
              "Executive summary of likely core motivations",
              "Stakeholder map with incentive breakdown",
              "Supporting evidence with citations and confidence levels",
              "Alternative explanations and what would confirm or refute them",
              "Explicit assumptions and uncertainty disclosures",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-(--tm-color-neutral-600)">
                <svg
                  className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-(--tm-color-success-500)"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
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
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-sm"
          >
            {isSubmitting ? (
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
                Launching deep research…
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
                Generate motives analysis
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
          Generation takes 60–120 seconds. You can navigate away and return — the
          process continues in the background.
        </p>
      </form>
    </div>
  );
}
