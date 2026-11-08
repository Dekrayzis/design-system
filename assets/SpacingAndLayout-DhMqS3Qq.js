import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{i as o,t as s}from"./Button-CksBOm96.js";import{n as c,t as l}from"./Stack-CCsQXNDC.js";import{n as u,t as d}from"./DocBanner-DKfOrOn6.js";import{n as f,t as p}from"./DocExample-CWfyZjvF.js";var m;function h(){return(h=e((()=>{m=new URL(`banner-spacing-DxhnTDb_.webp`,import.meta.url).href})))()}function g(e){let t={a:`a`,code:`code`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(a,{title:`Foundations/Spacing and layout`}),`
`,(0,v.jsx)(d,{title:`Spacing and layout`,eyebrow:`Foundations`,src:m}),`
`,(0,v.jsxs)(t.p,{children:[`All spacing sits on a `,(0,v.jsx)(t.strong,{children:`4px grid`}),`. The scale is deliberately short, so neighbouring components\r
agree without anyone measuring.`]}),`
`,(0,v.jsx)(`div`,{style:{display:`grid`,gap:8,marginBlock:16},children:[[1,`Icon to text inside a badge`],[2,`Icon to label in a button; label to input`],[3,`Between buttons in a row; tight lists`],[4,`Default gap between related controls`],[5,`Between fields in a form`],[6,`Card padding; between groups`],[8,`Between page sections`],[10,`Large section breaks`],[12,`Page-level breathing room`]].map(([e,t])=>(0,v.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`120px 140px 48px 1fr`,alignItems:`center`,gap:16},children:[(0,v.jsxs)(`code`,{children:[`--ds-space-`,e]}),(0,v.jsx)(`div`,{style:{width:`var(--ds-space-${e})`,height:16,background:`var(--ds-color-accent)`,borderRadius:2}}),(0,v.jsxs)(`span`,{style:{color:`#55555f`,fontSize:14},children:[e*4,`px`]}),(0,v.jsx)(`span`,{style:{fontSize:14},children:t})]},e))}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`--ds-space-0`}),` is there for resets. There is no 7, 9 or 11 on purpose: if a gap needs to sit\r
between two steps, the layout usually needs a different grouping instead.`]}),`
`,(0,v.jsx)(t.h2,{id:`rules-of-thumb`,children:`Rules of thumb`}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Closer means related.`}),` The gap inside a group must be smaller than the gap between groups,\r
e.g. label to input (`,(0,v.jsx)(t.code,{children:`2`}),`) is less than field to field (`,(0,v.jsx)(t.code,{children:`5`}),`), which is less than section to section (`,(0,v.jsx)(t.code,{children:`8`}),`).`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Spacing belongs to the parent.`}),` Components have no outer margin. Put the gap on the container\r
(a `,(0,v.jsx)(t.code,{children:`Stack`}),`, a grid, a flex row) rather than adding margins to children.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Use tokens in your own CSS too`}),`: `,(0,v.jsx)(t.code,{children:`padding: var(--ds-space-4) var(--ds-space-6)`}),`. Raw pixel\r
values drift.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Touch targets`}),` should be at least 24 by 24 CSS pixels (WCAG 2.5.8); the `,(0,v.jsx)(t.code,{children:`md`}),` control size\r
already exceeds this. Keep the gap between small targets at `,(0,v.jsx)(t.code,{children:`2`}),` or more.`]}),`
`]}),`
`,(0,v.jsx)(t.h2,{id:`stack`,children:`Stack`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`Stack`}),` is the layout primitive: a flex row or column whose `,(0,v.jsx)(t.code,{children:`gap`}),` takes a spacing step.`]}),`
`,(0,v.jsx)(p,{children:(0,v.jsxs)(l,{direction:`row`,gap:3,wrap:!0,children:[(0,v.jsx)(s,{variant:`secondary`,children:`Cancel`}),(0,v.jsx)(s,{children:`Save changes`})]})}),`
`,(0,v.jsx)(t.pre,{children:(0,v.jsx)(t.code,{className:`language-tsx`,children:`<Stack gap={5}>                       {/* a form: fields 20px apart */}\r
  <TextField label="Name" />\r
  <TextField label="Email" type="email" />\r
  <Stack direction="row" gap={3} justify="end">\r
    <Button variant="secondary">Cancel</Button>\r
    <Button type="submit">Save</Button>\r
  </Stack>\r
</Stack>
`})}),`
`,(0,v.jsxs)(t.table,{children:[(0,v.jsx)(t.thead,{children:(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.th,{children:`Prop`}),(0,v.jsx)(t.th,{children:`Values`}),(0,v.jsx)(t.th,{children:`Default`})]})}),(0,v.jsxs)(t.tbody,{children:[(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`direction`})}),(0,v.jsxs)(t.td,{children:[(0,v.jsx)(t.code,{children:`'column'`}),`, `,(0,v.jsx)(t.code,{children:`'row'`})]}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`'column'`})})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`gap`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`0 1 2 3 4 5 6 8 10 12`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`4`})})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`align`})}),(0,v.jsxs)(t.td,{children:[`any `,(0,v.jsx)(t.code,{children:`align-items`}),` value`]}),(0,v.jsx)(t.td,{})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`justify`})}),(0,v.jsxs)(t.td,{children:[`any `,(0,v.jsx)(t.code,{children:`justify-content`}),` value`]}),(0,v.jsx)(t.td,{})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`wrap`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`boolean`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`false`})})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`as`})}),(0,v.jsxs)(t.td,{children:[(0,v.jsx)(t.code,{children:`'div'`}),`, `,(0,v.jsx)(t.code,{children:`'ul'`}),`, `,(0,v.jsx)(t.code,{children:`'ol'`}),`, `,(0,v.jsx)(t.code,{children:`'section'`}),`, `,(0,v.jsx)(t.code,{children:`'nav'`}),`, `,(0,v.jsx)(t.code,{children:`'header'`}),`, `,(0,v.jsx)(t.code,{children:`'footer'`})]}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`'div'`})})]})]})]}),`
`,(0,v.jsxs)(t.p,{children:[`Pick `,(0,v.jsx)(t.code,{children:`as`}),` by meaning. A stack of cards that are a list of things should be `,(0,v.jsx)(t.code,{children:`as="ul"`}),` with `,(0,v.jsx)(t.code,{children:`<li>`}),`\r
children, so screen readers announce "list, 6 items". A row of page links is a `,(0,v.jsx)(t.code,{children:`nav`}),`.`]}),`
`,(0,v.jsxs)(t.p,{children:[`See the `,(0,v.jsx)(t.a,{href:`?path=/docs/components-layout-stack--docs`,children:`Stack stories`}),` for live examples.`]}),`
`,(0,v.jsx)(t.h2,{id:`page-layout`,children:`Page layout`}),`
`,(0,v.jsx)(t.p,{children:`The library doesn't ship a grid or page shell; use CSS grid with the spacing tokens:`}),`
`,(0,v.jsx)(t.pre,{children:(0,v.jsx)(t.code,{className:`language-css`,children:`.page {\r
  display: grid;\r
  gap: var(--ds-space-8);\r
  max-width: 72rem;\r
  margin-inline: auto;\r
  padding: var(--ds-space-6) var(--ds-space-4);\r
}\r
\r
@media (min-width: 48rem) {\r
  .page { grid-template-columns: 16rem 1fr; padding-inline: var(--ds-space-8); }\r
}
`})}),`
`,(0,v.jsxs)(t.p,{children:[`Keep landmarks semantic: one `,(0,v.jsx)(t.code,{children:`<main>`}),`, `,(0,v.jsx)(t.code,{children:`<nav>`}),` for navigation, `,(0,v.jsx)(t.code,{children:`<header>`}),`/`,(0,v.jsx)(t.code,{children:`<footer>`}),` for page\r
furniture, `,(0,v.jsx)(t.code,{children:`<aside>`}),` for side content. Layout should reflow down to 320px wide without horizontal\r
scrolling (WCAG 1.4.10).`]})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=t(),r(),i(),o(),c(),u(),h(),f()})))()}y();export{_ as default};