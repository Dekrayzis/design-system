import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Two test projects:
 *
 * - `unit`: React Testing Library + jest-axe in jsdom. Fast; covers behaviour and semantics.
 * - `storybook`: every story rendered in real Chromium (Playwright) with its play function run as
 *   an interaction test and addon-a11y checking it (including colour contrast), in light, dark and
 *   forced-colours mode. Catches what jsdom can't: layout, stacking, the Popover API, focus, real
 *   event handling and theme-specific contrast.
 *
 * Run one with `--project unit` or `--project storybook`.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**', 'src/docs/**', 'src/**/*.d.ts'],
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/test/setup.ts'],
            include: ['src/**/*.test.{ts,tsx}'],
            css: { modules: { classNameStrategy: 'non-scoped' } },
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: '.storybook' })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              // Every story runs three times: light, dark and Windows High Contrast (forced
              // colours), so contrast and focus visibility are checked in each.
              instances: [
                { browser: 'chromium', name: 'light', provider: playwright({ contextOptions: { colorScheme: 'light' } }) },
                { browser: 'chromium', name: 'dark', provider: playwright({ contextOptions: { colorScheme: 'dark' } }) },
                {
                  browser: 'chromium',
                  name: 'forced-colors',
                  provider: playwright({ contextOptions: { forcedColors: 'active' } }),
                },
              ],
            },
          },
        },
      ],
    },
  }),
);
