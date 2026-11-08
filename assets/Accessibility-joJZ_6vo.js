import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./DocBanner-DKfOrOn6.js";var c;function l(){return(l=e((()=>{c=new URL(`banner-accessibility-DyBXxipF.webp`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{title:`Foundations/Accessibility`}),`
`,(0,f.jsx)(s,{title:`Accessibility`,eyebrow:`Foundations`,src:c}),`
`,(0,f.jsxs)(t.p,{children:[`The target is `,(0,f.jsx)(t.strong,{children:`WCAG 2.2 AA`}),`. Components are built so the accessible path is the default one:\r
you'd have to work to make them inaccessible. This page lists what the library guarantees, how it\r
is checked, and what is still your job.`]}),`
`,(0,f.jsx)(t.h2,{id:`built-in`,children:`Built in`}),`
`,(0,f.jsx)(t.h3,{id:`semantics`,children:`Semantics`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Native elements first: `,(0,f.jsx)(t.code,{children:`<button>`}),`, `,(0,f.jsx)(t.code,{children:`<a href>`}),`, `,(0,f.jsx)(t.code,{children:`<dialog>`}),`, `,(0,f.jsx)(t.code,{children:`<fieldset>`}),`/`,(0,f.jsx)(t.code,{children:`<legend>`}),`, `,(0,f.jsx)(t.code,{children:`<input>`}),`,\r
`,(0,f.jsx)(t.code,{children:`<select>`}),`. ARIA is only added where HTML can't express the pattern (the custom `,(0,f.jsx)(t.code,{children:`Select`}),`, `,(0,f.jsx)(t.code,{children:`Tabs`}),`,\r
`,(0,f.jsx)(t.code,{children:`ButtonGroup`}),`).`]}),`
`,(0,f.jsxs)(t.li,{children:[`Actions and navigation are different elements: `,(0,f.jsx)(t.code,{children:`Button`}),` renders `,(0,f.jsx)(t.code,{children:`<button type="button">`}),`,\r
`,(0,f.jsx)(t.code,{children:`LinkButton`}),` renders `,(0,f.jsx)(t.code,{children:`<a href>`}),`. They look alike, and they announce and behave differently, on purpose.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.code,{children:`Heading`}),` sets level and size separately, so the visual design never forces a broken outline.`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`labels-and-names`,children:`Labels and names`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Every form control requires a visible `,(0,f.jsx)(t.code,{children:`label`}),`. Groups require a `,(0,f.jsx)(t.code,{children:`legend`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.code,{children:`IconButton`}),` requires a `,(0,f.jsx)(t.code,{children:`label`}),`; it becomes the accessible name and the tooltip.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Hints and errors are tied to their control with `,(0,f.jsx)(t.code,{children:`aria-describedby`}),`, and errors set `,(0,f.jsx)(t.code,{children:`aria-invalid`}),`.`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`keyboard`,children:`Keyboard`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Everything is reachable with `,(0,f.jsx)(`kbd`,{children:`Tab`}),` and operable with `,(0,f.jsx)(`kbd`,{children:`Enter`}),`/`,(0,f.jsx)(`kbd`,{children:`Space`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Composite widgets follow the WAI-ARIA Authoring Practices: arrow keys move inside `,(0,f.jsx)(t.code,{children:`Tabs`}),`,\r
`,(0,f.jsx)(t.code,{children:`RadioGroup`}),`, `,(0,f.jsx)(t.code,{children:`ButtonGroup`}),` and `,(0,f.jsx)(t.code,{children:`Select`}),`; `,(0,f.jsx)(`kbd`,{children:`Home`}),`/`,(0,f.jsx)(`kbd`,{children:`End`}),` jump; type-ahead works in\r
`,(0,f.jsx)(t.code,{children:`Select`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.code,{children:`Dialog`}),` traps focus, closes on `,(0,f.jsx)(`kbd`,{children:`Escape`}),` and returns focus to what opened it.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Focus is always visible on keyboard focus. A `,(0,f.jsx)(t.a,{href:`?path=/story/foundations-focus-indicators--every-control-shows-focus`,children:`story`}),`\r
tabs through every control and fails if any lacks an indicator.`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`announcements`,children:`Announcements`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsx)(t.li,{children:`Field errors live in regions that exist before they're filled, so they're announced when they\r
appear.`}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.code,{children:`ErrorSummary`}),` takes focus after a blocked submit and links to each invalid field.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Loading buttons set `,(0,f.jsx)(t.code,{children:`aria-busy`}),`; toasts announce politely (success, info) or assertively\r
(warning, error) and never steal focus.`]}),`
`,(0,f.jsxs)(t.li,{children:[`"Required" is exposed even where `,(0,f.jsx)(t.code,{children:`aria-required`}),` isn't allowed (checkbox groups, searchable selects).`]}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`visual`,children:`Visual`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`Text contrast 4.5:1, control borders and focus rings 3:1, in both themes, enforced by a unit test.\r
See `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-colour--docs`,children:`Colour`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Forced colours`}),` (Windows High Contrast): state is restated with system colours, and every\r
focus ring has a real `,(0,f.jsx)(t.code,{children:`outline`}),`, because forced colours drop `,(0,f.jsx)(t.code,{children:`box-shadow`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[`Sizes are in `,(0,f.jsx)(t.code,{children:`rem`}),`, so text scales with the user's browser font size.`]}),`
`,(0,f.jsx)(t.li,{children:`Colour is never the only signal.`}),`
`]}),`
`,(0,f.jsx)(t.h3,{id:`time-and-motion`,children:`Time and motion`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsx)(t.li,{children:`Toast timers pause on hover, keyboard focus and hidden tabs (WCAG 2.2.1). Errors and toasts with\r
an action stay until dismissed.`}),`
`,(0,f.jsxs)(t.li,{children:[`Reduced motion and the site pause switch stop all motion. See `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-motion--docs`,children:`Motion`}),`.`]}),`
`]}),`
`,(0,f.jsx)(t.h2,{id:`how-its-checked`,children:`How it's checked`}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`Layer`}),(0,f.jsx)(t.th,{children:`What runs`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Unit tests (jsdom)`}),(0,f.jsxs)(t.td,{children:[`Every component suite queries by role and accessible name, drives it with `,(0,f.jsx)(t.code,{children:`user-event`}),`, and ends with a jest-axe check.`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Story tests (Chromium)`}),(0,f.jsxs)(t.td,{children:[`Every story renders in a real browser, runs its `,(0,f.jsx)(t.code,{children:`play`}),` interaction, then axe, including colour contrast. Each runs three times: light, dark and forced colours.`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Token tests`}),(0,f.jsx)(t.td,{children:`Contrast ratios for every text, border and focus token, in both themes.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Storybook panels`}),(0,f.jsxs)(t.td,{children:[`The `,(0,f.jsx)(t.strong,{children:`Accessibility`}),` panel flags violations live as you browse; the `,(0,f.jsx)(t.strong,{children:`Interactions`}),` panel replays each story's test.`]})]})]})]}),`
`,(0,f.jsx)(t.h2,{id:`still-your-job`,children:`Still your job`}),`
`,(0,f.jsx)(t.p,{children:`Automated checks catch perhaps a third of real problems. When you use the components:`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Write meaningful labels.`}),` "Email" not "Field 1"; "Delete project" not "Delete".`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Keep the outline intact.`}),` One `,(0,f.jsx)(t.code,{children:`h1`}),` per page, no skipped heading levels, real landmarks\r
(`,(0,f.jsx)(t.code,{children:`main`}),`, `,(0,f.jsx)(t.code,{children:`nav`}),`, `,(0,f.jsx)(t.code,{children:`header`}),`, `,(0,f.jsx)(t.code,{children:`footer`}),`).`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Write alt text`}),` for `,(0,f.jsx)(t.code,{children:`LazyImage`}),`, or `,(0,f.jsx)(t.code,{children:`alt=""`}),` if it's decorative.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Don't override focus styles`}),`, and don't use positive `,(0,f.jsx)(t.code,{children:`tabIndex`}),`.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Test with a screen reader.`}),` NVDA or JAWS on Windows, VoiceOver on macOS and iOS, TalkBack on\r
Android. The library itself still needs a manual pass in real screen readers, especially the\r
`,(0,f.jsx)(t.code,{children:`Select`}),` patterns.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Test with the keyboard only`}),`, at 200% and 400% zoom, and with Windows High Contrast on.`]}),`
`]})]})}function d(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=t(),r(),i(),o(),l()})))()}p();export{d as default};