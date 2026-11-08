import { Children, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useLessMotion } from '../../utils/motion';
import { IconButton } from '../IconButton/IconButton';
import styles from './Marquee.module.css';

export interface MarqueeProps {
  /** Names the strip for assistive tech, e.g. "Tools I use". */
  label: string;
  /** The items. Each child becomes one list item. */
  children: ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  /** Space between items (any CSS length or token). */
  gap?: string;
  /** How far the edges fade, as a percentage of the width. 0 for hard edges. */
  fade?: number;
  /** Travel left to right. */
  reverse?: boolean;
  /**
   * Times the list repeats inside each copy. The loop slides one copy's width, so a short list
   * must repeat until a copy is wider than the strip, or a gap opens at the seam.
   */
  repeat?: number;
  /**
   * Show a pause/play button (default). Moving content needs a way to stop it (WCAG 2.2.2); hover
   * and focus pausing alone don't reach touch or screen reader users. Turn this off only when a
   * site-wide `MotionToggle` is on the page.
   */
  controls?: boolean;
  className?: string;
}

/**
 * An endless horizontal strip, e.g. a row of logos or tools.
 *
 * Two copies of the list slide by exactly one copy's width, so the loop is seamless; each copy
 * carries a trailing gap so the seam matches the spacing between items. The second copy and any
 * repeats are hidden from assistive tech, so the list is announced once. It pauses on hover and
 * focus, has its own pause button, and when motion is reduced (system setting or `MotionToggle`)
 * it becomes a static strip that scrolls sideways, focusable so keyboard users can scroll it too.
 *
 * Adapted from Portfolio2k26's marquee.
 */
export function Marquee({
  label,
  children,
  duration = 40,
  gap = 'var(--ds-space-8)',
  fade = 12,
  reverse = false,
  repeat = 1,
  controls = true,
  className,
}: MarqueeProps) {
  const lessMotion = useLessMotion();
  const [paused, setPaused] = useState(false);
  const items = Children.toArray(children);

  const copy = (duplicate: boolean) => (
    <ul className={styles.group} aria-hidden={duplicate || undefined} aria-label={duplicate ? undefined : label}>
      {Array.from({ length: repeat }, (_, run) =>
        items.map((item, index) => (
          <li
            key={`${run}-${index}`}
            // Only the first run is real content: repeats are hidden from assistive tech and
            // dropped when the strip holds still.
            className={run > 0 ? styles.repeat : undefined}
            aria-hidden={run > 0 || undefined}
          >
            {item}
          </li>
        )),
      )}
    </ul>
  );

  return (
    <div
      className={cx(styles.root, className)}
      style={
        {
          '--marquee-duration': `${duration}s`,
          '--marquee-gap': gap,
          '--marquee-fade': `${fade}%`,
        } as CSSProperties
      }
      data-reverse={reverse || undefined}
      data-paused={paused || undefined}
      data-static={lessMotion || undefined}
    >
      <div
        className={styles.viewport}
        // Static, it's a scroll area: keyboard users need to be able to focus it to scroll.
        tabIndex={lessMotion ? 0 : undefined}
        role={lessMotion ? 'region' : undefined}
        aria-label={lessMotion ? label : undefined}
      >
        <div className={styles.track}>
          {copy(false)}
          {copy(true)}
        </div>
      </div>
      {controls && !lessMotion && (
        <IconButton
          className={styles.toggle}
          size="sm"
          variant="secondary"
          label={paused ? `Play ${label}` : `Pause ${label}`}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          icon={
            paused ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 4.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 6 4.5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <rect x="5" y="4" width="3.5" height="12" rx="1" />
                <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
              </svg>
            )
          }
        />
      )}
    </div>
  );
}
