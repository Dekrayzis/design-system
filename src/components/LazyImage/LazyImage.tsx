import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './LazyImage.module.css';

type Status = 'loading' | 'loaded' | 'failed';

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'className' | 'alt'> {
  /** Empty shows the fallback straight away. */
  src: string;
  /** Required: describe the image, or `""` when it's purely decorative. */
  alt: string;
  /** On the wrapper, which sizes the image: put layout here. */
  className?: string;
  /** On the <img> itself, e.g. for object-position. */
  imageClassName?: string;
  /** Shown in the image's place when it can't be loaded. */
  fallback?: ReactNode;
  /** The shimmer behind a loading image. Turn off for cut-outs, where a box would show round them. */
  skeleton?: boolean;
  /**
   * Hide an image still loading once the page is interactive, and fade it in when it arrives.
   * Off by default for `loading="eager"` images: hiding the largest image on screen would delay LCP.
   */
  fadeIn?: boolean;
  /** Fill a sized, positioned parent (like `object-fit: cover`) instead of using intrinsic size. */
  fill?: boolean;
}

/**
 * An image that loads lazily, with a skeleton behind it while it loads and a fallback if it fails.
 *
 * - Native lazy loading and async decoding; pass `width`/`height` (or `fill`) so nothing shifts.
 * - Server-rendered, the image paints over the skeleton as it arrives, so it works without
 *   JavaScript. Once interactive, an image still loading is hidden and faded in; one already
 *   loaded or cached is never hidden, so it can't flicker.
 * - The skeleton only appears if loading takes over 150ms (a CSS delay, no timers), so cached and
 *   fast images never flash one.
 * - Status is tracked per `src`, and the <img> is keyed by it, so a late event from an old src
 *   can't land on a new one.
 * - `alt=""` is decorative and its fallback is hidden too; otherwise the fallback is announced as
 *   an image with the same alt.
 *
 * Adapted from Portfolio2k26's LazyImage (there built on next/image).
 */
export function LazyImage({
  src,
  alt,
  className,
  imageClassName,
  fallback = 'Image not available',
  skeleton = true,
  fill = false,
  loading = 'lazy',
  decoding = 'async',
  fadeIn = loading !== 'eager',
  width,
  height,
  ...rest
}: LazyImageProps) {
  const [status, setStatus] = useState<{ src: string; value: Status }>({ src, value: 'loading' });
  // A status recorded for an earlier src doesn't apply to this one.
  const current: Status = !src ? 'failed' : status.src === src ? status.value : 'loading';

  // Catch up with the <img> on mount and for each new src: one that finished before hydration
  // fired its events before anything listened. Only an image still loading is faded in.
  const img = useRef<HTMLImageElement>(null);
  const [waitedFor, setWaitedFor] = useState('');
  useEffect(() => {
    const el = img.current;
    if (!el || !src) return;
    const settle = () => setStatus({ src, value: el.naturalWidth > 0 ? 'loaded' : 'failed' });
    if (el.complete) {
      settle();
      return;
    }
    if (fadeIn) setWaitedFor(src);
    const fail = () => setStatus({ src, value: 'failed' });
    el.addEventListener('load', settle);
    el.addEventListener('error', fail);
    return () => {
      el.removeEventListener('load', settle);
      el.removeEventListener('error', fail);
    };
  }, [src, fadeIn]);
  const waited = waitedFor === src;

  // The fallback keeps the image's shape, so a failed image never collapses the layout.
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  const shape = !fill && w && h ? { width: `${w}px`, aspectRatio: `${w} / ${h}` } : undefined;

  return (
    <span
      className={cx(
        styles.wrapper,
        fill && styles.fill,
        !skeleton && styles.bare,
        styles[current],
        waited && current === 'loading' && styles.waiting,
        waited && current === 'loaded' && styles.revealed,
        className,
      )}
      data-status={current}
    >
      {current === 'failed' ? (
        <span
          className={styles.fallback}
          style={shape}
          {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
        >
          {fallback}
        </span>
      ) : (
        <img
          key={src}
          ref={img}
          {...rest}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          className={cx(styles.img, imageClassName)}
        />
      )}
    </span>
  );
}
