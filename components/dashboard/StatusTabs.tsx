'use client';

import Link from 'next/link';
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@/components/ui/Tabs';
import type {InvestigationStatus} from '@/shared/types';
import type {Investigation} from '@/shared/types';

const STATUS_TABS: {id: InvestigationStatus | 'all'; label: string}[] = [
  {id: 'all', label: 'All'},
  {id: 'completed', label: 'Completed'},
  {id: 'generating', label: 'Generating'},
  {id: 'draft', label: 'Drafts'},
  {id: 'failed', label: 'Failed'},
];

interface StatusTabsProps {
  investigations: Investigation[];
  selectedKey: InvestigationStatus | 'all';
  children: React.ReactNode;
}

function getCount(investigations: Investigation[], tabId: InvestigationStatus | 'all'): number {
  if (tabId === 'all') return investigations.length;
  return investigations.filter((i) => i.status === tabId).length;
}

export function StatusTabs({investigations, selectedKey, children}: StatusTabsProps) {
  return (
    <Tabs selectedKey={selectedKey} className="mb-6">
      <TabList aria-label="Filter by status" variant="underline">
        {STATUS_TABS.map((tab) => {
          const count = getCount(investigations, tab.id);
          const href = tab.id === 'all' ? '/dashboard' : `/dashboard?status=${tab.id}`;

          return (
            <Tab
              key={tab.id}
              id={tab.id}
              href={href}
              variant="underline"
              render={(domProps) =>
                'href' in domProps ? (
                  <Link {...domProps} href={domProps.href as string} />
                ) : (
                  <div {...domProps} />
                )
              }
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={[
                    'rounded-full px-1.5 py-0.5 text-[10px] font-mono font-semibold',
                    tab.id === selectedKey
                      ? 'bg-(--tm-color-primary-900) text-white'
                      : 'bg-(--tm-color-neutral-100) text-(--tm-color-neutral-600)',
                  ].join(' ')}
                >
                  {count}
                </span>
              )}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className="[--tab-panel-height:auto]">
        {STATUS_TABS.map((tab) => (
          <TabPanel key={tab.id} id={tab.id} className="p-0">
            {children}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
