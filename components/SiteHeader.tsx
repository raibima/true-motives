import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50)/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="inline-block h-5 w-1 rounded-sm bg-(--tm-color-accent-500)" />
          <span className="font-serif text-lg font-semibold tracking-tight text-(--tm-color-primary-900)">
            TrueMotives
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/reports"
            className="text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:text-(--tm-color-primary-900)"
          >
            Browse reports
          </Link>
          <span className="text-sm text-(--tm-color-neutral-300)">|</span>
          <span className="text-sm text-(--tm-color-neutral-600) cursor-default">
            For journalists
          </span>
        </div>
      </nav>
    </header>
  );
}
