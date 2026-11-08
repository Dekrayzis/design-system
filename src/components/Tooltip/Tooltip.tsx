import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useAnchorPosition } from '../../utils/useAnchorPosition';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** The tooltip text. Keep it short; tooltips can't hold interactive content. */
  content: ReactNode;
  /** One element, usually focusable (e.g. an `IconButton`). */
  children: ReactElement;
  /**
   * - `description` (default): the trigger is described by the tooltip (`aria-describedby`).
   * - `label`: the trigger already has the same text as its accessible name (an icon button's
   *   `label`), so the tooltip is visual only and hidden from screen readers to avoid repetition.
   */
  kind?: 'description' | 'label';
  placement?: 'top' | 'bottom';
  /** Hover delay before showing, in ms. Keyboard focus shows it immediately. */
  delay?: number;
  /** Class for the inline wrapper around the trigger. */
  className?: string;
}

// When one tooltip has just closed, the next opens without a delay (scanning a toolbar).
let lastClosedAt = 0;
const SKIP_DELAY_MS = 400;
const CLOSE_GRACE_MS = 120;

// Show on focus only when the user's latest input was the keyboard. Browsers also treat some
// programmatic focus as :focus-visible (e.g. a dialog focusing its Close button after a mouse
// click), and a tooltip popping up then would swallow the user's first Escape.
let lastInput: 'keyboard' | 'pointer' = 'keyboard';
/* v8 ignore else -- server-side rendering guard; `window` always exists in the jsdom test environment */
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', () => (lastInput = 'keyboard'), true);
  window.addEventListener('pointerdown', () => (lastInput = 'pointer'), true);
}

function isKeyboardFocus(target: EventTarget) {
  if (lastInput !== 'keyboard') return false;
  try {
    return (target as Element).matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * A short label or description shown on hover and keyboard focus (WAI-ARIA tooltip pattern).
 *
 * Meets WCAG 1.4.13: it is hoverable (the pointer can move onto it), dismissable (Escape closes it
 * without moving focus, and without closing an enclosing Dialog), and persistent (it stays until
 * hover or focus leaves). It renders in the top layer via the Popover API.
 */
export function Tooltip({ content, children, kind = 'description', placement = 'top', delay = 300, className }: TooltipProps) {
  const id = `ds-tooltip-${useId()}`;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  const clear = () => window.clearTimeout(timer.current);
  const show = (immediately = false) => {
    clear();
    const skipDelay = immediately || Date.now() - lastClosedAt < SKIP_DELAY_MS;
    if (skipDelay) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = (afterGrace = false) => {
    clear();
    const close = () => {
      setOpen((wasOpen) => {
        if (wasOpen) lastClosedAt = Date.now();
        return false;
      });
    };
    if (afterGrace) timer.current = window.setTimeout(close, CLOSE_GRACE_MS);
    else close();
  };

  useEffect(() => () => clear(), []);

  // Escape dismisses the tooltip only: capture it before an enclosing Dialog or Select sees it.
  // The exception is a trigger that has opened a popup (a Menu): that Escape is meant for the
  // popup too, so it goes through, or closing the menu would take two presses.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      hide();
      if (anchorRef.current!.querySelector('[aria-expanded="true"]')) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!tip || typeof tip.showPopover !== 'function') return;
    const isOpen = tip.matches(':popover-open');
    if (open && !isOpen) tip.showPopover();
    if (!open && isOpen) tip.hidePopover();
  }, [open]);

  useAnchorPosition(open, anchorRef, tipRef, {
    placement,
    align: 'center',
    matchWidth: false,
    offset: 6,
    maxHeight: 10_000,
  });

  const describable = children as ReactElement<{ 'aria-describedby'?: string }>;
  const trigger =
    kind === 'description' && isValidElement(describable)
      ? cloneElement(describable, {
          'aria-describedby': [describable.props['aria-describedby'], id].filter(Boolean).join(' '),
        })
      : children;

  return (
    <span
      ref={anchorRef}
      className={cx(styles.anchor, className)}
      onPointerEnter={() => show()}
      onPointerLeave={() => hide(true)}
      onFocus={(event: FocusEvent) => {
        if (isKeyboardFocus(event.target)) show(true);
      }}
      onBlur={() => hide()}
    >
      {trigger}
      <div
        ref={tipRef}
        id={id}
        popover="manual"
        role={kind === 'description' ? 'tooltip' : undefined}
        aria-hidden={kind === 'label' || undefined}
        hidden={!open}
        data-state={open ? 'open' : 'closed'}
        className={styles.tooltip}
        onPointerEnter={clear}
        onPointerLeave={() => hide(true)}
      >
        {content}
      </div>
    </span>
  );
}
