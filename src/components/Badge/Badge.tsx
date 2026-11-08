import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Badge.module.css';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

/** A short, non-interactive status label. Don't rely on colour alone: the text must carry the meaning. */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cx(styles.badge, styles[tone], className)} {...rest} />;
}
