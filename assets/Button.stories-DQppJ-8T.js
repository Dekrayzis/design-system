import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,n as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{_ as s,f as c,h as l,t as u}from"./icons-C9TAZLL5.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{s(),a(),n(),d=t(),{expect:f,fn:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g={title:`Components/Button`,component:i,args:{children:`Save changes`,onClick:p()},argTypes:{variant:{control:`inline-radio`,options:[`primary`,`secondary`,`ghost`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},startIcon:{control:!1},endIcon:{control:!1}},parameters:{docs:{description:{component:"A `<button>` for actions on the current page. Use `LinkButton` when the control navigates somewhere: it renders a real `<a href>`."}}}},_={play:async({canvasElement:e,args:t})=>{let n=h(e).getByRole(`button`,{name:`Save changes`});await f(n).toHaveAttribute(`type`,`button`),await m.click(n),await m.keyboard(`{Enter}`),await f(t.onClick).toHaveBeenCalledTimes(2)}},v={render:e=>(0,d.jsxs)(o,{direction:`row`,gap:3,wrap:!0,children:[(0,d.jsx)(i,{...e,variant:`primary`,children:`Primary`}),(0,d.jsx)(i,{...e,variant:`secondary`,children:`Secondary`}),(0,d.jsx)(i,{...e,variant:`ghost`,children:`Ghost`}),(0,d.jsx)(i,{...e,variant:`danger`,children:`Danger`})]})},y={render:e=>(0,d.jsxs)(o,{direction:`row`,gap:3,align:`center`,children:[(0,d.jsx)(i,{...e,size:`sm`,children:`Small`}),(0,d.jsx)(i,{...e,size:`md`,children:`Medium`}),(0,d.jsx)(i,{...e,size:`lg`,children:`Large`})]})},b={render:e=>(0,d.jsxs)(o,{direction:`row`,gap:3,wrap:!0,children:[(0,d.jsx)(i,{...e,startIcon:(0,d.jsx)(c,{}),children:`New project`}),(0,d.jsx)(i,{...e,variant:`secondary`,endIcon:(0,d.jsx)(u,{}),children:`Continue`}),(0,d.jsx)(i,{...e,variant:`danger`,startIcon:(0,d.jsx)(l,{}),children:`Delete`})]})},x={play:async({canvasElement:e,args:t})=>{let n=h(e).getByRole(`button`,{name:`Saving…`});await f(n).toHaveAttribute(`aria-busy`,`true`),await m.click(n),await f(t.onClick).not.toHaveBeenCalled()},args:{loading:!0,children:`Saving…`}},S={play:async({canvasElement:e,args:t})=>{let n=h(e).getByRole(`button`);await f(n).toBeDisabled(),await m.click(n,{pointerEventsCheck:0}),await f(t.onClick).not.toHaveBeenCalled()},args:{disabled:!0}},C={args:{fullWidth:!0},parameters:{layout:`padded`}},w={play:async({canvasElement:e})=>{let t=h(e);await f(t.getByRole(`link`,{name:`Read the docs`})).toHaveAttribute(`href`,`https://example.com/docs`),await f(t.queryByRole(`button`)).not.toBeInTheDocument()},name:`LinkButton (navigation)`,render:()=>(0,d.jsxs)(o,{direction:`row`,gap:3,children:[(0,d.jsx)(r,{href:`https://example.com/docs`,endIcon:(0,d.jsx)(u,{}),children:`Read the docs`}),(0,d.jsx)(r,{href:`https://example.com/pricing`,variant:`secondary`,children:`See pricing`})]})},T=[`Primary`,`Variants`,`Sizes`,`WithIcons`,`Loading`,`Disabled`,`FullWidth`,`AsLink`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Save changes'
    });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  }
}`,..._.parameters?.docs?.source},description:{story:'The default `primary` button for the main action in a view. It renders `type="button"` unless\r\ntold otherwise, so it never submits a surrounding form by accident, and it activates on click or\r\nEnter.',..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="row" gap={3} wrap>\r
      <Button {...args} variant="primary">Primary</Button>\r
      <Button {...args} variant="secondary">Secondary</Button>\r
      <Button {...args} variant="ghost">Ghost</Button>\r
      <Button {...args} variant="danger">Danger</Button>\r
    </Stack>
}`,...v.parameters?.docs?.source},description:{story:"`primary` for the main action, `secondary` for alternatives, `ghost` for low-emphasis actions and\r\n`danger` for destructive ones.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="row" gap={3} align="center">\r
      <Button {...args} size="sm">Small</Button>\r
      <Button {...args} size="md">Medium</Button>\r
      <Button {...args} size="lg">Large</Button>\r
    </Stack>
}`,...y.parameters?.docs?.source},description:{story:"The three sizes: `sm`, `md` (the default) and `lg`.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="row" gap={3} wrap>\r
      <Button {...args} startIcon={<PlusIcon />}>New project</Button>\r
      <Button {...args} variant="secondary" endIcon={<ArrowRightIcon />}>Continue</Button>\r
      <Button {...args} variant="danger" startIcon={<TrashIcon />}>Delete</Button>\r
    </Stack>
}`,...b.parameters?.docs?.source},description:{story:"`startIcon` and `endIcon` place an icon before or after the label. Icons are wrapped in\r\n`aria-hidden`, so the text stays the accessible name.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Saving…'
    });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  args: {
    loading: true,
    children: 'Saving…'
  }
}`,...x.parameters?.docs?.source},description:{story:"`loading` shows a spinner, sets `aria-busy` and `aria-disabled`, and ignores clicks while keeping\r\nthe button focusable. The label is announced through a sibling status region, so pass `loading`\r\nas a boolean from the start (`loading={isSaving}`), not only when it becomes true.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button, {
      pointerEventsCheck: 0
    });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  args: {
    disabled: true
  }
}`,...S.parameters?.docs?.source},description:{story:"A natively `disabled` button: it can’t be focused or clicked. For a temporary busy state prefer\r\n`loading`, which keeps the button focusable.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    fullWidth: true
  },
  parameters: {
    layout: 'padded'
  }
}`,...C.parameters?.docs?.source},description:{story:"`fullWidth` stretches the button to the width of its container, for example in a narrow form or a\r\ncard footer.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', {
      name: 'Read the docs'
    })).toHaveAttribute('href', 'https://example.com/docs');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
  name: 'LinkButton (navigation)',
  render: () => <Stack direction="row" gap={3}>\r
      <LinkButton href="https://example.com/docs" endIcon={<ArrowRightIcon />}>\r
        Read the docs\r
      </LinkButton>\r
      <LinkButton href="https://example.com/pricing" variant="secondary">\r
        See pricing\r
      </LinkButton>\r
    </Stack>
}`,...w.parameters?.docs?.source},description:{story:"`LinkButton` looks like a button but renders a real `<a href>`, so open in new tab, history and\r\ncrawling all work. Use it whenever the control navigates rather than acts.",...w.parameters?.docs?.description}}}})))()}E();export{w as AsLink,S as Disabled,C as FullWidth,x as Loading,_ as Primary,y as Sizes,v as Variants,b as WithIcons,T as __namedExportsOrder,g as default};