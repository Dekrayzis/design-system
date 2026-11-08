import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The outline level. Pick it from the document structure, never from the size you want. */
  level: HeadingLevel;
  /** Visual size, independent of `level`. Defaults to the level's natural size. */
  size?: HeadingSize;
}

/** A section heading whose level (semantics) and size (looks) are set separately. */
export function Heading({ level, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cx(styles.heading, styles[`size-${size ?? defaultSize[level]}`], className)} {...rest} />;
}
