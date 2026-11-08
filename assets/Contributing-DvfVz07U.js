import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./DocBanner-DKfOrOn6.js";var c;function l(){return(l=e((()=>{c=new URL(`banner-contributing-CY_C8Llu.webp`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,h2:`h2`,h3:`h3`,input:`input`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{title:`Guides/Contributing`}),`
`,(0,f.jsx)(s,{title:`Contributing`,eyebrow:`Guides`,src:c}),`
`,(0,f.jsx)(t.p,{children:`How to add or change a component so it fits with the rest of the system.`}),`
`,(0,f.jsx)(t.h2,{id:`setup`,children:`Setup`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-bash`,children:`npm install\r
npx playwright install chromium   # once, for the story tests\r
npm run storybook                 # http://localhost:6006
`})}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`Command`}),(0,f.jsx)(t.th,{children:`What it does`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm test`})}),(0,f.jsx)(t.td,{children:`Everything: unit tests (jsdom) and every story in real Chromium.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm run test:unit`})}),(0,f.jsx)(t.td,{children:`Unit tests only. Fast; use while you work.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm run test:storybook`})}),(0,f.jsx)(t.td,{children:`Story interaction and accessibility tests in headless Chromium.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm run typecheck`})}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`tsc --noEmit`}),`.`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm run build`})}),(0,f.jsxs)(t.td,{children:[`Library build to `,(0,f.jsx)(t.code,{children:`dist/`}),`.`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.code,{children:`npm run check`})}),(0,f.jsx)(t.td,{children:`Typecheck, test and build. Run before you open a pull request.`})]})]})]}),`
`,(0,f.jsx)(t.h2,{id:`adding-a-component`,children:`Adding a component`}),`
`,(0,f.jsx)(t.p,{children:`Each component lives in its own folder with four files:`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{children:`src/components/Rating/\r
  Rating.tsx            the component and its props\r
  Rating.module.css     styles, reading tokens only\r
  Rating.stories.tsx    Storybook stories (autodocs)\r
  Rating.test.tsx       React Testing Library + jest-axe
`})}),`
`,(0,f.jsxs)(t.p,{children:[`Then export it, and its prop types, from `,(0,f.jsx)(t.code,{children:`src/index.ts`}),`.`]}),`
`,(0,f.jsx)(t.h3,{id:`1-pick-the-element-first`,children:`1. Pick the element first`}),`
`,(0,f.jsxs)(t.p,{children:[`Decide what the thing `,(0,f.jsx)(t.strong,{children:`is`}),` before how it looks. If HTML has an element for it (`,(0,f.jsx)(t.code,{children:`<button>`}),`,\r
`,(0,f.jsx)(t.code,{children:`<a>`}),`, `,(0,f.jsx)(t.code,{children:`<input type="checkbox">`}),`, `,(0,f.jsx)(t.code,{children:`<dialog>`}),`, `,(0,f.jsx)(t.code,{children:`<fieldset>`}),`), build on that element. Only reach\r
for ARIA roles when HTML can't express the pattern, and then follow the\r
`,(0,f.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/`,rel:`nofollow`,children:`WAI-ARIA Authoring Practices`}),` pattern exactly,\r
keyboard included.`]}),`
`,(0,f.jsx)(t.h3,{id:`2-props`,children:`2. Props`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Spread the rest of the props onto the underlying element, and type them by extending its\r
attributes (`,(0,f.jsx)(t.code,{children:`ButtonHTMLAttributes<HTMLButtonElement>`}),`), so `,(0,f.jsx)(t.code,{children:`id`}),`, `,(0,f.jsx)(t.code,{children:`aria-*`}),`, `,(0,f.jsx)(t.code,{children:`data-*`}),` and event\r
handlers just work.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Accept `,(0,f.jsx)(t.code,{children:`className`}),` and merge it with `,(0,f.jsx)(t.code,{children:`cx()`}),`. Don't accept a `,(0,f.jsx)(t.code,{children:`style`}),`-like escape hatch for internals.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Form controls take a required `,(0,f.jsx)(t.code,{children:`label`}),`, an optional `,(0,f.jsx)(t.code,{children:`hint`}),`, an `,(0,f.jsx)(t.code,{children:`error`}),`, and the validation props\r
from `,(0,f.jsx)(t.code,{children:`src/utils/validation.ts`}),`. Support both controlled (`,(0,f.jsx)(t.code,{children:`value`}),`/`,(0,f.jsx)(t.code,{children:`onChange`}),`) and uncontrolled\r
(`,(0,f.jsx)(t.code,{children:`defaultValue`}),`) use.`]}),`
`,(0,f.jsx)(t.li,{children:`Document each prop with a JSDoc comment: Storybook shows it in the props table.`}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`3-styles`,children:`3. Styles`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Use semantic tokens only: `,(0,f.jsx)(t.code,{children:`--ds-color-*`}),`, `,(0,f.jsx)(t.code,{children:`--ds-space-*`}),`, `,(0,f.jsx)(t.code,{children:`--ds-radius-*`}),`, `,(0,f.jsx)(t.code,{children:`--ds-duration-*`}),`.\r
Never a palette primitive, never a raw colour or pixel value that a token covers.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Use the duration tokens for every transition, so reduced motion works automatically. Stop any\r
`,(0,f.jsx)(t.code,{children:`@keyframes`}),` animation under `,(0,f.jsx)(t.code,{children:`prefers-reduced-motion`}),` `,(0,f.jsx)(t.strong,{children:`and`}),` `,(0,f.jsx)(t.code,{children:`:root[data-motion='paused']`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Make keyboard focus visible with an `,(0,f.jsx)(t.code,{children:`outline`}),` (not only a `,(0,f.jsx)(t.code,{children:`box-shadow`}),`): forced-colours mode\r
removes shadows.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Add a `,(0,f.jsx)(t.code,{children:`@media (forced-colors: active)`}),` block if state is shown with colour alone (selected,\r
checked, invalid).`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`4-stories`,children:`4. Stories`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Set `,(0,f.jsx)(t.code,{children:`title: 'Components/<Name>'`}),` and a component description in\r
`,(0,f.jsx)(t.code,{children:`parameters.docs.description.component`}),`: what it is, what element it renders, when to use\r
something else.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Put a `,(0,f.jsx)(t.code,{children:`/** JSDoc */`}),` comment above every story; it becomes the story's description in the docs.`]}),`
`,(0,f.jsx)(t.li,{children:`Cover the default, each variant and size, disabled, error and loading states, and a realistic\r
composed use.`}),`
`,(0,f.jsxs)(t.li,{children:[`Add a `,(0,f.jsx)(t.code,{children:`play`}),` function to stories with behaviour. It runs as a test in light, dark and forced\r
colours, then axe runs on the result.`]}),`
`,(0,f.jsxs)(t.li,{children:[`If the component is focusable, add it to the\r
`,(0,f.jsx)(t.a,{href:`?path=/story/foundations-focus-indicators--every-control-shows-focus`,children:`Focus indicators`}),` story.`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`5-tests`,children:`5. Tests`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Query the way users find things: `,(0,f.jsx)(t.code,{children:`getByRole('button', { name: 'Save' })`}),`, `,(0,f.jsx)(t.code,{children:`getByLabelText`}),`.\r
Avoid test IDs and class names.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Drive interactions with `,(0,f.jsx)(t.code,{children:`user-event`}),`, including the keyboard.`]}),`
`,(0,f.jsxs)(t.li,{children:[`End every suite with an axe check: `,(0,f.jsx)(t.code,{children:`expect(await axe(container)).toHaveNoViolations()`}),`.`]}),`
`,(0,f.jsx)(t.li,{children:`Test what the user experiences (announcements, focus moves, form submission), not internal state.`}),`
`]}),`
`,(0,f.jsx)(t.h2,{id:`changing-tokens`,children:`Changing tokens`}),`
`,(0,f.jsxs)(t.p,{children:[`Edit `,(0,f.jsx)(t.code,{children:`src/styles/tokens.css`}),`. Change light and dark together, and remember that dark values appear\r
twice (the `,(0,f.jsx)(t.code,{children:`prefers-color-scheme`}),` block and `,(0,f.jsx)(t.code,{children:`[data-theme='dark']`}),`): keep the two identical. The\r
contrast tests in `,(0,f.jsx)(t.code,{children:`src/styles/tokens.test.ts`}),` must still pass. If you add a semantic colour that\r
carries text, borders or focus, add it to those tests.`]}),`
`,(0,f.jsx)(t.h2,{id:`docs`,children:`Docs`}),`
`,(0,f.jsxs)(t.p,{children:[`Foundation and guide pages are MDX files in `,(0,f.jsx)(t.code,{children:`src/docs/foundations`}),` and `,(0,f.jsx)(t.code,{children:`src/docs/guides`}),`. Swatches\r
and examples should use live tokens (`,(0,f.jsx)(t.code,{children:`var(--ds-color-accent)`}),`) or real components so the docs\r
can't drift from the code. Update the README's component table when you add a component.`]}),`
`,(0,f.jsx)(t.h2,{id:`review-checklist`,children:`Review checklist`}),`
`,(0,f.jsxs)(t.ul,{className:`contains-task-list`,children:[`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Native element where one exists; ARIA pattern followed where it doesn't`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Works with keyboard only; focus visible in all three modes`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Accessible name, description and state announced correctly`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Tokens only; looks right in light, dark and forced colours`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Respects reduced motion and the pause switch`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Stories with descriptions, `,(0,f.jsx)(t.code,{children:`play`}),` tests for behaviour, unit tests with axe`]}),`
`,(0,f.jsxs)(t.li,{className:`task-list-item`,children:[(0,f.jsx)(t.input,{type:`checkbox`,disabled:!0}),` `,`Exported from `,(0,f.jsx)(t.code,{children:`src/index.ts`}),`; `,(0,f.jsx)(t.code,{children:`npm run check`}),` passes`]}),`
`]})]})}function d(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=t(),r(),i(),o(),l()})))()}p();export{d as default};