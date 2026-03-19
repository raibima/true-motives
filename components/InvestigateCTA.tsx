import {Link} from '@/components/ui/Link';
import {cn} from '@/shared/utils';

interface InvestigateCTAProps {
  /** "band" renders a full-width section; "card" renders an inline bordered card */
  variant?: 'band' | 'card';
  className?: string;
}

export function InvestigateCTA({variant = 'band', className}: InvestigateCTAProps) {
  const isBand = variant === 'band';

  return isBand ? (
    <section className={cn('border-t border-(--tm-color-neutral-100) bg-white', className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <CTAContent headingLevel="h2" size="lg" />
      </div>
    </section>
  ) : (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-(--tm-color-neutral-300) bg-white px-8 py-10 text-center',
        className,
      )}
    >
      <CTAContent headingLevel="h3" size="sm" />
    </div>
  );
}

function CTAContent({headingLevel: Tag, size}: {headingLevel: 'h2' | 'h3'; size: 'sm' | 'lg'}) {
  return (
    <>
      <Tag
        className={cn(
          'font-serif font-semibold text-(--tm-color-primary-900)',
          size === 'lg' ? 'text-2xl' : 'text-lg',
        )}
      >
        Investigate your own topic
      </Tag>
      <p className="max-w-md text-sm leading-relaxed text-(--tm-color-neutral-600)">
        Generate custom motivation analyses on any public policy, government decision, or corporate
        action.
      </p>
      <Link
        href="/pricing"
        className={cn(
          'inline-flex items-center gap-2 rounded-lg bg-(--tm-color-primary-800) text-sm font-semibold text-white transition-all hover:bg-(--tm-color-primary-600) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)',
          size === 'lg' ? 'px-6 py-2.5' : 'mt-1 px-5 py-2',
        )}
      >
        See plans &amp; pricing
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
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>
    </>
  );
}
