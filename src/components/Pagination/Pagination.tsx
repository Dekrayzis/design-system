import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Pagination.module.css';

export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}

/**
 * The pages to show: `boundaryCount` pages at each end, `siblingCount` either side of `page`, and
 * an ellipsis for each gap. A gap of exactly one page shows that page instead of an ellipsis, and
 * the list keeps the same length on every page so the controls don't jump about.
 *
 * `getPaginationRange(5, 20)` → `[1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 20]`.
 */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationItem[] {
  const siblings = Math.max(0, Math.floor(siblingCount));
  const boundary = Math.max(0, Math.floor(boundaryCount));
  // Both ends, the current page with its siblings, and two ellipses.
  if (pageCount <= boundary * 2 + siblings * 2 + 3) return range(1, pageCount);

  const current = Math.min(Math.max(page, 1), pageCount);
  const windowStart = Math.min(
    Math.max(current - siblings, boundary + 2),
    pageCount - boundary - 1 - siblings * 2,
  );
  const windowEnd = windowStart + siblings * 2;

  return [
    ...range(1, boundary),
    windowStart === boundary + 2 ? boundary + 1 : 'start-ellipsis',
    ...range(windowStart, windowEnd),
    windowEnd === pageCount - boundary - 1 ? pageCount - boundary : 'end-ellipsis',
    ...range(pageCount - boundary + 1, pageCount),
  ];
}

interface PaginationBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The current page, starting at 1. */
  page: number;
  pageCount: number;
  /** Pages shown either side of the current one. Default 1. */
  siblingCount?: number;
  /** Pages always shown at each end. Default 1. */
  boundaryCount?: number;
  /** Names the navigation landmark. Change it when a page has more than one pagination. */
  'aria-label'?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of each page number. Default `Page 4`. */
  getPageLabel?: (page: number) => string;
}

export interface PaginationLinkProps extends PaginationBaseProps {
  /** Link mode: each page is a real `<a href>`, for shareable, crawlable URLs. */
  getHref: (page: number) => string;
  /** Optional, for client-side routers: called on click before the browser follows the link. */
  onPageChange?: (page: number, event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface PaginationButtonProps extends PaginationBaseProps {
  getHref?: undefined;
  /** Button mode: each page is a `<button>`, for client-side paging such as a table. */
  onPageChange: (page: number, event: MouseEvent<HTMLButtonElement>) => void;
}

export type PaginationProps = PaginationLinkProps | PaginationButtonProps;

const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m10 3.5-4.5 4.5 4.5 4.5" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 3.5 4.5 4.5-4.5 4.5" />
  </svg>
);

/**
 * Page navigation: a labelled `<nav>` holding a list of page links (link mode, with `getHref`) or
 * buttons (button mode, with `onPageChange`). Renders nothing when there is only one page.
 */
export function Pagination(props: PaginationProps) {
  const {
    page,
    pageCount,
    siblingCount = 1,
    boundaryCount = 1,
    'aria-label': ariaLabel = 'Pagination',
    previousLabel = 'Previous',
    nextLabel = 'Next',
    getPageLabel = (p: number) => `Page ${p}`,
    getHref,
    onPageChange,
    className,
    ...rest
  } = props;

  if (pageCount < 2) return null;
  const current = Math.min(Math.max(page, 1), pageCount);

  /** One control. `target` null means "no page to go to" (Previous on page 1, Next on the last). */
  function control(target: number | null, content: ReactNode, extra: { label?: string; current?: boolean; className?: string }) {
    const isCurrent = extra.current === true;
    const classes = cx(styles.control, isCurrent && styles.current, extra.className);

    if (getHref) {
      // There is nowhere to go: a link without a destination would be a lie, so show the label as
      // a greyed placeholder (keeping the layout steady) and hide it from assistive tech.
      if (target === null) return <span className={cx(classes, styles.disabled)}>{content}</span>;
      return (
        <a
          className={classes}
          href={getHref(target)}
          aria-label={extra.label}
          aria-current={isCurrent ? 'page' : undefined}
          onClick={(event) => (onPageChange as PaginationLinkProps['onPageChange'])?.(target, event)}
        >
          {content}
        </a>
      );
    }

    // Button mode keeps unavailable buttons focusable (aria-disabled, not disabled) so focus isn't
    // dropped when Next takes you to the last page.
    return (
      <button
        type="button"
        className={cx(classes, target === null && styles.disabled)}
        aria-label={extra.label}
        aria-current={isCurrent ? 'page' : undefined}
        aria-disabled={target === null || undefined}
        onClick={(event) => {
          if (target === null || isCurrent) return;
          (onPageChange as PaginationButtonProps['onPageChange'])(target, event);
        }}
      >
        {content}
      </button>
    );
  }

  const previous = current > 1 ? current - 1 : null;
  const next = current < pageCount ? current + 1 : null;
  const hideUnavailable = (target: number | null) => (getHref && target === null ? true : undefined);

  return (
    <nav aria-label={ariaLabel} className={cx(styles.pagination, className)} {...rest}>
      <ul className={styles.list}>
        <li className={styles.edge} aria-hidden={hideUnavailable(previous)}>
          {control(
            previous,
            <>
              <ChevronLeft />
              <span>{previousLabel}</span>
            </>,
            { className: styles.step },
          )}
        </li>
        {getPaginationRange(current, pageCount, siblingCount, boundaryCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>{control(item, item, { label: getPageLabel(item), current: item === current })}</li>
          ) : (
            // The numbers either side already say which pages are skipped.
            <li key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
        <li className={styles.edge} aria-hidden={hideUnavailable(next)}>
          {control(
            next,
            <>
              <span>{nextLabel}</span>
              <ChevronRight />
            </>,
            { className: styles.step },
          )}
        </li>
      </ul>
    </nav>
  );
}

export interface PaginationSummaryProps extends HTMLAttributes<HTMLParagraphElement> {
  /** The current page, starting at 1. */
  page: number;
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  /** Announce changes politely (`role="status"`). Use with client-side paging. */
  live?: boolean;
  /** Custom wording. Defaults to "Showing 21–40 of 312". */
  format?: (range: { start: number; end: number; total: number }) => ReactNode;
}

/** Number of pages needed for `total` items, at least 1. */
export function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

const numberFormat = new Intl.NumberFormat();

/** "Showing 21–40 of 312": which items the current page holds. */
export function PaginationSummary({ page, pageSize, total, live = false, format, className, ...rest }: PaginationSummaryProps) {
  // Capping at `total` also gives 0 when there are no items.
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);
  const text = format
    ? format({ start, end, total })
    : `Showing ${numberFormat.format(start)}–${numberFormat.format(end)} of ${numberFormat.format(total)}`;
  return (
    <p role={live ? 'status' : undefined} className={cx(styles.summary, className)} {...rest}>
      {text}
    </p>
  );
}
