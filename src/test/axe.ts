import { configureAxe } from 'jest-axe';

/**
 * Pre-configured jest-axe runner for React Testing Library tests:
 *
 *   expect(await axe(container)).toHaveNoViolations();
 *
 * Colour contrast is off because jsdom doesn't compute styles; the real-browser Storybook
 * tests (addon-a11y via addon-vitest) check contrast instead.
 */
export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});
