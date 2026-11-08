import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Stack.module.css';

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Use `ul`/`ol` when the children are a list of things; their children must then be `li`. */
  as?: 'div' | 'ul' | 'ol' | 'section' | 'nav' | 'header' | 'footer';
  direction?: 'column' | 'row';
  gap?: Space;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
}

/** Lays out children in a row or column with token-based spacing. */
export function Stack({
  as = 'div',
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  className,
  style,
  ...rest
}: StackProps) {
  const Element = as as ElementType;
  return (
    <Element
      className={cx(styles.stack, styles[direction], wrap && styles.wrap, className)}
      style={{ gap: `var(--ds-space-${gap})`, alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  );
}
