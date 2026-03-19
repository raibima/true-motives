import type {Metadata} from 'next';
import {Link} from '@/components/ui/Link';
import {PricingFAQ} from './PricingFAQ';

export const metadata: Metadata = {
  title: 'Pricing — TrueMotives',
  description:
    'Choose a plan that fits your investigative needs. Free access to public reports or Pro tools for journalists and researchers.',
};

const FREE_FEATURES = [
  'Browse the full public report library',
  'Read executive summaries and stakeholder maps',
  'Access sourced evidence and citations',
  'Filter by topic, geography, and category',
];

const PRO_FEATURES = [
  'Everything in Free, plus:',
  'Run up to 20 custom investigations per month',
  'AI-generated structured TrueMotives reports',
  'Stakeholder mapping with incentive analysis',
  'Confidence levels and alternative hypotheses',
  'Save drafts and edit report sections',
  'Priority generation queue',
  'Publish to the public library (opt-in)',
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-(--tm-color-primary-900)">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pricing-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="0.8" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pricing-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-fade-in-up stagger-1 flex items-center justify-center gap-3 text-sm font-medium text-(--tm-color-accent-400)">
              <span className="inline-block h-px w-8 bg-(--tm-color-accent-500)" />
              Pricing
              <span className="inline-block h-px w-8 bg-(--tm-color-accent-500)" />
            </div>

            <h1 className="animate-fade-in-up stagger-2 mt-5 font-serif text-4xl leading-[1.12] font-bold tracking-tight text-balance text-white sm:text-5xl">
              Investigate with clarity.
              <br />
              <span className="text-(--tm-color-accent-400)">Pay only when you need to.</span>
            </h1>

            <p className="animate-fade-in-up stagger-3 mt-6 text-lg leading-relaxed text-(--tm-color-neutral-300)">
              Everyone can read. Journalists and researchers get the power to generate custom
              motivation analyses on any topic.
            </p>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-(--tm-color-accent-500)/40 to-transparent" />
      </section>

      {/* Pricing cards */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Free tier */}
          <div className="animate-fade-in-up stagger-3 rounded-xl border border-(--tm-color-neutral-100) bg-white p-8 shadow-sm lg:mt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--tm-color-neutral-100)">
                <svg
                  className="h-5 w-5 text-(--tm-color-neutral-600)"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
                  Reader
                </h2>
                <p className="text-xs text-(--tm-color-neutral-600)">For the curious public</p>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-serif text-4xl font-bold tracking-tight text-(--tm-color-primary-900)">
                $0
              </span>
              <span className="text-sm text-(--tm-color-neutral-600)">/ forever</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-(--tm-color-neutral-600)">
              Full access to our growing library of AI-assisted motivation analyses. Read, search,
              and learn — no account required.
            </p>

            <Link
              href="/reports"
              className="mt-6 flex min-h-11 items-center justify-center rounded-lg border border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50) px-5 py-2.5 text-center text-sm font-semibold text-(--tm-color-primary-900) transition-all hover:border-(--tm-color-neutral-300) hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
            >
              Browse reports
            </Link>

            <div className="mt-8 border-t border-(--tm-color-neutral-100) pt-6">
              <p className="text-xs font-semibold tracking-widest text-(--tm-color-neutral-600) uppercase">
                What&apos;s included
              </p>
              <ul className="mt-4 space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-success-500)"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-sm text-(--tm-color-neutral-600)">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro tier — featured */}
          <div className="animate-fade-in-up stagger-4 relative rounded-xl border-2 border-(--tm-color-accent-500) bg-white p-8 shadow-(--tm-color-accent-500)/8 shadow-lg">
            <div className="absolute -top-3.5 left-6 inline-flex items-center rounded-full bg-(--tm-color-accent-500) px-3.5 py-1 text-xs font-bold tracking-wider text-(--tm-color-primary-900) uppercase">
              For journalists
            </div>

            <div className="mt-1 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--tm-color-accent-500)/10">
                <svg
                  className="h-5 w-5 text-(--tm-color-accent-700)"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.6 5.6a7.5 7.5 0 0 0 10.2 10.2Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-(--tm-color-primary-900)">
                  Pro Investigator
                </h2>
                <p className="text-xs text-(--tm-color-neutral-600)">
                  For journalists &amp; researchers
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-serif text-4xl font-bold tracking-tight text-(--tm-color-primary-900)">
                $49
              </span>
              <span className="text-sm text-(--tm-color-neutral-600)">/ month</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-(--tm-color-neutral-600)">or $470/year</span>
              <span className="inline-flex items-center rounded-full bg-(--tm-color-success-100) px-2 py-0.5 text-[10px] font-bold tracking-wider text-(--tm-color-success-500) uppercase">
                Save 20%
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-(--tm-color-neutral-600)">
              Generate custom AI-powered motivation analyses on any public policy, government
              decision, or corporate action. Up to 20 investigations per month.
            </p>

            <span className="mt-6 flex min-h-11 cursor-default items-center justify-center rounded-lg bg-(--tm-color-primary-800) px-5 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-(--tm-color-primary-600) hover:shadow-md">
              Coming soon — join the waitlist
            </span>

            <div className="mt-8 border-t border-(--tm-color-neutral-100) pt-6">
              <p className="text-xs font-semibold tracking-widest text-(--tm-color-neutral-600) uppercase">
                What&apos;s included
              </p>
              <ul className="mt-4 space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-accent-500)"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-sm text-(--tm-color-neutral-600)">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison strip */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="animate-fade-in-up text-center font-serif text-2xl font-semibold text-(--tm-color-primary-900)">
            What sets Pro apart
          </h2>
          <p className="mt-3 text-center text-sm text-(--tm-color-neutral-600)">
            Both tiers include full access to every public report. Here&apos;s what changes when you
            go Pro.
          </p>

          <div className="mt-10 overflow-hidden rounded-xl border border-(--tm-color-neutral-100)">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50)">
                  <th className="px-5 py-3 text-left font-medium text-(--tm-color-neutral-600)">
                    Capability
                  </th>
                  <th className="px-5 py-3 text-center font-medium text-(--tm-color-neutral-600)">
                    Reader
                  </th>
                  <th className="px-5 py-3 text-center font-medium text-(--tm-color-accent-700)">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--tm-color-neutral-100)">
                {[
                  ['Read public reports', true, true],
                  ['Search & filter library', true, true],
                  ['Generate custom investigations', false, true],
                  ['AI motivation analysis engine', false, true],
                  ['Stakeholder & incentive mapping', false, true],
                  ['Save and edit drafts', false, true],
                  ['Alternative hypothesis generation', false, true],
                  ['Priority processing queue', false, true],
                ].map(([feature, free, pro]) => (
                  <tr key={feature as string} className="bg-white">
                    <td className="px-5 py-3 text-(--tm-color-neutral-900)">{feature as string}</td>
                    <td className="px-5 py-3 text-center">
                      {free ? (
                        <CheckIcon className="text-(--tm-color-success-500)" />
                      ) : (
                        <DashIcon />
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {pro ? <CheckIcon className="text-(--tm-color-accent-500)" /> : <DashIcon />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-(--tm-color-neutral-100)" />
      </div>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-serif text-2xl font-semibold text-(--tm-color-primary-900)">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-center text-sm text-(--tm-color-neutral-600)">
          Everything you need to know about our plans.
        </p>

        <div className="mt-10">
          <PricingFAQ />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-(--tm-color-neutral-100) bg-(--tm-color-primary-900)">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <div className="flex items-center gap-3 text-sm font-medium text-(--tm-color-accent-400)">
            <span className="inline-block h-px w-6 bg-(--tm-color-accent-500)" />
            Start uncovering the truth
            <span className="inline-block h-px w-6 bg-(--tm-color-accent-500)" />
          </div>
          <h2 className="max-w-md font-serif text-2xl font-semibold text-balance text-white">
            The public reports are free. Your first investigation is on us.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-(--tm-color-primary-900) shadow-sm transition-all hover:bg-(--tm-color-neutral-50) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
            >
              Browse reports
            </Link>
            <span className="inline-flex cursor-default items-center rounded-lg border border-white/20 px-6 py-2.5 text-sm font-medium text-white/70">
              Pro waitlist — coming soon
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function CheckIcon({className = ''}: {className?: string}) {
  return (
    <svg
      className={`inline-block h-4 w-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function DashIcon() {
  return <span className="inline-block h-0.5 w-3 rounded-full bg-(--tm-color-neutral-300)" />;
}
