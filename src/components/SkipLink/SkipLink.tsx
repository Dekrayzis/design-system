import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../utils/cx';
import styles from './SkipLink.module.css';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** A same-page fragment pointing at the main content. Defaults to `#main`. */
  href?: string;
}

/**
 * Moves keyboard focus to the element a fragment link points at. Browsers don't reliably move
 * focus to a target that isn't focusable, so such a target gets `tabindex="-1"` for as long as it
 * holds focus.
 */
function focusTarget(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return;
  const doc = event.currentTarget.ownerDocument;
  let id: string;
  try {
    id = decodeURIComponent(href.slice(1));
  } catch {
    // A malformed escape such as "#%": leave it to the browser's own fragment handling.
    return;
  }
  const target = doc.getElementById(id);
  if (!target) return;

  target.focus();
  if (doc.activeElement === target) return;

  target.setAttribute('tabindex', '-1');
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  target.focus();
}

/**
 * "Skip to main content" (WCAG 2.4.1). Hidden until it receives keyboard focus, then shown at the
 * top left. Render it as the first focusable element on the page.
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = '#main', children = 'Skip to main content', className, onClick, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      className={cx(styles.skipLink, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) focusTarget(event, href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
});
