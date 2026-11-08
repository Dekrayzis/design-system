import { useEffect, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'rectangle' | 'circle';
/** A CSS length (`'12rem'`, `'50%'`, `'var(--ds-space-12)'`) or a number of pixels. */
export type SkeletonSize = string | number;

export interface SkeletonProps {
  variant?: SkeletonVariant;
  /** Number of text lines (`text` only). With more than one, the last line is shorter. */
  lines?: number;
  width?: SkeletonSize;
  /** Height of a rectangle, or of a circle (which defaults to its width). Ignored for text. */
  height?: SkeletonSize;
  className?: string;
  style?: CSSProperties;
}

function length(value: SkeletonSize | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * A placeholder shape for content that is loading. Decorative (`aria-hidden`): announce the
 * loading state once from the container, for example with `SkeletonGroup`.
 */
export function Skeleton({ variant = 'text', lines = 1, width, height, className, style }: SkeletonProps) {
  if (variant === 'text') {
    const count = Math.max(1, Math.floor(lines));
    return (
      <span aria-hidden="true" className={cx(styles.lines, className)} style={{ ...style, width: length(width) }}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={cx(styles.skeleton, styles.line, count > 1 && i === count - 1 && styles.last)} />
        ))}
      </span>
    );
  }

  const w = length(width);
  const h = length(height) ?? (variant === 'circle' ? w : undefined);
  return (
    <span
      aria-hidden="true"
      className={cx(styles.skeleton, styles[variant], className)}
      style={{ ...style, width: w, height: h }}
    />
  );
}

export interface SkeletonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** While true the region is `aria-busy`, shows `fallback` and announces `label` once. */
  loading: boolean;
  /** Placeholder shown while loading: usually `Skeleton`s shaped like the content. */
  fallback: ReactNode;
  /** The loaded content. */
  children?: ReactNode;
  /** Announced when loading starts. Default "Loading…". */
  label?: string;
  /** Optionally announced when loading finishes, such as "Invoices loaded". */
  loadedLabel?: string;
}

/**
 * The container for a skeleton: marks the region `aria-busy` while loading and announces the state
 * once through a polite, visually hidden status message, so the skeletons themselves stay silent.
 */
export function SkeletonGroup({
  loading,
  fallback,
  children,
  label = 'Loading…',
  loadedLabel,
  className,
  ...rest
}: SkeletonGroupProps) {
  // A live region that arrives already filled is often skipped, so mount it empty and fill it a tick
  // later (as Alert does). `wasLoading` keeps loadedLabel from being announced for content that was
  // never loading.
  const [ready, setReady] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (loading) setWasLoading(true);
  }, [loading]);

  const message = !ready ? '' : loading ? label : wasLoading ? (loadedLabel ?? '') : '';

  return (
    <div aria-busy={loading} className={cx(styles.group, className)} {...rest}>
      <VisuallyHidden role="status">{message}</VisuallyHidden>
      {loading ? fallback : children}
    </div>
  );
}
