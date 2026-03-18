import { Link } from "@/components/ui/Link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Decorative icon */}
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-(--tm-color-neutral-100) flex items-center justify-center">
          <svg
            className="h-9 w-9 text-(--tm-color-neutral-300)"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-(--tm-color-accent-500) flex items-center justify-center">
          <svg
            className="h-3 w-3 text-(--tm-color-primary-900)"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>

      <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900) mb-2">
        No investigations yet
      </h2>
      <p className="max-w-sm text-sm text-(--tm-color-neutral-600) leading-relaxed mb-6">
        Start your first investigation to uncover the hidden motivations behind
        public policies, government decisions, and corporate actions.
      </p>

      <Link
        href="/dashboard/new"
        className="inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Start first investigation
      </Link>

      <p className="mt-4 text-xs text-(--tm-color-neutral-300)">
        Each investigation generates a structured TrueMotives Report in 60–120 seconds
      </p>
    </div>
  );
}
