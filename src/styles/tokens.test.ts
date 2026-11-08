/**
 * Contrast guard for the colour tokens, read straight from tokens.css. axe only checks text
 * contrast; this also covers WCAG 1.4.11 (non-text contrast) for control borders and focus rings,
 * in both themes, so a palette tweak can't quietly make controls hard to see.
 */
import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

// Read from disk: Vitest stubs CSS imports (even `?raw`) to empty strings in unit tests.
const css = readFileSync(resolvePath(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/** Custom properties declared inside the first block that follows `selector`. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`No block for ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const vars: Record<string, string> = {};
  for (const [, name, value] of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    vars[name as string] = (value as string).trim();
  }
  return vars;
}

const root = block(':root {');
const dark = { ...root, ...block("[data-theme='dark'] {") };

function resolve(theme: Record<string, string>, name: string): string {
  let value = theme[name];
  for (let i = 0; value?.startsWith('var(') && i < 5; i++) value = theme[value.slice(4, -1).trim()];
  if (!value?.startsWith('#')) throw new Error(`${name} did not resolve to a hex colour (got ${value})`);
  return value;
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const surfaces = ['--ds-color-bg', '--ds-color-bg-subtle', '--ds-color-surface', '--ds-color-surface-raised'];

describe.each([
  ['light', root],
  ['dark', dark],
])('%s theme tokens', (_theme, theme) => {
  it.each(surfaces)('control borders reach 3:1 on %s (WCAG 1.4.11)', (surface) => {
    expect(contrast(resolve(theme, '--ds-color-border-strong'), resolve(theme, surface))).toBeGreaterThanOrEqual(3);
  });

  it.each(surfaces)('the focus ring reaches 3:1 on %s (WCAG 1.4.11)', (surface) => {
    expect(contrast(resolve(theme, '--ds-color-focus'), resolve(theme, surface))).toBeGreaterThanOrEqual(3);
  });

  it.each(['--ds-color-text', '--ds-color-text-muted', '--ds-color-accent-text', '--ds-color-danger-text'])(
    '%s reaches 4.5:1 on every surface (WCAG 1.4.3)',
    (token) => {
      for (const surface of surfaces) {
        expect(contrast(resolve(theme, token), resolve(theme, surface)), surface).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it('text on accent and danger fills reaches 4.5:1', () => {
    expect(contrast(resolve(theme, '--ds-color-on-accent'), resolve(theme, '--ds-color-accent'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(resolve(theme, '--ds-color-on-danger'), resolve(theme, '--ds-color-danger'))).toBeGreaterThanOrEqual(4.5);
  });
});
