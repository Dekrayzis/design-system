/* Test helper: a controllable `prefers-reduced-motion` media query for jsdom, which has no matchMedia. */

/** Simulates the OS "reduce motion" setting, including change events. */
export function mockSystemReducedMotion(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes('reduce') ? matches : false;
    },
    media: query,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  })) as unknown as typeof window.matchMedia;
  return (next: boolean) => {
    matches = next;
    listeners.forEach((fn) => fn());
  };
}
