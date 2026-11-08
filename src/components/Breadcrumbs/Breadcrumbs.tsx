import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { linkClassName } from '../Link/Link';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Where the crumb goes. The last item is the current page; give it an `href` to render it as a link too. */
  href?: string;
}

export interface BreadcrumbLinkProps {
  href: string;
  className: string;
  children: ReactNode;
  /** Set on the current page's link. */
  'aria-current'?: 'page';
  item: BreadcrumbItem;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The trail from the top level down. The last item is the current page. */
  items: BreadcrumbItem[];
  /** The navigation landmark's name. Defaults to "Breadcrumb". */
  label?: string;
  /**
   * Renders each link, for router links:
   * `renderLink={({ item, ...props }) => <NextLink {...props} />}`. Spread the props so the
   * styling and `aria-current` arrive.
   */
  renderLink?: (props: BreadcrumbLinkProps) => ReactNode;
  /**
   * Collapse longer trails to the first item, a "…" button and the last `maxItems - 1` items.
   * The button reveals the full trail. Minimum 2.
   */
  maxItems?: number;
  /** Accessible name of the "…" button. */
  expandLabel?: string;
}

const defaultRenderLink = ({ item: _item, ...props }: BreadcrumbLinkProps) => <a {...props} />;

/** A trail of links from the top level to the current page, inside a labelled `<nav>`. */
export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  renderLink = defaultRenderLink,
  maxItems,
  expandLabel = 'Show full breadcrumb trail',
  className,
  ...rest
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const firstRevealedRef = useRef<HTMLLIElement>(null);
  const focusRevealed = useRef(false);

  const max = maxItems === undefined ? Infinity : Math.max(2, maxItems);
  const collapsed = !expanded && items.length > max;
  // When collapsed: the first item, the "…" button, then the last `max - 1` items.
  const tailStart = items.length - (max - 1);

  useEffect(() => {
    if (!focusRevealed.current) return;
    focusRevealed.current = false;
    // The "…" button has gone, so move focus to the first crumb it revealed.
    (firstRevealedRef.current!.querySelector('a') ?? listRef.current!).focus();
  }, [expanded]);

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const current = index === items.length - 1;
    const content = item.href ? (
      renderLink({
        href: item.href,
        className: cx(linkClassName({ variant: 'subtle' }), styles.link),
        children: item.label,
        'aria-current': current ? 'page' : undefined,
        item,
      })
    ) : (
      <span className={styles.text} aria-current={current ? 'page' : undefined}>
        {item.label}
      </span>
    );
    return (
      <li
        key={index}
        ref={expanded && index === 1 ? firstRevealedRef : undefined}
        className={cx(styles.item, current && styles.current)}
      >
        {content}
      </li>
    );
  };

  return (
    <nav aria-label={label} className={cx(styles.breadcrumbs, className)} {...rest}>
      <ol ref={listRef} className={styles.list} tabIndex={expanded ? -1 : undefined}>
        {collapsed ? (
          <>
            {renderItem(items[0]!, 0)}
            <li className={styles.item}>
              <button
                type="button"
                className={styles.expand}
                onClick={() => {
                  focusRevealed.current = true;
                  setExpanded(true);
                }}
              >
                <span aria-hidden="true">…</span>
                <VisuallyHidden>{expandLabel}</VisuallyHidden>
              </button>
            </li>
            {items.slice(tailStart).map((item, i) => renderItem(item, tailStart + i))}
          </>
        ) : (
          items.map(renderItem)
        )}
      </ol>
    </nav>
  );
}
