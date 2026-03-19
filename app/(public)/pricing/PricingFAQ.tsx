'use client';

import {useContext} from 'react';
import {
  DisclosureGroup as AriaDisclosureGroup,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosureStateContext,
  Heading,
  Button,
} from 'react-aria-components';

const FAQ_ITEMS = [
  {
    id: 'what-is-report',
    question: 'What exactly is a TrueMotives report?',
    answer:
      "A structured AI-generated analysis that identifies stakeholders, maps their incentives (economic, political, ideological), proposes ranked motivations with confidence levels, and provides sourced evidence and citations. It's a starting point for deeper investigation, not a definitive conclusion.",
  },
  {
    id: 'free-vs-pro',
    question: 'What can I do on the free plan?',
    answer:
      'You can read every publicly available report in our library, including executive summaries, full stakeholder maps, sourced evidence, and alternative hypotheses. You can search and filter by topic, geography, and category — all without creating an account.',
  },
  {
    id: 'investigation-limit',
    question: 'What counts as an investigation?',
    answer:
      'Each time you submit a topic for the AI to analyze and generate a full TrueMotives report, that counts as one investigation. Editing or re-reading an existing report does not count against your quota.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel at any time. Your access to Pro features continues until the end of your current billing period. Your saved drafts and generated reports remain accessible on the free plan.',
  },
  {
    id: 'accuracy',
    question: 'How reliable are the AI-generated analyses?',
    answer:
      'Every report includes explicit confidence levels, sourced citations, and a clear disclaimer that this is AI-assisted analysis — not definitive fact. We design the system to surface uncertainty and alternative hypotheses rather than project false confidence. Always verify independently.',
  },
  {
    id: 'team-plan',
    question: 'Do you offer team or newsroom plans?',
    answer:
      "Not yet, but team plans with shared seats, collaboration features, and editorial review workflows are on our roadmap. Contact us if you're interested in early access for your newsroom.",
  },
];

export function PricingFAQ() {
  return (
    <AriaDisclosureGroup className="space-y-0 divide-y divide-(--tm-color-neutral-100) overflow-hidden rounded-xl border border-(--tm-color-neutral-100)">
      {FAQ_ITEMS.map((item) => (
        <AriaDisclosure key={item.id} id={item.id} className="group bg-white">
          <FAQTrigger>{item.question}</FAQTrigger>
          <AriaDisclosurePanel className="h-(--disclosure-panel-height) overflow-clip motion-safe:transition-[height]">
            <div className="px-5 pt-0 pb-5 text-sm leading-relaxed text-(--tm-color-neutral-600)">
              {item.answer}
            </div>
          </AriaDisclosurePanel>
        </AriaDisclosure>
      ))}
    </AriaDisclosureGroup>
  );
}

function FAQTrigger({children}: {children: React.ReactNode}) {
  const state = useContext(DisclosureStateContext);
  const isExpanded = state?.isExpanded ?? false;

  return (
    <Heading className="m-0">
      <Button
        slot="trigger"
        className="flex w-full cursor-default items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-(--tm-color-primary-900) transition-colors hover:bg-(--tm-color-neutral-50) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
      >
        <span>{children}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-(--tm-color-neutral-600) transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </Button>
    </Heading>
  );
}
