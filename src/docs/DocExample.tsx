/* Frame for live components on the MDX docs pages. Not part of the public API. */
import type { ReactNode } from 'react';

/**
 * Docs pages are always light, but components follow the Theme toolbar. This frame paints the
 * active theme's background and text colour behind them, like Storybook's own story previews, and
 * `sb-unstyled` stops Storybook's Markdown styles (heading underlines, margins) leaking in.
 */
export function DocExample({ children }: { children: ReactNode }) {
  return (
    <div
      className="sb-unstyled"
      style={{
        marginBlock: 'var(--ds-space-6)',
        padding: 'var(--ds-space-6)',
        border: '1px solid var(--ds-color-border)',
        borderRadius: 'var(--ds-radius-lg)',
        background: 'var(--ds-color-bg)',
        color: 'var(--ds-color-text)',
        fontFamily: 'var(--ds-font-sans)',
      }}
    >
      {children}
    </div>
  );
}
