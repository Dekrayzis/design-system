import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{i as o,t as s}from"./Button-CksBOm96.js";import{n as c,t as l}from"./Stack-CCsQXNDC.js";import{n as u,t as d}from"./Badge-Rh9PSFv9.js";import{n as f,t as p}from"./DocBanner-DKfOrOn6.js";var m;function h(){return(h=e((()=>{m=new URL(`banner-theming-nCTaExGL.webp`,import.meta.url).href})))()}function g(e){let t={a:`a`,code:`code`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(a,{title:`Foundations/Theming`}),`
`,(0,v.jsx)(p,{title:`Theming`,eyebrow:`Foundations`,src:m}),`
`,(0,v.jsx)(t.p,{children:`The library ships a light and a dark theme, both defined entirely in CSS custom properties. No\r
provider, no context and no JavaScript are needed to switch them.`}),`
`,(0,v.jsx)(t.h2,{id:`choosing-a-theme`,children:`Choosing a theme`}),`
`,(0,v.jsxs)(t.table,{children:[(0,v.jsx)(t.thead,{children:(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.th,{children:`You want`}),(0,v.jsx)(t.th,{children:`Do this`})]})}),(0,v.jsxs)(t.tbody,{children:[(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:`Follow the OS (default)`}),(0,v.jsxs)(t.td,{children:[`Nothing. `,(0,v.jsx)(t.code,{children:`prefers-color-scheme`}),` picks for you.`]})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:`Force light everywhere`}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`<html data-theme="light">`})})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:`Force dark everywhere`}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`<html data-theme="dark">`})})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:`One dark area on a light page`}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`<section data-theme="dark">…</section>`})})]})]})]}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`data-theme`}),` works on `,(0,v.jsx)(t.strong,{children:`any ancestor`}),`, so a dark hero band or a light preview pane inside a dark\r
app is just an attribute. Each theme also sets `,(0,v.jsx)(t.code,{children:`color-scheme`}),`, so native scrollbars, date pickers\r
and autofill follow along.`]}),`
`,(0,v.jsx)(`div`,{"data-theme":`dark`,style:{background:`var(--ds-color-bg)`,color:`var(--ds-color-text)`,padding:24,borderRadius:12,marginBlock:16},children:(0,v.jsxs)(l,{direction:`row`,gap:3,align:`center`,wrap:!0,children:[(0,v.jsxs)(`span`,{children:[`This box has `,(0,v.jsx)(`code`,{children:`data-theme="dark"`}),`:`]}),(0,v.jsx)(s,{children:`Primary`}),(0,v.jsx)(s,{variant:`secondary`,children:`Secondary`}),(0,v.jsx)(d,{tone:`success`,children:`Live`})]})}),`
`,(0,v.jsxs)(t.p,{children:[`Remember to paint the container: set `,(0,v.jsx)(t.code,{children:`background: var(--ds-color-bg)`}),` and\r
`,(0,v.jsx)(t.code,{children:`color: var(--ds-color-text)`}),` on a themed region, as `,(0,v.jsx)(t.code,{children:`base.css`}),` does for `,(0,v.jsx)(t.code,{children:`<body>`}),`.`]}),`
`,(0,v.jsx)(t.h3,{id:`a-user-facing-switch`,children:`A user-facing switch`}),`
`,(0,v.jsx)(t.p,{children:`Store the choice and set the attribute; remove it for "System":`}),`
`,(0,v.jsx)(t.pre,{children:(0,v.jsx)(t.code,{className:`language-tsx`,children:`function applyTheme(choice: 'light' | 'dark' | 'system') {\r
  const root = document.documentElement;\r
  if (choice === 'system') root.removeAttribute('data-theme');\r
  else root.setAttribute('data-theme', choice);\r
  localStorage.setItem('theme', choice);\r
}
`})}),`
`,(0,v.jsxs)(t.p,{children:[`To avoid a flash of the wrong theme, read the stored value in a tiny inline `,(0,v.jsx)(t.code,{children:`<head>`}),` script before\r
your bundle, just like `,(0,v.jsx)(t.a,{href:`?path=/docs/foundations-motion--docs`,children:(0,v.jsx)(t.code,{children:`motionPauseScript`})}),` does for motion.`]}),`
`,(0,v.jsx)(t.h2,{id:`rebranding`,children:`Rebranding`}),`
`,(0,v.jsxs)(t.p,{children:[`Override the `,(0,v.jsx)(t.strong,{children:`semantic`}),` tokens after importing the stylesheet. Each role has several tokens\r
that move together, so change the set:`]}),`
`,(0,v.jsx)(t.pre,{children:(0,v.jsx)(t.code,{className:`language-css`,children:`@import '@dekrayzis/design-system/styles.css';\r
\r
:root {\r
  --ds-color-accent: #0f766e;\r
  --ds-color-accent-hover: #115e59;\r
  --ds-color-accent-subtle: #f0fdfa;\r
  --ds-color-accent-text: #115e59;\r
  --ds-color-on-accent: #ffffff;\r
  --ds-color-focus: #0d9488;\r
  --ds-font-sans: 'IBM Plex Sans', system-ui, sans-serif;\r
}\r
\r
[data-theme='dark'] {\r
  --ds-color-accent: #2dd4bf;\r
  --ds-color-accent-hover: #5eead4;\r
  --ds-color-accent-subtle: #134e4a;\r
  --ds-color-accent-text: #5eead4;\r
  --ds-color-on-accent: #042f2e;\r
  --ds-color-focus: #5eead4;\r
}\r
\r
@media (prefers-color-scheme: dark) {\r
  :root:not([data-theme='light']) {\r
    /* repeat the dark values here */\r
  }\r
}
`})}),`
`,(0,v.jsxs)(t.p,{children:[`Dark values live in `,(0,v.jsx)(t.strong,{children:`two`}),` places: `,(0,v.jsx)(t.code,{children:`[data-theme='dark']`}),` (forced) and the\r
`,(0,v.jsx)(t.code,{children:`prefers-color-scheme: dark`}),` block (automatic). Override both, or OS-dark users will see the old\r
accent.`]}),`
`,(0,v.jsx)(t.h3,{id:`rebranding-checklist`,children:`Rebranding checklist`}),`
`,(0,v.jsxs)(t.ol,{children:[`
`,(0,v.jsxs)(t.li,{children:[`Change whole roles, not single tokens (`,(0,v.jsx)(t.code,{children:`accent`}),`, `,(0,v.jsx)(t.code,{children:`accent-hover`}),`, `,(0,v.jsx)(t.code,{children:`accent-subtle`}),`,\r
`,(0,v.jsx)(t.code,{children:`accent-text`}),`, `,(0,v.jsx)(t.code,{children:`on-accent`}),`).`]}),`
`,(0,v.jsxs)(t.li,{children:[`Set light `,(0,v.jsx)(t.strong,{children:`and`}),` dark values.`]}),`
`,(0,v.jsxs)(t.li,{children:[`Re-check contrast: 4.5:1 for text roles and `,(0,v.jsx)(t.code,{children:`on-accent`}),`, 3:1 for `,(0,v.jsx)(t.code,{children:`focus`}),` and `,(0,v.jsx)(t.code,{children:`border-strong`}),`.\r
Copying your values into `,(0,v.jsx)(t.code,{children:`tokens.css`}),` and running `,(0,v.jsx)(t.code,{children:`npm test`}),` does this for you.`]}),`
`,(0,v.jsxs)(t.li,{children:[`Look at every component in both themes with the `,(0,v.jsx)(t.strong,{children:`Theme`}),` toolbar and in forced-colours mode.`]}),`
`]}),`
`,(0,v.jsx)(t.h2,{id:`what-not-to-override`,children:`What not to override`}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[`Primitives (`,(0,v.jsx)(t.code,{children:`--ds-palette-*`}),`): components never read them, so changing them only affects other\r
semantic tokens that point at them. Remap the semantic token instead.`]}),`
`,(0,v.jsx)(t.li,{children:`Durations: set them via the motion switch, not by hand, or reduced motion stops working.`}),`
`,(0,v.jsx)(t.li,{children:`Component class names: CSS Modules hash them, and they change between versions. If you need a\r
variant the components don't offer, compose or wrap rather than reaching inside.`}),`
`]})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=t(),r(),i(),u(),o(),c(),f(),h()})))()}y();export{_ as default};