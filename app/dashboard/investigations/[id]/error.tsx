"use client";

import { useEffect } from "react";
import { Link } from "@/components/ui/Link";

export default function InvestigationDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-8 py-8 max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) transition-colors mb-8"
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

      <div className="flex flex-col items-center text-center py-12">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--tm-color-danger-100)">
          <svg
            className="h-6 w-6 text-(--tm-color-danger-500)"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>

        <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900) mb-2">
          Couldn&apos;t load this investigation
        </h2>
        <p className="max-w-sm text-sm text-(--tm-color-neutral-600) leading-relaxed mb-6">
          We ran into a problem fetching this investigation. Your data is safe — this
          is likely a temporary issue.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) px-4 py-2 text-sm font-semibold text-white transition-colors"
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
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-(--tm-color-neutral-100) bg-white px-4 py-2 text-sm font-medium text-(--tm-color-neutral-600) hover:bg-(--tm-color-neutral-50) transition-colors"
          >
            Back to investigations
          </Link>
        </div>

        {error.digest && (
          <p className="mt-5 text-xs text-(--tm-color-neutral-300) font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
