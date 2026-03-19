import * as React from 'react';

type StatusBannerVariant = 'accent' | 'info' | 'success' | 'danger';

const VARIANT_STYLES: Record<StatusBannerVariant, {container: string; text: string; dot: string}> =
  {
    accent: {
      container: 'border-(--tm-color-accent-500)/30 bg-(--tm-color-accent-400)/10',
      text: 'text-(--tm-color-accent-700)',
      dot: 'bg-(--tm-color-accent-500)',
    },
    info: {
      container: 'border-(--tm-color-info-500)/30 bg-(--tm-color-info-100)/60',
      text: 'text-(--tm-color-info-500)',
      dot: 'bg-(--tm-color-info-500)',
    },
    success: {
      container: 'border-(--tm-color-success-500)/30 bg-(--tm-color-success-100)/60',
      text: 'text-(--tm-color-success-600)',
      dot: 'bg-(--tm-color-success-500)',
    },
    danger: {
      container: 'border-(--tm-color-danger-500)/30 bg-(--tm-color-danger-100)/60',
      text: 'text-(--tm-color-danger-600)',
      dot: 'bg-(--tm-color-danger-500)',
    },
  };

export interface StatusBannerProps {
  /** Visual variant controlling color tokens. @default 'accent' */
  variant?: StatusBannerVariant;
  /** Main banner content. */
  children: React.ReactNode;
  /** Optional trailing action (e.g. a `Link`). */
  action?: React.ReactNode;
  /** Show the leading pulsing dot indicator. @default true */
  showIndicator?: boolean;
  /** Additional classes for outer container (e.g. margins). */
  className?: string;
}

export function StatusBanner({
  variant = 'accent',
  children,
  action,
  showIndicator = true,
  className,
}: StatusBannerProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={[
        'flex items-center gap-3 rounded-xl border px-4 py-3 animate-fade-in-up',
        styles.container,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showIndicator && (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={[
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
              styles.dot,
            ].join(' ')}
          />
          <span
            className={['relative inline-flex h-2.5 w-2.5 rounded-full', styles.dot].join(' ')}
          />
        </span>
      )}

      <div className={['text-sm', styles.text].join(' ')}>{children}</div>

      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
