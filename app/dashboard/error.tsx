'use client';

import {useEffect} from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--tm-color-danger-100)">
        <svg
          className="h-7 w-7 text-(--tm-color-danger-500)"
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
      </div>

      <h2 className="mb-2 font-serif text-xl font-semibold text-(--tm-color-primary-900)">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-(--tm-color-neutral-600)">
        We couldn&apos;t load your investigations. This is likely a temporary issue.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--tm-color-primary-800)"
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
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-(--tm-color-neutral-100) bg-white px-4 py-2 text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:bg-(--tm-color-neutral-50)"
        >
          Return home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-(--tm-color-neutral-300)">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
