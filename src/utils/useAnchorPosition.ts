import { useLayoutEffect, type RefObject } from 'react';

interface Options {
  /** Gap between anchor and floating element, in px. */
  offset?: number;
  /** Minimum distance kept from the viewport edges, in px. */
  margin?: number;
  /** Preferred maximum height of the floating element, in px. */
  maxHeight?: number;
  /** Side to use when both fit. The other side is used when only it has room. */
  placement?: 'bottom' | 'top';
  /** Align to the anchor's start edge (menus) or centre (tooltips). */
  align?: 'start' | 'center';
  /** Make the floating element at least as wide as the anchor (menus, not tooltips). */
  matchWidth?: boolean;
}

/**
 * Positions a `position: fixed` element under (or, when there's more room, over) its anchor,
 * matches the anchor's width as a minimum, clamps it inside the viewport and caps its height to
 * the space available. Re-runs on scroll in any ancestor, on resize and when either element
 * changes size, so it stays attached without a portal or a positioning library.
 */
export function useAnchorPosition(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  { offset = 4, margin = 8, maxHeight = 320, placement = 'bottom', align = 'start', matchWidth = true }: Options = {},
) {
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!open || !anchor || !floating) return;

    let frame = 0;
    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom - offset - margin;
      const spaceAbove = rect.top - offset - margin;
      const naturalHeight = Math.min(floating.scrollHeight, maxHeight);
      const placeBelow =
        placement === 'bottom'
          ? spaceBelow >= naturalHeight || spaceBelow >= spaceAbove
          : !(spaceAbove >= naturalHeight || spaceAbove >= spaceBelow);
      const available = Math.max(placeBelow ? spaceBelow : spaceAbove, 80);

      if (matchWidth) floating.style.minWidth = `${rect.width}px`;
      floating.style.maxHeight = `${Math.min(available, maxHeight)}px`;

      // Measure at a neutral position: where it currently sits can squeeze its shrink-to-fit width.
      floating.style.left = '0px';
      const width = floating.offsetWidth;
      const preferredLeft = align === 'center' ? rect.left + rect.width / 2 - width / 2 : rect.left;
      const left = Math.min(Math.max(preferredLeft, margin), viewportWidth - width - margin);
      floating.style.left = `${Math.max(left, margin)}px`;

      if (placeBelow) {
        floating.style.top = `${rect.bottom + offset}px`;
        floating.style.bottom = 'auto';
      } else {
        floating.style.top = 'auto';
        floating.style.bottom = `${viewportHeight - rect.top + offset}px`;
      }
      floating.dataset.side = placeBelow ? 'bottom' : 'top';
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(anchor);
    observer?.observe(floating);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [open, anchorRef, floatingRef, offset, margin, maxHeight, placement, align, matchWidth]);
}
