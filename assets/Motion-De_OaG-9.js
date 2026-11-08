import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./MotionToggle-B5wcBu3F.js";import{n as c,t as l}from"./DocBanner-DKfOrOn6.js";import{n as u,t as d}from"./DocExample-CWfyZjvF.js";var f;function p(){return(p=e((()=>{f=new URL(`banner-motion-ChTbR5PT.webp`,import.meta.url).href})))()}function m(e){let t={code:`code`,h2:`h2`,h3:`h3`,h4:`h4`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a,{title:`Foundations/Motion`}),`
`,(0,g.jsx)(l,{title:`Motion`,eyebrow:`Foundations`,src:f}),`
`,(0,g.jsx)(t.p,{children:`Motion explains change: where something came from, where it went, what is busy. It is never\r
decoration, and it always stops when the user asks it to.`}),`
`,(0,g.jsx)(t.h2,{id:`duration-and-easing`,children:`Duration and easing`}),`
`,(0,g.jsxs)(t.table,{children:[(0,g.jsx)(t.thead,{children:(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.th,{children:`Token`}),(0,g.jsx)(t.th,{children:`Value`}),(0,g.jsx)(t.th,{children:`Use`})]})}),(0,g.jsxs)(t.tbody,{children:[(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`--ds-duration-fast`})}),(0,g.jsx)(t.td,{children:`120ms`}),(0,g.jsx)(t.td,{children:`Hover and press colour changes, focus rings.`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`--ds-duration-normal`})}),(0,g.jsx)(t.td,{children:`200ms`}),(0,g.jsx)(t.td,{children:`Opening menus and tooltips, switching tabs.`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`--ds-duration-slow`})}),(0,g.jsx)(t.td,{children:`420ms`}),(0,g.jsx)(t.td,{children:`Things that travel a distance: toasts sliding, thumbs.`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`--ds-easing-standard`})}),(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`cubic-bezier(0.2, 0, 0, 1)`})}),(0,g.jsx)(t.td,{children:`The default for everything.`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`--ds-easing-emphasized`})}),(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`cubic-bezier(0.22, 1, 0.36, 1)`})}),(0,g.jsx)(t.td,{children:`Fast start, long settle: elements that move position.`})]})]})]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-css`,children:`.panel {\r
  transition:\r
    opacity var(--ds-duration-normal) var(--ds-easing-standard),\r
    transform var(--ds-duration-normal) var(--ds-easing-standard);\r
}
`})}),`
`,(0,g.jsx)(t.p,{children:`Always use the tokens rather than literal durations. That is what makes the reduced-motion switch\r
below work everywhere at once.`}),`
`,(0,g.jsx)(t.h3,{id:`guidelines`,children:`Guidelines`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Animate `,(0,g.jsx)(t.code,{children:`opacity`}),` and `,(0,g.jsx)(t.code,{children:`transform`}),`; avoid animating layout properties (`,(0,g.jsx)(t.code,{children:`width`}),`, `,(0,g.jsx)(t.code,{children:`top`}),`).`]}),`
`,(0,g.jsx)(t.li,{children:`Entering things can take a little longer than leaving things.`}),`
`,(0,g.jsx)(t.li,{children:`Nothing essential should depend on watching an animation finish.`}),`
`,(0,g.jsx)(t.li,{children:`Don't flash: nothing may flash more than three times a second (WCAG 2.3.1).`}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`less-motion-one-switch-two-triggers`,children:`Less motion: one switch, two triggers`}),`
`,(0,g.jsxs)(t.p,{children:[`Motion is reduced when `,(0,g.jsx)(t.strong,{children:`either`}),`:`]}),`
`,(0,g.jsxs)(t.ol,{children:[`
`,(0,g.jsxs)(t.li,{children:[`the operating system asks for it (`,(0,g.jsx)(t.code,{children:`prefers-reduced-motion: reduce`}),`), or`]}),`
`,(0,g.jsxs)(t.li,{children:[`the site's own pause switch is on (`,(0,g.jsx)(t.code,{children:`data-motion="paused"`}),` on `,(0,g.jsx)(t.code,{children:`<html>`}),`, set by `,(0,g.jsx)(t.code,{children:`MotionToggle`}),` or\r
`,(0,g.jsx)(t.code,{children:`setMotionPaused(true)`}),`).`]}),`
`]}),`
`,(0,g.jsxs)(t.p,{children:[`Both triggers collapse every `,(0,g.jsx)(t.code,{children:`--ds-duration-*`}),` token to `,(0,g.jsx)(t.code,{children:`0ms`}),` in `,(0,g.jsx)(t.code,{children:`tokens.css`}),`, so anything built on\r
the tokens snaps instead of animating. Components with their own looping animations (`,(0,g.jsx)(t.code,{children:`Spinner`}),`,\r
`,(0,g.jsx)(t.code,{children:`Marquee`}),`, toast countdowns) key off the same two triggers, so CSS and scripted motion always stop\r
together. The pause switch also satisfies WCAG 2.2.2 (pause, stop, hide) for content that moves on\r
its own.`]}),`
`,(0,g.jsx)(d,{children:(0,g.jsx)(s,{variant:`labelled`})}),`
`,(0,g.jsx)(t.h3,{id:`in-script-driven-animation`,children:`In script-driven animation`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`useLessMotion()`}),` for anything CSS tokens can't reach: autoplaying video, number counters,\r
carousels, canvas or `,(0,g.jsx)(t.code,{children:`requestAnimationFrame`}),` loops. It re-renders when either trigger changes.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`import { useLessMotion } from '@dekrayzis/design-system';\r
\r
function HeroVideo() {\r
  const lessMotion = useLessMotion();\r
  return <video src="/hero.mp4" autoPlay={!lessMotion} muted loop={!lessMotion} playsInline controls />;\r
}
`})}),`
`,(0,g.jsxs)(t.table,{children:[(0,g.jsx)(t.thead,{children:(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.th,{children:`Export`}),(0,g.jsx)(t.th,{children:`What it does`})]})}),(0,g.jsxs)(t.tbody,{children:[(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`useLessMotion()`})}),(0,g.jsxs)(t.td,{children:[(0,g.jsx)(t.code,{children:`true`}),` when either trigger is on. Use this one by default.`]})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`useMotionPaused()`})}),(0,g.jsxs)(t.td,{children:[(0,g.jsx)(t.code,{children:`true`}),` when only the site switch is on.`]})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`useSystemReducesMotion()`})}),(0,g.jsxs)(t.td,{children:[(0,g.jsx)(t.code,{children:`true`}),` when only the OS setting is on.`]})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`lessMotion()`})}),(0,g.jsx)(t.td,{children:`Non-hook version, for event handlers and plain functions.`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`setMotionPaused(bool)`})}),(0,g.jsxs)(t.td,{children:[`Sets the site switch and remembers it in `,(0,g.jsx)(t.code,{children:`localStorage`}),`.`]})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:(0,g.jsx)(t.code,{children:`motionPauseScript`})}),(0,g.jsx)(t.td,{children:`Inline script that applies a saved choice before first paint.`})]})]})]}),`
`,(0,g.jsx)(t.h3,{id:`avoiding-a-flash-of-motion`,children:`Avoiding a flash of motion`}),`
`,(0,g.jsxs)(t.p,{children:[`Without help, a saved "paused" choice only applies once your JavaScript loads, so the page\r
animates for a moment first. `,(0,g.jsx)(t.code,{children:`motionPauseScript`}),` is a tiny inline script that applies the choice\r
before first paint. It has to arrive `,(0,g.jsx)(t.strong,{children:`in the HTML itself`}),`, in `,(0,g.jsx)(t.code,{children:`<head>`}),` before your bundle. Where\r
you put it depends on how the page is rendered.`]}),`
`,(0,g.jsx)(t.h4,{id:`server-rendered-apps-nextjs-remix-astro-plain-ssr`,children:`Server-rendered apps (Next.js, Remix, Astro, plain SSR)`}),`
`,(0,g.jsxs)(t.p,{children:[`Render it in `,(0,g.jsx)(t.code,{children:`<head>`}),`. Browsers run scripts that come with the server's HTML, so it takes effect\r
before anything paints.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`import { motionPauseScript } from '@dekrayzis/design-system';\r
\r
<head>\r
  <script dangerouslySetInnerHTML={{ __html: motionPauseScript }} />\r
</head>
`})}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`dangerouslySetInnerHTML`}),` is safe here: the script is a fixed string from the library, with no\r
user input in it.`]}),`
`,(0,g.jsx)(t.h4,{id:`nextjs-app-router`,children:`Next.js App Router`}),`
`,(0,g.jsxs)(t.p,{children:[`Put it in the root layout, and add `,(0,g.jsx)(t.code,{children:`suppressHydrationWarning`}),` to `,(0,g.jsx)(t.code,{children:`<html>`}),`. The script sets\r
`,(0,g.jsx)(t.code,{children:`data-motion`}),` on `,(0,g.jsx)(t.code,{children:`<html>`}),` before React hydrates, and without the flag React warns that the\r
attribute doesn't match what the server rendered. The flag only covers `,(0,g.jsx)(t.code,{children:`<html>`}),`'s own attributes,\r
not its children.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`// app/layout.tsx\r
import { motionPauseScript } from '@dekrayzis/design-system';\r
\r
export default function RootLayout({ children }: { children: React.ReactNode }) {\r
  return (\r
    <html lang="en" suppressHydrationWarning>\r
      <head>\r
        <script dangerouslySetInnerHTML={{ __html: motionPauseScript }} />\r
      </head>\r
      <body>{children}</body>\r
    </html>\r
  );\r
}
`})}),`
`,(0,g.jsx)(t.h4,{id:`client-only-apps-vite-create-react-app`,children:`Client-only apps (Vite, Create React App)`}),`
`,(0,g.jsxs)(t.p,{children:[`Rendering the `,(0,g.jsx)(t.code,{children:`<script>`}),` from React does `,(0,g.jsx)(t.strong,{children:`nothing`}),` here: browsers don't run script tags that\r
React adds on the client. Put the script in `,(0,g.jsx)(t.code,{children:`index.html`}),` instead, above your bundle's\r
`,(0,g.jsx)(t.code,{children:`<script type="module">`}),`:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-html`,children:`<head>\r
  <script>try{if(localStorage.getItem("ds-motion-paused")==='1')document.documentElement.setAttribute('data-motion','paused')}catch(e){}<\/script>\r
</head>
`})}),`
`,(0,g.jsxs)(t.p,{children:[`This is an exact copy of `,(0,g.jsx)(t.code,{children:`motionPauseScript`}),`, kept on one line so a CSP hash (below) matches it.\r
If a future version of the library changes the script, update the copy to match.`]}),`
`,(0,g.jsx)(t.h4,{id:`content-security-policy`,children:`Content Security Policy`}),`
`,(0,g.jsxs)(t.p,{children:[`If your site sends a CSP without `,(0,g.jsx)(t.code,{children:`'unsafe-inline'`}),` in `,(0,g.jsx)(t.code,{children:`script-src`}),`, the browser blocks the inline\r
script and the saved choice applies late. Allow it in one of two ways:`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.strong,{children:`A nonce (recommended for server rendering).`}),` Generate a fresh random value per request, send it\r
in the header as `,(0,g.jsx)(t.code,{children:`script-src 'nonce-<value>'`}),`, and put the same value on the tag:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<script nonce={nonce} dangerouslySetInnerHTML={{ __html: motionPauseScript }} />
`})}),`
`,(0,g.jsxs)(t.p,{children:[`In Next.js, middleware usually creates the nonce and passes it on a request header; read it in\r
the layout with `,(0,g.jsx)(t.code,{children:`(await headers()).get('x-nonce')`}),`.`]}),`
`]}),`
`,(0,g.jsxs)(t.li,{children:[`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsxs)(t.strong,{children:[`A hash (for static `,(0,g.jsx)(t.code,{children:`index.html`}),`).`]}),` Allow the script's exact contents with\r
`,(0,g.jsx)(t.code,{children:`script-src 'sha256-<hash>'`}),`. Compute the hash from the text between the tags, byte for byte:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-bash`,children:`node --input-type=module -e "import { motionPauseScript } from '@dekrayzis/design-system'; import { createHash } from 'node:crypto'; console.log(createHash('sha256').update(motionPauseScript).digest('base64'))"
`})}),`
`,(0,g.jsxs)(t.p,{children:[`Run it in your project folder. The copy in `,(0,g.jsx)(t.code,{children:`index.html`}),` above must match `,(0,g.jsx)(t.code,{children:`motionPauseScript`}),`\r
exactly, with no spaces or line breaks inside the tag, or the hash won't match.`]}),`
`,(0,g.jsx)(t.p,{children:`The hash changes whenever the script does, so recompute it when you upgrade the library.`}),`
`]}),`
`]}),`
`,(0,g.jsx)(t.h3,{id:`on-the-server`,children:`On the server`}),`
`,(0,g.jsxs)(t.p,{children:[`Hooks such as `,(0,g.jsx)(t.code,{children:`useLessMotion()`}),` report full motion while rendering on the server (the server can't\r
know either setting) and correct themselves straight after hydration.`]}),`
`,(0,g.jsx)(t.h2,{id:`respecting-it-in-your-own-css`,children:`Respecting it in your own CSS`}),`
`,(0,g.jsxs)(t.p,{children:[`If you write your own `,(0,g.jsx)(t.code,{children:`@keyframes`}),` animation, stop it under both triggers, the same way components do:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-css`,children:`.shimmer { animation: shimmer 1.5s linear infinite; }\r
\r
@media (prefers-reduced-motion: reduce) {\r
  .shimmer { animation: none; }\r
}\r
:root[data-motion='paused'] .shimmer { animation: none; }
`})})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),i(),o(),c(),p(),u()})))()}_();export{h as default};