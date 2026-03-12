export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={
        className ||
        "border-t border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50)"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-0.5 rounded-sm bg-(--tm-color-accent-500)" />
          <span className="font-serif text-sm font-semibold text-(--tm-color-primary-900)">
            TrueMotives
          </span>
        </div>
        <p className="text-xs text-(--tm-color-neutral-600)">
          AI-assisted analysis — not definitive fact. Always verify independently.
        </p>
      </div>
    </footer>
  );
}

