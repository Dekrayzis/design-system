import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Stack-CCsQXNDC.js";import{n as a,t as o}from"./IconButton-DL3_kfGg.js";import{_ as s,h as c,m as l,s as u}from"./icons-C9TAZLL5.js";var d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{d=n(),s(),r(),a(),f=t(),{expect:p,fn:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/IconButton`,component:o,args:{label:`Settings`,icon:(0,f.jsx)(l,{}),onClick:m()},argTypes:{icon:{control:!1},variant:{control:`inline-radio`,options:[`primary`,`secondary`,`ghost`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:"A button with only an icon. `label` is required and becomes the accessible name and tooltip."}}}},v={},y={render:e=>(0,f.jsxs)(i,{direction:`row`,gap:3,children:[(0,f.jsx)(o,{...e,variant:`ghost`}),(0,f.jsx)(o,{...e,variant:`secondary`,label:`Like`,icon:(0,f.jsx)(u,{})}),(0,f.jsx)(o,{...e,variant:`primary`,label:`Like`,icon:(0,f.jsx)(u,{})}),(0,f.jsx)(o,{...e,variant:`danger`,label:`Delete`,icon:(0,f.jsx)(c,{})})]})},b={play:async({canvasElement:e})=>{let t=g(e).getByRole(`button`,{name:`Favourite`});await p(t).toHaveAttribute(`aria-pressed`,`false`),await h.click(t),await p(t).toHaveAttribute(`aria-pressed`,`true`),await h.keyboard(` `),await p(t).toHaveAttribute(`aria-pressed`,`false`)},name:`As a toggle (aria-pressed)`,args:{label:`Favourite`,icon:(0,f.jsx)(u,{})},render:function(e){let[t,n]=(0,d.useState)(!1);return(0,f.jsx)(o,{...e,variant:t?`primary`:`secondary`,"aria-pressed":t,onClick:()=>n(e=>!e)})}},x=[`Default`,`Variants`,`Toggle`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source},description:{story:"A ghost icon button. `label` becomes the button’s `aria-label` and, by default, a tooltip on hover and keyboard focus; the icon itself is hidden from assistive tech.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="row" gap={3}>\r
      <IconButton {...args} variant="ghost" />\r
      <IconButton {...args} variant="secondary" label="Like" icon={<HeartIcon />} />\r
      <IconButton {...args} variant="primary" label="Like" icon={<HeartIcon />} />\r
      <IconButton {...args} variant="danger" label="Delete" icon={<TrashIcon />} />\r
    </Stack>
}`,...y.parameters?.docs?.source},description:{story:"The same `variant` options as `Button`: `ghost` (the default) for toolbars and dense UI, `secondary` and `primary` for more emphasis, `danger` for destructive actions.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Favourite'
    });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  },
  name: 'As a toggle (aria-pressed)',
  args: {
    label: 'Favourite',
    icon: <HeartIcon />
  },
  render: function Render(args) {
    const [pressed, setPressed] = useState(false);
    return <IconButton {...args} variant={pressed ? 'primary' : 'secondary'} aria-pressed={pressed} onClick={() => setPressed(p => !p)} />;
  }
}`,...b.parameters?.docs?.source},description:{story:"An on/off control made by passing `aria-pressed`. The accessible name stays “Favourite” while `aria-pressed` carries the state, so screen readers announce it as a toggle button; Space and Enter work because it is a native `<button>`.",...b.parameters?.docs?.description}}}})))()}S();export{v as Default,b as Toggle,y as Variants,x as __namedExportsOrder,_ as default};