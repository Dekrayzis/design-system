import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * The element to render. Use `article` for self-contained content (a post, a product),
   * `section` when the card has a heading and groups part of the page, `div` otherwise.
   */
  as?: 'article' | 'section' | 'div' | 'li';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Raised cards get a shadow; flat cards only a border. */
  elevation?: 'flat' | 'raised';
  /** Lift on hover. Pair with a `CardLink` so the whole card is clickable. */
  interactive?: boolean;
}

/** A surface that groups related content. */
export function Card({
  as = 'div',
  padding = 'md',
  elevation = 'flat',
  interactive = false,
  className,
  ...rest
}: CardProps) {
  const Element = as as ElementType;
  return (
    <Element
      className={cx(
        styles.card,
        styles[`padding-${padding}`],
        elevation === 'raised' && styles.raised,
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    />
  );
}

export interface CardLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

/**
 * The card's primary link. Its hit area stretches over the whole card, so other buttons
 * inside the card stay separate, focusable controls instead of nesting inside a link.
 */
export function CardLink({ className, ...rest }: CardLinkProps) {
  return <a className={cx(styles.link, className)} {...rest} />;
}
