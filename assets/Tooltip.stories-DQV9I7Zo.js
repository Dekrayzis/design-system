import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{n as o,t as s}from"./Tooltip-DIjtDAnw.js";import{n as c,t as l}from"./IconButton-DL3_kfGg.js";import{_ as u,h as d,m as f,s as p}from"./icons-C9TAZLL5.js";var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{u(),n(),c(),i(),o(),m=t(),{expect:h,userEvent:g,waitFor:_,within:v}=__STORYBOOK_MODULE_TEST__,y={title:`Components/Tooltip`,component:s,args:{content:`Saves a draft you can come back to`,children:(0,m.jsx)(r,{variant:`secondary`,children:`Save draft`})},argTypes:{kind:{control:`inline-radio`,options:[`description`,`label`]},placement:{control:`inline-radio`,options:[`top`,`bottom`]},children:{control:!1}},decorators:[e=>(0,m.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,paddingTop:48},children:(0,m.jsx)(e,{})})],parameters:{docs:{description:{component:"Shows on hover (after `delay`) and immediately on keyboard focus. Meets WCAG 1.4.13: you can move the pointer onto it, Escape dismisses it without moving focus (and without closing an enclosing Dialog), and it stays until hover or focus leaves. `IconButton` uses one automatically."}}}},b={play:async({canvasElement:e})=>{let t=v(e),n=t.getByRole(`button`,{name:`Save draft`});await h(n).toHaveAccessibleDescription(`Saves a draft you can come back to`),await g.tab();let r=t.getByRole(`tooltip`,{hidden:!0});await _(()=>h(r).toBeVisible());let i=r.getBoundingClientRect(),a=n.getBoundingClientRect();await h(i.bottom).toBeLessThanOrEqual(a.top),await h(Math.abs(i.left+i.width/2-(a.left+a.width/2))).toBeLessThan(2),await g.keyboard(`{Escape}`),await h(r).not.toBeVisible(),await h(n).toHaveFocus()}},x={name:`Icon buttons (built in)`,render:()=>(0,m.jsxs)(a,{direction:`row`,gap:1,role:`toolbar`,"aria-label":`Post actions`,children:[(0,m.jsx)(l,{label:`Like`,icon:(0,m.jsx)(p,{})}),(0,m.jsx)(l,{label:`Settings`,icon:(0,m.jsx)(f,{})}),(0,m.jsx)(l,{label:`Delete`,icon:(0,m.jsx)(d,{}),variant:`danger`})]}),play:async({canvasElement:e})=>{let t=v(e);await g.tab(),await _(()=>h(t.getByText(`Like`)).toBeVisible()),await g.tab(),await _(()=>h(t.getByText(`Settings`)).toBeVisible()),await h(t.getByText(`Like`)).not.toBeVisible()}},S={args:{placement:`bottom`,content:`Opens in a new tab`}},C={name:`Kept inside the viewport`,decorators:[e=>(0,m.jsx)(`div`,{style:{paddingTop:48},children:(0,m.jsx)(e,{})})],args:{content:`A long description that would overflow the left edge if it were centred`},play:async({canvasElement:e})=>{await g.tab();let t=v(e).getByRole(`tooltip`,{hidden:!0});await _(()=>h(t).toBeVisible()),await h(t.getBoundingClientRect().left).toBeGreaterThanOrEqual(8)}},w=[`Default`,`IconToolbar`,`Bottom`,`NearTheEdge`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Save draft'
    });
    await expect(button).toHaveAccessibleDescription('Saves a draft you can come back to');
    await userEvent.tab();
    const tip = canvas.getByRole('tooltip', {
      hidden: true
    });
    await waitFor(() => expect(tip).toBeVisible());
    // It renders above the button, centred on it.
    const t = tip.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    await expect(t.bottom).toBeLessThanOrEqual(b.top);
    await expect(Math.abs(t.left + t.width / 2 - (b.left + b.width / 2))).toBeLessThan(2);
    await userEvent.keyboard('{Escape}');
    await expect(tip).not.toBeVisible();
    await expect(button).toHaveFocus();
  }
}`,...b.parameters?.docs?.source},description:{story:'The default `kind="description"`: the tooltip has `role="tooltip"` and is added to the trigger’s\r\n`aria-describedby`. It opens at once on keyboard focus, above and centred on the trigger, and\r\nEscape closes it while focus stays on the button.',...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Icon buttons (built in)',
  render: () => <Stack direction="row" gap={1} role="toolbar" aria-label="Post actions">\r
      <IconButton label="Like" icon={<HeartIcon />} />\r
      <IconButton label="Settings" icon={<SettingsIcon />} />\r
      <IconButton label="Delete" icon={<TrashIcon />} variant="danger" />\r
    </Stack>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('Like')).toBeVisible());
    await userEvent.tab();
    // Moving along the toolbar swaps tooltips straight away.
    await waitFor(() => expect(canvas.getByText('Settings')).toBeVisible());
    await expect(canvas.getByText('Like')).not.toBeVisible();
  }
}`,...x.parameters?.docs?.source},description:{story:'`IconButton` adds a `kind="label"` tooltip showing its `label`, hidden from screen readers\r\nbecause the button is already named. When one tooltip has just closed the next opens without the\r\nhover delay, so moving along a toolbar swaps them at once.',...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    placement: 'bottom',
    content: 'Opens in a new tab'
  }
}`,...S.parameters?.docs?.source},description:{story:'`placement="bottom"` shows the tooltip below the trigger, for example when the trigger is near\r\nthe top of the screen.',...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Kept inside the viewport',
  decorators: [Story => <div style={{
    paddingTop: 48
  }}><Story /></div>],
  args: {
    content: 'A long description that would overflow the left edge if it were centred'
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    const tip = within(canvasElement).getByRole('tooltip', {
      hidden: true
    });
    await waitFor(() => expect(tip).toBeVisible());
    await expect(tip.getBoundingClientRect().left).toBeGreaterThanOrEqual(8);
  }
}`,...C.parameters?.docs?.source},description:{story:`A long tooltip on a trigger near the left edge is shifted to stay inside the viewport rather\r
than centred off screen.`,...C.parameters?.docs?.description}}}})))()}T();export{S as Bottom,b as Default,x as IconToolbar,C as NearTheEdge,w as __namedExportsOrder,y as default};