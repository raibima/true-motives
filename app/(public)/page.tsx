import Link from "next/link";
import { ReportCard } from "@/components/ReportCard";
import { InvestigateCTA } from "@/components/InvestigateCTA";
import { getFeaturedReports } from "@/lib/mock-data";

export default function Home() {
  const featured = getFeaturedReports();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-(--tm-color-primary-900)">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-sm font-medium text-(--tm-color-accent-400) animate-fade-in-up stagger-1">
              <span className="inline-block h-px w-8 bg-(--tm-color-accent-500)" />
              AI-powered investigative analysis
            </div>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl animate-fade-in-up stagger-2 text-balance">
              Uncover the real motivations behind major decisions
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-(--tm-color-neutral-300) animate-fade-in-up stagger-3 max-w-xl">
              TrueMotives uses structured AI analysis to map stakeholders,
              incentives, and power dynamics — with transparent reasoning and
              sourced evidence, not opaque guesses.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up stagger-4">
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-(--tm-color-primary-900) shadow-sm transition-all hover:bg-(--tm-color-neutral-50) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
              >
                Browse reports
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
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
              >
                For journalists — see pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-(--tm-color-accent-500)/40 to-transparent" />
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-2xl font-semibold text-(--tm-color-primary-900) animate-fade-in-up">
          How TrueMotives works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Identify stakeholders",
              description:
                "We map every actor with a stake in the decision — governments, corporations, lobbies, and public groups.",
            },
            {
              step: "02",
              title: "Model incentives",
              description:
                "Economic, political, ideological, and institutional incentives are analyzed for each stakeholder.",
            },
            {
              step: "03",
              title: "Generate hypotheses",
              description:
                "Structured motivation analyses with explicit confidence levels, citations, and alternative explanations.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`animate-fade-in-up stagger-${i + 2}`}
            >
              <span className="text-xs font-bold tracking-widest text-(--tm-color-accent-500)">
                {item.step}
              </span>
              <h3 className="mt-2 text-base font-semibold text-(--tm-color-primary-900)">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--tm-color-neutral-600)">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-(--tm-color-neutral-100)" />
      </div>

      {/* Featured reports */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-(--tm-color-primary-900)">
              Featured analyses
            </h2>
            <p className="mt-2 text-sm text-(--tm-color-neutral-600)">
              Recent investigations into the motivations behind major global
              decisions.
            </p>
          </div>
          <Link
            href="/reports"
            className="hidden text-sm font-medium text-(--tm-color-primary-800) underline underline-offset-4 decoration-(--tm-color-neutral-300) hover:decoration-(--tm-color-primary-800) transition-colors sm:block"
          >
            View all reports
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((report, i) => (
            <ReportCard
              key={report.slug}
              report={report}
              className={`animate-fade-in-up stagger-${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/reports"
            className="text-sm font-medium text-(--tm-color-primary-800) underline underline-offset-4"
          >
            View all reports
          </Link>
        </div>
      </section>

      {/* CTA band */}
      <InvestigateCTA variant="band" />

    </>
  );
}
