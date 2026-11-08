import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'subtle';

interface LinkStyleProps {
  /** `default` uses the accent text colour; `subtle` inherits the surrounding text colour. Both stay underlined. */
  variant?: LinkVariant;
}

/**
 * The Link class names, for router links that render their own `<a>`:
 * `<NextLink href="/docs" className={linkClassName()}>Docs</NextLink>`.
 */
export function linkClassName({ variant = 'default', className }: LinkStyleProps & { className?: string } = {}) {
  return cx(styles.link, styles[variant], className);
}

/** Adds `noopener noreferrer` to whatever `rel` the consumer passed, without duplicates. */
function externalRel(rel: string | undefined) {
  const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  tokens.add('noopener');
  tokens.add('noreferrer');
  return [...tokens].join(' ');
}

export interface LinkProps extends LinkStyleProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /**
   * Opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), shows an icon and tells
   * screen reader users with `externalLabel`.
   */
  external?: boolean;
  /** Visually hidden text added to external links. */
  externalLabel?: string;
}

/** An inline text link that navigates somewhere. For navigation styled as a button use `LinkButton`. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant, external = false, externalLabel = '(opens in a new tab)', className, rel, target, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={linkClassName({ variant, className })}
      target={external ? '_blank' : target}
      rel={external ? externalRel(rel) : rel}
      {...rest}
    >
      {children}
      {external && (
        <>
          {' '}
          <svg
            className={styles.icon}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M9.5 2.5h4v4M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
          </svg>
          <VisuallyHidden>{externalLabel}</VisuallyHidden>
        </>
      )}
    </a>
  );
});
