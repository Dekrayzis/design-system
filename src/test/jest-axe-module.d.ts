/**
 * Types for jest-axe. `@types/jest-axe` isn't used because it pulls in `@types/jest`, whose global
 * `expect` would replace Vitest's types. (No top-level imports: this must stay an ambient file.)
 */
declare module 'jest-axe' {
  import type { AxeResults, RunOptions, Spec } from 'axe-core';

  type AxeRunner = (html: Element | string, options?: RunOptions) => Promise<AxeResults>;

  export function configureAxe(
    options?: RunOptions & { globalOptions?: Spec; impactLevels?: string[] },
  ): AxeRunner;
  export const axe: AxeRunner;
  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): { pass: boolean; message(): string };
  };
}
