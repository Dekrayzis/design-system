import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { lessMotion } from '../../utils/motion';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import styles from './Toast.module.css';

export type ToastTone = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  tone?: ToastTone;
  /** A second, quieter line under the message. */
  description?: ReactNode;
  /**
   * Milliseconds before it removes itself, sliding off screen; `Infinity` keeps it until
   * dismissed. Defaults to 5000, or `Infinity` for errors and toasts with an action, which people
   * must be able to act on. Timed toasts show a countdown bar.
   */
  duration?: number;
  /** A single action, e.g. Undo. Choosing it also dismisses the toast. */
  action?: { label: string; onClick: () => void };
}

interface ToastRecord {
  id: number;
  message: ReactNode;
  description?: ReactNode;
  tone: ToastTone;
  duration: number;
  action?: ToastOptions['action'];
  /** Playing its exit animation; removed when it ends. */
  leaving?: boolean;
}

/** Matches the exit animation in Toast.module.css. */
const EXIT_MS = 320;

/* ---- Store: lives outside React so a toast raised just before navigation survives it ---- */

let toasts: ToastRecord[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const NONE: ToastRecord[] = [];

/** Timers run only while nothing holds them (hover, focus, a hidden tab). */
const timers = new Map<number, { remaining: number; startedAt: number; handle: number }>();
let holds = 0;
const isHeld = () => holds > 0;

function startTimer(id: number, ms: number) {
  if (!Number.isFinite(ms)) return;
  const handle = holds > 0 ? 0 : window.setTimeout(() => dismissToast(id), ms);
  timers.set(id, { remaining: ms, startedAt: Date.now(), handle });
}

function holdTimers() {
  holds += 1;
  if (holds > 1) return;
  for (const timer of timers.values()) {
    window.clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.startedAt;
    timer.handle = 0;
  }
  emit();
}

function releaseTimers() {
  holds = Math.max(0, holds - 1);
  if (holds > 0) return;
  for (const [id, timer] of timers) {
    timer.startedAt = Date.now();
    timer.handle = window.setTimeout(() => dismissToast(id), Math.max(timer.remaining, 0));
  }
  emit();
}

function remove(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/** Dismiss a toast: it slides off screen, then is removed (instantly when motion is reduced). */
export function dismissToast(id: number) {
  const timer = timers.get(id);
  if (timer) window.clearTimeout(timer.handle);
  timers.delete(id);
  const record = toasts.find((t) => t.id === id);
  if (!record || record.leaving) return;
  if (lessMotion()) {
    remove(id);
    return;
  }
  toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  window.setTimeout(() => remove(id), EXIT_MS);
}

/**
 * Show a toast from anywhere (no hook or context needed). Returns its id for `dismissToast`.
 * Requires a `<Toaster />` mounted once, e.g. in your app layout.
 */
export function toast(message: ReactNode, { tone = 'success', description, duration, action }: ToastOptions = {}) {
  const id = nextId++;
  const lifetime = duration ?? (tone === 'error' || action ? Infinity : 5000);
  toasts = [...toasts, { id, message, description, tone, duration: lifetime, action }];
  emit();
  startTimer(id, lifetime);
  return id;
}

/** Clears every toast at once, without animation; mainly for tests and route resets. */
export function clearToasts() {
  for (const timer of timers.values()) window.clearTimeout(timer.handle);
  timers.clear();
  holds = 0;
  toasts = [];
  emit();
}

/* ---- Toaster ---- */

const ASSERTIVE: ToastTone[] = ['error', 'warning'];

const ICONS: Record<ToastTone, ReactNode> = {
  success: <path d="m6.5 10.5 2.5 2.5 4.5-5" />,
  info: <path d="M10 9v4.5M10 6.5v.01" />,
  warning: <path d="M10 6.5v4M10 13.5v.01" />,
  error: <path d="m7.5 7.5 5 5m0-5-5 5" />,
};

export type ToasterPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToasterProps {
  /** Accessible name of the notifications landmark. */
  label?: string;
  /** Where the stack sits. Toasts leave towards the nearest screen edge. */
  position?: ToasterPosition;
  className?: string;
}

/**
 * Renders toasts. Mount once.
 *
 * Two live regions are always in the page, so each new toast is announced: success and info
 * politely, warnings and errors at once. Timers (and the countdown bar) pause while the pointer or
 * keyboard focus is in the stack, and while the tab is hidden (WCAG 2.2.1). Toasts never take
 * focus; their buttons are in the normal tab order. Each toast slides off towards the nearest
 * screen edge when it goes, and the stack closes the gap smoothly.
 *
 * Adapted from Portfolio2k26's admin Toaster.
 */
export function Toaster({ label = 'Notifications', position = 'bottom-right', className }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, () => toasts, () => NONE);
  const held = useSyncExternalStore(subscribe, isHeld, () => false);
  const hovering = useRef(false);
  const focused = useRef(false);
  const top = position.startsWith('top');

  // Pause while the tab is hidden: a toast that expires unseen is a toast nobody read.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? holdTimers() : releaseTimers());
    if (document.hidden) holdTimers();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (document.hidden) releaseTimers();
    };
  }, []);

  const setHold = (ref: { current: boolean }, next: boolean) => {
    if (ref.current === next) return;
    ref.current = next;
    if (next) holdTimers();
    else releaseTimers();
  };

  return (
    <section
      aria-label={label}
      className={cx(styles.toaster, className)}
      data-position={position}
      data-held={held || undefined}
      onPointerEnter={() => setHold(hovering, true)}
      onPointerLeave={() => setHold(hovering, false)}
      onFocus={() => setHold(focused, true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHold(focused, false);
      }}
    >
      {(['polite', 'assertive'] as const).map((politeness) => (
        <div
          key={politeness}
          className={styles.region}
          role={politeness === 'assertive' ? 'alert' : 'status'}
          aria-live={politeness}
        >
          {list
            .filter((t) => ASSERTIVE.includes(t.tone) === (politeness === 'assertive'))
            .map((t) => (
              <div
                key={t.id}
                className={styles.item}
                // Both regions are display: contents, so `order` interleaves them chronologically;
                // the newest sits nearest the screen edge.
                style={{ order: top ? -t.id : t.id }}
                data-leaving={t.leaving || undefined}
              >
                <div
                  className={styles.toast}
                  data-tone={t.tone}
                  style={
                    Number.isFinite(t.duration)
                      ? ({ '--toast-duration': `${t.duration}ms` } as CSSProperties)
                      : undefined
                  }
                >
                  <span className={styles.icon} aria-hidden="true">
                    <svg
                      viewBox="0 0 20 20"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[t.tone]}
                    </svg>
                  </span>
                  <div className={styles.text}>
                    <div className={styles.message}>{t.message}</div>
                    {t.description && <div className={styles.description}>{t.description}</div>}
                    {t.action && (
                      <Button
                        className={styles.action}
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          t.action?.onClick();
                          dismissToast(t.id);
                        }}
                      >
                        {t.action.label}
                      </Button>
                    )}
                  </div>
                  <IconButton
                    className={styles.close}
                    size="sm"
                    label="Dismiss"
                    tooltip={false}
                    onClick={() => dismissToast(t.id)}
                    icon={
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="m4 4 8 8m0-8-8 8" />
                      </svg>
                    }
                  />
                  {Number.isFinite(t.duration) && <span className={styles.timer} aria-hidden="true" />}
                </div>
              </div>
            ))}
        </div>
      ))}
    </section>
  );
}
