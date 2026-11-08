import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./DocBanner-DKfOrOn6.js";var c;function l(){return(l=e((()=>{c=new URL(`banner-getting-started-DDhAchnL.webp`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{title:`Guides/Getting started`}),`
`,(0,f.jsx)(s,{title:`Getting started`,eyebrow:`Guides`,src:c}),`
`,(0,f.jsx)(t.h2,{id:`1-install`,children:`1. Install`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-bash`,children:`npm install @dekrayzis/design-system
`})}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`react`}),` and `,(0,f.jsx)(t.code,{children:`react-dom`}),` 18.2 or later (including 19) are peer dependencies. The package is ESM only\r
and ships its own TypeScript types.`]}),`
`,(0,f.jsx)(t.h2,{id:`2-import-the-styles-once`,children:`2. Import the styles once`}),`
`,(0,f.jsx)(t.p,{children:`Import the stylesheet at your app's root, before your own CSS so your overrides win:`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`// main.tsx, app/layout.tsx or _app.tsx\r
import '@dekrayzis/design-system/styles.css';
`})}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`styles.css`}),` contains the tokens, a minimal base layer (box-sizing, body colours and font) and every\r
component's styles. If you only want the variables, for example to style a non-React part of a\r
site, import `,(0,f.jsx)(t.code,{children:`@dekrayzis/design-system/tokens.css`}),` instead.`]}),`
`,(0,f.jsx)(t.h2,{id:`3-load-the-font-optional`,children:`3. Load the font (optional)`}),`
`,(0,f.jsxs)(t.p,{children:[`Text uses Inter when it's available and the platform UI font otherwise. The package doesn't bundle\r
font files. To use Inter, load it however your app loads fonts, for example with `,(0,f.jsx)(t.code,{children:`next/font`}),` or a\r
self-hosted `,(0,f.jsx)(t.code,{children:`@font-face`}),`. To use a different family, override `,(0,f.jsx)(t.code,{children:`--ds-font-sans`}),`\r
(see `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-theming--docs`,children:`Theming`}),`).`]}),`
`,(0,f.jsx)(t.h2,{id:`4-use-components`,children:`4. Use components`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Stack, TextField } from '@dekrayzis/design-system';\r
\r
export function NewsletterForm() {\r
  return (\r
    <form action="/subscribe" method="post">\r
      <Stack gap={4}>\r
        <TextField name="email" label="Email" type="email" autoComplete="email" required />\r
        <Button type="submit">Subscribe</Button>\r
      </Stack>\r
    </form>\r
  );\r
}
`})}),`
`,(0,f.jsx)(t.p,{children:`Everything is a named export from the package root.`}),`
`,(0,f.jsx)(t.h2,{id:`5-one-off-setup-for-app-wide-pieces`,children:`5. One-off setup for app-wide pieces`}),`
`,(0,f.jsx)(t.h3,{id:`toasts`,children:`Toasts`}),`
`,(0,f.jsxs)(t.p,{children:[`Mount `,(0,f.jsx)(t.code,{children:`Toaster`}),` once, near the root; call `,(0,f.jsx)(t.code,{children:`toast()`}),` from anywhere.`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import { Toaster, toast } from '@dekrayzis/design-system';\r
\r
<Toaster />;\r
\r
toast('Changes saved', { tone: 'success' });
`})}),`
`,(0,f.jsx)(t.h3,{id:`motion-and-theme-before-first-paint`,children:`Motion and theme before first paint`}),`
`,(0,f.jsxs)(t.p,{children:[`If you offer a `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-motion--docs`,children:`motion pause switch`}),` or a theme switch, apply\r
the saved choice with a small inline script in `,(0,f.jsx)(t.code,{children:`<head>`}),`, so the first paint is already right.`]}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.strong,{children:`Server-rendered apps:`}),` render `,(0,f.jsx)(t.code,{children:`motionPauseScript`}),` in `,(0,f.jsx)(t.code,{children:`<head>`}),`:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import { motionPauseScript } from '@dekrayzis/design-system';\r
\r
<script dangerouslySetInnerHTML={{ __html: motionPauseScript }} />
`})}),`
`]}),`
`,(0,f.jsxs)(t.li,{children:[`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.strong,{children:`Next.js App Router:`}),` do the same in the root layout and add `,(0,f.jsx)(t.code,{children:`suppressHydrationWarning`}),` to\r
`,(0,f.jsx)(t.code,{children:`<html>`}),`, since the script changes its attributes before React hydrates.`]}),`
`]}),`
`,(0,f.jsxs)(t.li,{children:[`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.strong,{children:`Client-only apps (Vite):`}),` React won't run a `,(0,f.jsx)(t.code,{children:`<script>`}),` it renders, so paste the script into\r
`,(0,f.jsx)(t.code,{children:`index.html`}),` instead.`]}),`
`]}),`
`,(0,f.jsxs)(t.li,{children:[`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.strong,{children:`With a Content Security Policy:`}),` give the tag a per-request `,(0,f.jsx)(t.code,{children:`nonce`}),`, or allow the script's hash.`]}),`
`]}),`
`]}),`
`,(0,f.jsxs)(t.p,{children:[`The `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-motion--docs`,children:`Motion`}),` page ("Avoiding a flash of motion") has the full\r
code for each case.`]}),`
`,(0,f.jsx)(t.h2,{id:`server-rendering`,children:`Server rendering`}),`
`,(0,f.jsx)(t.p,{children:`Components render on the server. Those that read browser state (motion preference, focus, menu\r
position) render a safe default first, such as full motion and closed menus, and correct\r
themselves after hydration.`}),`
`,(0,f.jsxs)(t.p,{children:[`The package doesn't add `,(0,f.jsx)(t.code,{children:`'use client'`}),` directives. In the Next.js App Router, import interactive\r
components (anything with state or event handlers, such as `,(0,f.jsx)(t.code,{children:`Select`}),`, `,(0,f.jsx)(t.code,{children:`Tabs`}),`, `,(0,f.jsx)(t.code,{children:`Dialog`}),`, `,(0,f.jsx)(t.code,{children:`toast`}),`) from\r
a file marked `,(0,f.jsx)(t.code,{children:`'use client'`}),`, or re-export them from one:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`// components/ds.ts\r
'use client';\r
// Next.js doesn't allow \`export *\` in a client boundary, so name each one.\r
export { Button, Dialog, Select, Tabs, TabList, Tab, TabPanel, TextField, Toaster } from '@dekrayzis/design-system';
`})}),`
`,(0,f.jsx)(t.h2,{id:`browser-support`,children:`Browser support`}),`
`,(0,f.jsxs)(t.p,{children:[`The library relies on modern platform features: `,(0,f.jsx)(t.code,{children:`<dialog>`}),`, the Popover API (for `,(0,f.jsx)(t.code,{children:`Select`}),` menus and\r
`,(0,f.jsx)(t.code,{children:`Tooltip`}),`), CSS `,(0,f.jsx)(t.code,{children:`:has()`}),` and `,(0,f.jsx)(t.code,{children:`color-scheme`}),`. It targets current versions of Chrome, Edge, Firefox\r
and Safari.`]}),`
`,(0,f.jsx)(t.h2,{id:`where-next`,children:`Where next`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-colour--docs`,children:`Colour`}),`, `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-typography--docs`,children:`Typography`}),`\r
and `,(0,f.jsx)(t.a,{href:`?path=/docs/foundations-spacing-and-layout--docs`,children:`Spacing`}),`: the foundations components are built on.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/guides-forms-and-validation--docs`,children:`Forms and validation`}),`: how every form control validates.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/foundations-accessibility--docs`,children:`Accessibility`}),`: what's built in and what's still your job.`]}),`
`]})]})}function d(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=t(),r(),i(),o(),l()})))()}p();export{d as default};