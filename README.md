# @dekrayzis/design-system

A themeable, accessible React component library: CSS-variable design tokens, CSS Modules,
Storybook docs, and React Testing Library tests with axe checks.

## Scripts

| Command                   | What it does                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run storybook`       | Storybook dev server on http://localhost:6006                       |
| `npm test`                | All tests: unit (jsdom) + every story in real Chromium              |
| `npm run test:unit`       | React Testing Library + jest-axe unit tests only (fast)             |
| `npm run test:storybook`  | Story interaction tests + a11y in headless Chromium (Playwright)    |
| `npm run test:watch`      | Unit tests in watch mode                                            |
| `npm run test:coverage`   | Unit tests with V8 coverage                                         |
| `npm run typecheck`       | `tsc --noEmit`                                                      |
| `npm run build`           | Library build to `dist/` (ESM, `styles.css`, `tokens.css`, `.d.ts`) |
| `npm run build-storybook` | Static Storybook to `storybook-static/`                             |
| `npm run check`           | typecheck + test + build                                            |

## Using it

```tsx
import '@dekrayzis/design-system/styles.css';
import { Button, TextField } from '@dekrayzis/design-system';
```

`react` and `react-dom` (18.2+ or 19) are peer dependencies. `TelephoneField` uses `libphonenumber-js` and
`country-flag-icons`, installed as dependencies; its flags load as a separate chunk on first use. The theme follows the OS; force one with
`data-theme="light" | "dark"` on any ancestor. Rebrand by overriding the semantic `--ds-color-*` tokens.

## Components

| Area         | Components                                              |
| ------------ | ------------------------------------------------------- |
| Actions      | `Button`, `LinkButton`, `IconButton`, `ButtonGroup` (segmented control) |
| Forms        | `TextField`, `TextArea`, `Select` + `SelectItem`/`SelectGroup`/`SelectSeparator` (single, multiple, searchable), `Checkbox` + `CheckboxGroup`, `RadioGroup` + `Radio`, `ScaleSelect`, `Switch`, `TelephoneField` (country picker with flags, formatting, E.164 value) |
| Feedback     | `Alert`, `Badge`, `Spinner`, `Skeleton` + `SkeletonGroup` (loading placeholders), `Tooltip`, `ErrorSummary` (+ `useErrorSummary`), `toast()` + `Toaster` |
| Overlays     | `Dialog` (native `<dialog>`), `Menu` + `MenuItem`/`MenuGroup`/`MenuSeparator` (actions menu button) |
| Navigation   | `Link` (+ `linkClassName`), `SkipLink`, `Breadcrumbs`, `Pagination` (+ `PaginationSummary`), `Tabs`, `TabList`, `Tab`, `TabPanel` |
| Content      | `Card`, `CardLink`, `Accordion` + `AccordionItem` (native `<details>`), `Table` primitives + `DataTable` (sortable), `Avatar`, `AvatarGroup`, `Heading`, `LazyImage`, `Marquee` |
| Layout/utils | `Stack`, `VisuallyHidden`                               |

## Validation

Every form control (`TextField`, `TextArea`, `Select`, `Checkbox`, `CheckboxGroup`, `RadioGroup`,
`Switch`) validates with the browser's constraint API, so native attributes just work and invalid
fields block form submission:

```tsx
<TextField label="Email" type="email" required />
<TextField label="Username" minLength={3} pattern="[a-z0-9_]+"
  validationMessages={{ patternMismatch: 'Lowercase letters, numbers and underscores only.' }} />
<TextField label="Confirm" validate={(v) => (v === password ? null : 'Passwords don’t match.')} />
<CheckboxGroup legend="Days" required>…</CheckboxGroup>   {/* at least one */}
```

Errors appear on blur (`validateOn="change" | "submit"` to change that), update live once shown so
they clear as soon as they're fixed, all appear on submit with focus on the first invalid field,
and clear on form reset. An explicit `error` prop always wins (e.g. server errors).

## Project layout

```
src/
  styles/tokens.css        primitives + semantic tokens, light/dark
  styles/base.css          minimal global layer
  components/<Name>/
    <Name>.tsx             component
    <Name>.module.css      styles (tokens only)
    <Name>.stories.tsx     Storybook stories (autodocs)
    <Name>.test.tsx        React Testing Library + jest-axe
  docs/                    MDX pages and composed examples
  test/setup.ts            jest-dom matchers, <dialog> polyfill for jsdom
  test/axe.ts              jest-axe runner: expect(await axe(el)).toHaveNoViolations()
.storybook/                Storybook config; addon-vitest applies it to the story tests
.storybook/                main.ts, preview.tsx (theme toolbar)
```

## Accessibility

- **Keyboard:** every control is reachable and operable; custom widgets follow the WAI-ARIA patterns
  (Select, Tabs, ButtonGroup, Dialog, Tooltip). A story tabs through every control and fails if any
  lacks a visible focus indicator.
- **Screen readers:** native elements first; errors are live regions that exist before they're
  filled, so they're announced when they appear; `ErrorSummary` lists a blocked form's errors, takes
  focus and links to each field; loading buttons and alerts announce themselves; "required" is
  exposed even where `aria-required` isn't allowed (checkbox groups, searchable selects).
- **Contrast:** text meets 4.5:1 and control borders and focus rings 3:1 (WCAG 1.4.3 / 1.4.11), in
  both themes, enforced by `src/styles/tokens.test.ts`.
- **Windows High Contrast (forced colours):** state is restated with system colours and every focus
  ring has an outline, verified by the story tests in forced-colours mode.
- **Motion:** one switch for "less motion": the system setting or the site's `MotionToggle`
  (`data-motion="paused"` on `<html>`). Both collapse every transition token and stop looping
  animations; `useLessMotion()` covers script-driven motion. Inline `motionPauseScript` in `<head>`
  so a saved choice applies before first paint (WCAG 2.2.2).
- **Not automated:** behaviour in real screen readers (NVDA, JAWS, VoiceOver, TalkBack) still needs
  a manual pass, especially the Select patterns.

## Testing

Two Vitest projects run with `npm test`:

- **unit** (jsdom): React Testing Library suites per component, querying by role and accessible
  name, driven with `user-event`, each ending with a jest-axe check:
  `expect(await axe(container)).toHaveNoViolations()`.
- **storybook** (real Chromium via Playwright, `@storybook/addon-vitest`): every story is rendered
  and its `play` function runs as an interaction test, then addon-a11y checks it, including colour
  contrast. Each story runs three times: light, dark and forced colours. This catches what jsdom can't: paint order, layout, the Popover API, `<dialog>`, focus.
  The same tests show in Storybook's Interactions and Accessibility panels.

First run: `npx playwright install chromium`.

## Conventions

- **Semantics first.** Buttons act, links navigate (`Button` vs `LinkButton`), every input has a
  visible `label`, groups use `<fieldset>`/`<legend>`, modals use `<dialog>`.
- **Test like a user.** Query by role and accessible name; drive with `user-event`; every component
  suite ends with an axe check. Colour contrast is checked in Storybook's Accessibility panel instead,
  since jsdom can't compute styles.
- **Tokens only.** Component CSS reads semantic tokens, never palette primitives or raw values.
- **Adding a component:** create the four files above, export it from `src/index.ts`. The story
  smoke test picks up new stories automatically.
