import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i=t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s=({children:e})=>(0,i.jsx)(`div`,{style:{padding:`12px 16px`,borderRadius:8,background:`var(--ds-color-accent-subtle)`,color:`var(--ds-color-accent-text)`,fontWeight:600},children:e}),c={title:`Components/Layout/Stack`,component:r,args:{direction:`column`,gap:4,children:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s,{children:`One`}),(0,i.jsx)(s,{children:`Two`}),(0,i.jsx)(s,{children:`Three`})]})},argTypes:{direction:{control:`inline-radio`,options:[`column`,`row`]},gap:{control:`select`,options:[0,1,2,3,4,5,6,8,10,12]},children:{control:!1}},parameters:{docs:{description:{component:"A flexbox layout primitive that spaces its children in a column or a row using the spacing tokens. It renders a `<div>` by default; set `as` to `ul`, `ol`, `section`, `nav`, `header` or `footer` when the group has that meaning. Use it for one-dimensional layout instead of ad hoc margins."}}}},l={},u={play:async({canvasElement:e})=>{let t=o(e),n=t.getByText(`One`).getBoundingClientRect(),r=t.getByText(`Two`).getBoundingClientRect();await a(Math.round(n.top)).toBe(Math.round(r.top)),await a(r.left).toBeGreaterThan(n.right)},args:{direction:`row`,gap:2}},d={play:async({canvasElement:e})=>{let t=o(e).getByRole(`list`);await a(o(t).getAllByRole(`listitem`)).toHaveLength(3)},name:`As a list (ul)`,args:{as:`ul`,gap:2,children:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`li`,{children:(0,i.jsx)(s,{children:`First item`})}),(0,i.jsx)(`li`,{children:(0,i.jsx)(s,{children:`Second item`})}),(0,i.jsx)(`li`,{children:(0,i.jsx)(s,{children:`Third item`})})]})}},f=[`Column`,`Row`,`AsList`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:"The default: children stacked vertically, spaced by `gap` from the spacing tokens\r\n(`--ds-space-*`).",...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Laid out horizontally: same top edge, the second to the right of the first.
    const a = canvas.getByText('One').getBoundingClientRect();
    const b = canvas.getByText('Two').getBoundingClientRect();
    await expect(Math.round(a.top)).toBe(Math.round(b.top));
    await expect(b.left).toBeGreaterThan(a.right);
  },
  args: {
    direction: 'row',
    gap: 2
  }
}`,...u.parameters?.docs?.source},description:{story:'With `direction="row"` the children sit side by side. Add `wrap` to let them flow onto further\r\nlines when space runs out.',...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const list = within(canvasElement).getByRole('list');
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
  name: 'As a list (ul)',
  args: {
    as: 'ul',
    gap: 2,
    children: <>\r
        <li><Box>First item</Box></li>\r
        <li><Box>Second item</Box></li>\r
        <li><Box>Third item</Box></li>\r
      </>
  }
}`,...d.parameters?.docs?.source},description:{story:'With `as="ul"` the stack renders a real list, so screen readers announce it as a list and count\r\nits items. Use it whenever the children are a set of like things; each child must then be an\r\n`<li>`.',...d.parameters?.docs?.description}}}})))()}p();export{d as AsList,l as Column,u as Row,f as __namedExportsOrder,c as default};