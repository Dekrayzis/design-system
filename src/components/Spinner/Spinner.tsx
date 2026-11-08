import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  /**
   * Announced text. Pass `null` when the spinner sits inside something that already
   * communicates the busy state (e.g. a button with aria-busy).
   */
  label?: string | null;
  className?: string;
}

/** Indeterminate loading indicator. */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  const ring = <span className={cx(styles.spinner, styles[size], className)} aria-hidden="true" />;

  if (label === null) return ring;

  return (
    <span role="status" className={styles.wrapper}>
      {ring}
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
