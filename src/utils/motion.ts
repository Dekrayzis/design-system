import { useSyncExternalStore } from 'react';

/**
 * One switch for "less motion": the visitor's system setting, or the site's pause switch.
 *
 * `setMotionPaused(true)` sets `data-motion="paused"` on <html>. tokens.css treats that exactly
 * like `prefers-reduced-motion: reduce` (every transition token collapses) and components key their
 * own animations off both, so CSS and scripted effects stop together. Use `useLessMotion()` in
 * script-driven animation (video autoplay, counters, carousels) to honour both triggers.
 *
 * Adapted from Portfolio2k26's lib/motion.ts.
 */
export const MOTION_STORAGE_KEY = 'ds-motion-paused';
const ATTRIBUTE = 'data-motion';
const EVENT = 'ds-motionchange';
const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Inline this in <head> (before your bundle) so a saved "paused" choice applies before first
 * paint, with no flash of motion: `<script dangerouslySetInnerHTML={{ __html: motionPauseScript }} />`.
 */
export const motionPauseScript = `try{if(localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})==='1')document.documentElement.setAttribute('${ATTRIBUTE}','paused')}catch(e){}`;

export function systemReducesMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true;
}

export function isMotionPaused(): boolean {
  return typeof document !== 'undefined' && document.documentElement.getAttribute(ATTRIBUTE) === 'paused';
}

/** True when anything should hold still: the system setting or the pause switch. */
export function lessMotion(): boolean {
  return systemReducesMotion() || isMotionPaused();
}

export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.setAttribute(ATTRIBUTE, 'paused');
  else root.removeAttribute(ATTRIBUTE);
  try {
    if (paused) localStorage.setItem(MOTION_STORAGE_KEY, '1');
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Storage blocked: the choice still holds for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia?.(QUERY);
  query?.addEventListener('change', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    query?.removeEventListener('change', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

// The server can't know either setting, so it renders full motion; the client corrects it
// straight after hydration.
const onServer = () => false;

/** Re-renders when either trigger changes. */
export function useLessMotion(): boolean {
  return useSyncExternalStore(subscribe, lessMotion, onServer);
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, isMotionPaused, onServer);
}

export function useSystemReducesMotion(): boolean {
  return useSyncExternalStore(subscribe, systemReducesMotion, onServer);
}
