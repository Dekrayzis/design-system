import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './VisuallyHidden.module.css';

/** Content that screen readers announce but sighted users don't see. */
export function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx(styles.visuallyHidden, className)} {...rest} />;
}
