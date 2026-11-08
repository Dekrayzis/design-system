/**
 * Vitest typing for jest-axe's matcher (registered in src/test/setup.ts). The module itself is
 * declared in jest-axe-module.d.ts.
 */
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> {
    /** jest-axe: fails with a readable list of accessibility violations. */
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): unknown;
  }
}
