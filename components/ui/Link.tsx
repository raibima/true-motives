'use client';
import { Link as AriaLink, LinkProps as AriaLinkProps, composeRenderProps } from 'react-aria-components';
import NextLink from 'next/link';
import { tv } from 'tailwind-variants';
import { focusRing } from '@/client/react-aria-utils';

interface LinkProps extends AriaLinkProps {
  variant?: 'primary' | 'secondary' | 'plain' | 'button' | 'button-secondary' | 'button-accent';
}

const styles = tv({
  extend: focusRing,
  base: 'disabled:no-underline disabled:cursor-default forced-colors:disabled:text-[GrayText] transition rounded-xs [-webkit-tap-highlight-color:transparent]',
  variants: {
    variant: {
      primary: 'underline text-blue-600 dark:text-blue-500 decoration-blue-600/60 hover:decoration-blue-600 dark:decoration-blue-500/60 dark:hover:decoration-blue-500',
      secondary: 'underline text-neutral-700 dark:text-neutral-300 decoration-neutral-700/50 hover:decoration-neutral-700 dark:decoration-neutral-300/70 dark:hover:decoration-neutral-300',
      plain: 'no-underline',
      button:
        'no-underline inline-flex items-center justify-center gap-2 border border-transparent dark:border-white/10 h-9 px-3.5 py-0 font-sans text-sm font-medium text-center rounded-lg cursor-default shadow-sm bg-(--tm-color-primary-900) hover:bg-(--tm-color-primary-800) pressed:bg-(--tm-color-primary-600) text-white',
      'button-secondary':
        'no-underline inline-flex items-center justify-center gap-2 border border-black/10 dark:border-white/10 h-9 px-3.5 py-0 font-sans text-sm font-medium text-center rounded-lg cursor-default bg-neutral-50 hover:bg-neutral-100 pressed:bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:pressed:bg-neutral-500 dark:text-neutral-100',
      'button-accent':
        'no-underline inline-flex items-center justify-center gap-2 border border-transparent h-9 px-3 py-0 font-sans text-sm font-semibold text-center rounded-lg cursor-default shadow-sm bg-(--tm-color-accent-500) hover:bg-(--tm-color-accent-400) pressed:bg-(--tm-color-accent-700) text-(--tm-color-primary-900)'
    }
  },
  defaultVariants: {
    variant: 'plain'
  }
});

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant })
      )}
      render={(domProps) => {
        if ('href' in domProps) {
          const { ref, href, ...rest } = domProps;
          return <NextLink href={href} ref={ref} {...rest} />;
        }
        return <span {...domProps} role="link" />;
      }}
    />
  );
}
