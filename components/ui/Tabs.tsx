'use client';
import React from 'react';
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanels as RACTabPanels,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  SelectionIndicator,
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProps,
  TabsProps,
  composeRenderProps
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusRing } from '@/client/react-aria-utils';
import { twMerge } from 'tailwind-merge';

type TabVariant = 'pill' | 'underline';

const tabsStyles = tv({
  base: 'flex gap-4 font-sans max-w-full',
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row'
    }
  }
});

export function Tabs(props: TabsProps) {
  return (
    <RACTabs
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => tabsStyles({...renderProps, className})
      )} />
  );
}

const tabListStyles = tv({
  base: 'flex max-w-full overflow-x-auto overflow-y-clip [scrollbar-width:none]',
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col items-start'
    },
    variant: {
      pill: 'p-1 -m-1',
      underline:
        'items-center gap-1 border-b border-(--tm-color-neutral-100) pb-0'
    }
  }
});

export interface TabListPropsWithVariant<T extends object = object>
  extends TabListProps<T> {
  variant?: TabVariant;
}

export function TabList<T extends object>({
  variant = 'pill',
  ...props
}: TabListPropsWithVariant<T>) {
  return (
    <RACTabList
      {...props}
      data-variant={variant}
      className={composeRenderProps(
        props.className,
        (className, renderProps) =>
          tabListStyles({
            ...renderProps,
            variant,
            className
          })
      )} />
  );
}

const tabProps = tv({
  extend: focusRing,
  base: 'group relative flex items-center cursor-default text-sm font-medium transition forced-color-adjust-none [-webkit-tap-highlight-color:transparent]',
  variants: {
    isDisabled: {
      true:
        'text-neutral-200 dark:text-neutral-600 forced-colors:text-[GrayText] selected:text-white dark:selected:text-neutral-500 forced-colors:selected:text-[HighlightText] selected:bg-neutral-200 dark:selected:bg-neutral-600 forced-colors:selected:bg-[GrayText]'
    },
    variant: {
      pill:
        'rounded-full px-3 py-1.5',
      underline:
        'gap-1.5 px-3 py-2.5 border-b-2 -mb-px border-transparent text-(--tm-color-neutral-600) hover:text-(--tm-color-primary-900) data-[selected]:border-(--tm-color-primary-900) data-[selected]:text-(--tm-color-primary-900)'
    }
  }
});

const selectionIndicatorStyles = tv({
  base: 'motion-safe:transition-[translate,width,height]',
  variants: {
    variant: {
      pill:
        'absolute top-0 left-0 w-full h-full z-10 bg-white rounded-full mix-blend-difference group-disabled:bg-neutral-400 group-disabled:mix-blend-normal group-disabled:dark:bg-neutral-600 group-disabled:-z-1',
      underline:
        'absolute left-0 bottom-0 w-full h-0.5 bg-(--tm-color-primary-900)'
    }
  }
});

export interface TabPropsWithVariant extends TabProps {
  variant?: TabVariant;
}

export function Tab({ variant = 'pill', ...props }: TabPropsWithVariant) {
  return (
    <RACTab
      {...props}
      data-variant={variant}
      className={composeRenderProps(
        props.className,
        (className, renderProps) =>
          tabProps({ ...renderProps, variant, className })
      )}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <SelectionIndicator
            className={selectionIndicatorStyles({ variant })}
          />
        </>
      ))}
    </RACTab>
  );
}

export function TabPanels<T extends object>(props: TabPanelsProps<T>) {
  return (
    <RACTabPanels
      {...props}
      className={twMerge('relative h-(--tab-panel-height) motion-safe:transition-[height] overflow-clip', props.className)} />
  );
}

const tabPanelStyles = tv({
  extend: focusRing,
  base: 'flex-1 box-border p-4 text-sm text-neutral-900 dark:text-neutral-100 transition entering:opacity-0 exiting:opacity-0 exiting:absolute exiting:top-0 exiting:left-0 exiting:w-full'
});

export function TabPanel(props: TabPanelProps) {
  return (
    <RACTabPanel
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => tabPanelStyles({...renderProps, className})
      )} />
  );
}
