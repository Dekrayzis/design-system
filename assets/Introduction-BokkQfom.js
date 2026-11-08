import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./DocBanner-DKfOrOn6.js";var c;function l(){return(l=e((()=>{c=new URL(`banner-introduction-BGmw0ptj.webp`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,em:`em`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{title:`Introduction`}),`
`,(0,f.jsx)(s,{title:`Design System`,eyebrow:`@dekrayzis/design-system`,src:c}),`
`,(0,f.jsxs)(t.p,{children:[`A themeable, accessible React component library. Components are built on native HTML elements
first (`,(0,f.jsx)(t.code,{children:`<button>`}),`, `,(0,f.jsx)(t.code,{children:`<dialog>`}),`, `,(0,f.jsx)(t.code,{children:`<fieldset>`}),`, `,(0,f.jsx)(t.code,{children:`<select>`}),`), styled with CSS Modules and driven entirely
by CSS custom-property tokens, so there is no runtime styling cost and no CSS-in-JS dependency.`]}),`
`,(0,f.jsx)(t.h2,{id:`install-and-use`,children:`Install and use`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-bash`,children:`npm install @dekrayzis/design-system
`})}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import '@dekrayzis/design-system/styles.css';
import { Button, TextField } from '@dekrayzis/design-system';

export function Example() {
  return (
    <form>
      <TextField label="Email" type="email" autoComplete="email" />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
`})}),`
`,(0,f.jsx)(t.h2,{id:`theming`,children:`Theming`}),`
`,(0,f.jsxs)(t.p,{children:[`The theme follows the operating system by default. Force one by setting `,(0,f.jsx)(t.code,{children:`data-theme="light"`}),` or
`,(0,f.jsx)(t.code,{children:`data-theme="dark"`}),` on `,(0,f.jsx)(t.code,{children:`<html>`}),` or any container. Use the `,(0,f.jsx)(t.strong,{children:`Theme`}),` toolbar button above to try it.`]}),`
`,(0,f.jsx)(t.p,{children:`To rebrand, override the semantic tokens after importing the stylesheet:`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-css`,children:`:root {
  --ds-color-accent: #0f766e;
  --ds-color-accent-hover: #115e59;
  --ds-color-accent-subtle: #f0fdfa;
  --ds-color-accent-text: #115e59;
  --ds-font-sans: 'IBM Plex Sans', system-ui, sans-serif;
}
`})}),`
`,(0,f.jsx)(t.h2,{id:`principles`,children:`Principles`}),`
`,(0,f.jsxs)(t.ol,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Semantics first.`}),` Pick the element for what the thing `,(0,f.jsx)(t.em,{children:`is`}),`: buttons act, links navigate, forms
submit. `,(0,f.jsx)(t.code,{children:`Button`}),` and `,(0,f.jsx)(t.code,{children:`LinkButton`}),` look alike but render different elements for that reason.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Accessible by default.`}),` Every form control requires a visible `,(0,f.jsx)(t.code,{children:`label`}),`; icon-only buttons require
a `,(0,f.jsx)(t.code,{children:`label`}),` prop; errors are wired with `,(0,f.jsx)(t.code,{children:`aria-describedby`}),` and `,(0,f.jsx)(t.code,{children:`aria-invalid`}),`. Each story is checked by
the `,(0,f.jsx)(t.strong,{children:`Accessibility`}),` panel, and each component has axe checks in its test suite.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Tokens, not values.`}),` Components only read semantic tokens (`,(0,f.jsx)(t.code,{children:`--ds-color-*`}),`, `,(0,f.jsx)(t.code,{children:`--ds-space-*`}),`), never
raw palette values, so themes only touch one layer.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Respect the user.`}),` Focus rings are always visible on keyboard focus, and motion collapses under
`,(0,f.jsx)(t.code,{children:`prefers-reduced-motion`}),`.`]}),`
`]}),`
`,(0,f.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,f.jsxs)(t.p,{children:[`Each component has a React Testing Library suite in `,(0,f.jsx)(t.code,{children:`*.test.tsx`}),` that tests behaviour the way a user
experiences it (by role and accessible name), plus an axe check. A smoke test also renders every
story through `,(0,f.jsx)(t.code,{children:`composeStories`}),`, so stories can't silently break.`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-bash`,children:`npm test
`})}),`
`,(0,f.jsx)(t.h2,{id:`where-next`,children:`Where next`}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`Guides`}),(0,f.jsx)(t.th,{children:`Foundations`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/guides-getting-started--docs`,children:`Getting started`}),`: install, setup, server rendering`]}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-tokens--docs`,children:`Tokens`}),`: every token at a glance`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/guides-forms-and-validation--docs`,children:`Forms and validation`}),`: rules, errors, error summary`]}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-colour--docs`,children:`Colour`}),`, `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-typography--docs`,children:`Typography`}),`, `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-spacing-and-layout--docs`,children:`Spacing and layout`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/guides-writing-guidelines--docs`,children:`Writing guidelines`}),`: labels, buttons, errors`]}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-shape-and-elevation--docs`,children:`Shape and elevation`}),`, `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-motion--docs`,children:`Motion`}),`, `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-theming--docs`,children:`Theming`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/guides-contributing--docs`,children:`Contributing`}),`: adding a component`]}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-accessibility--docs`,children:`Accessibility`}),`: what's built in and what's left to you`]})]})]})]})]})}function d(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=t(),r(),i(),o(),l()})))()}p();export{d as default};