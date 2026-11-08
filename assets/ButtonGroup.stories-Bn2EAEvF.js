import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Stack-CCsQXNDC.js";import{_ as a,c as o,i as s,o as c}from"./icons-C9TAZLL5.js";import{n as l,t as u}from"./ButtonGroup-mb_ulNBQ.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{d=n(),a(),r(),l(),f=t(),{expect:p,fn:m,userEvent:h,waitFor:g,within:_}=__STORYBOOK_MODULE_TEST__,v={title:`Components/ButtonGroup`,component:u,args:{label:`Kind of work`,defaultValue:`game`,options:[{value:`game`,label:`Game`},{value:`web`,label:`Web`},{value:`3d`,label:`3D`}],onValueChange:m()},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:"A segmented control (after the Portfolio2k26 `services-tabs`): an accent pill slides under the chosen option, and its label changes colour as the pill arrives. It is a radio group: Tab lands on the chosen option, the arrow keys move and select, wrapping at the ends, and Home and End jump to the first and last. The pill is positioned purely in CSS from the option count and the chosen index. Use `Tabs` when the choice switches between panels of content."}}}},y={play:async({canvasElement:e,args:t})=>{let n=_(e),r=n.getByRole(`radio`,{name:`Game`});await h.click(r),await h.keyboard(`{ArrowRight}`),await p(n.getByRole(`radio`,{name:`Web`})).toHaveFocus(),await p(t.onValueChange).toHaveBeenLastCalledWith(`web`),await h.keyboard(`{End}{ArrowRight}`),await p(n.getByRole(`radio`,{name:`Game`})).toBeChecked()}},b={render:e=>(0,f.jsxs)(i,{gap:4,align:`flex-start`,children:[(0,f.jsx)(u,{...e,size:`sm`,label:`Small`}),(0,f.jsx)(u,{...e,size:`md`,label:`Medium`}),(0,f.jsx)(u,{...e,size:`lg`,label:`Large`})]})},x={args:{label:`View`,defaultValue:`grid`,options:[{value:`grid`,label:`Grid`,icon:(0,f.jsx)(c,{})},{value:`list`,label:`List`,icon:(0,f.jsx)(o,{})},{value:`board`,label:`Board`,icon:(0,f.jsx)(s,{})}]}},S={play:async({canvasElement:e})=>{let t=_(e);await p(t.getByRole(`radio`,{name:`List view`})).toBeChecked(),await h.click(t.getByRole(`radio`,{name:`Grid view`})),await p(t.getByRole(`radio`,{name:`Grid view`})).toBeChecked()},args:{label:`View`,defaultValue:`list`,options:[{value:`grid`,label:`Grid view`,icon:(0,f.jsx)(c,{}),iconOnly:!0},{value:`list`,label:`List view`,icon:(0,f.jsx)(o,{}),iconOnly:!0},{value:`board`,label:`Board view`,icon:(0,f.jsx)(s,{}),iconOnly:!0}]}},C={args:{label:`Billing period`,fullWidth:!0,defaultValue:`monthly`,options:[{value:`monthly`,label:`Monthly`},{value:`yearly`,label:`Yearly (save 20%)`}]},decorators:[e=>(0,f.jsx)(`div`,{style:{maxWidth:420},children:(0,f.jsx)(e,{})})]},w={play:async({canvasElement:e})=>{let t=_(e);await h.click(t.getByRole(`radio`,{name:`Staging`})),await h.keyboard(`{ArrowRight}`),await p(t.getByRole(`radio`,{name:`Dev`})).toBeChecked(),await p(t.getByRole(`radio`,{name:`Production`})).toBeDisabled()},args:{label:`Environment`,defaultValue:`staging`,options:[{value:`dev`,label:`Dev`},{value:`staging`,label:`Staging`},{value:`prod`,label:`Production`,disabled:!0}]}},T={args:{defaultValue:void 0}},E={play:async({canvasElement:e})=>{let t=_(e);await h.click(t.getByRole(`radio`,{name:`3D`})),await p(t.getByText(`3d`)).toBeVisible();let n=t.getByRole(`radio`,{name:`3D`}),r=n.parentElement.querySelector(`span[aria-hidden]`);await g(()=>p(Math.round(r.getBoundingClientRect().left)).toBe(Math.round(n.getBoundingClientRect().left)),{timeout:2e3})},render:function(e){let[t,n]=(0,d.useState)(`web`);return(0,f.jsxs)(i,{gap:3,align:`flex-start`,children:[(0,f.jsx)(u,{...e,value:t,onValueChange:n}),(0,f.jsxs)(`p`,{style:{margin:0},children:[`Showing `,(0,f.jsx)(`strong`,{children:t}),` work.`]})]})}},D=[`Default`,`Sizes`,`WithIcons`,`IconOnly`,`FullWidth`,`WithDisabledOption`,`NoInitialValue`,`Controlled`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const game = canvas.getByRole('radio', {
      name: 'Game'
    });
    await userEvent.click(game);
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', {
      name: 'Web'
    })).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('web');
    await userEvent.keyboard('{End}{ArrowRight}');
    await expect(canvas.getByRole('radio', {
      name: 'Game'
    })).toBeChecked();
  }
}`,...y.parameters?.docs?.source},description:{story:"An uncontrolled group starting from `defaultValue`. Selection follows focus: the arrow keys move\r\nto and select the next option, wrapping at the ends, and `onValueChange` reports each new value.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Stack gap={4} align="flex-start">\r
      <ButtonGroup {...args} size="sm" label="Small" />\r
      <ButtonGroup {...args} size="md" label="Medium" />\r
      <ButtonGroup {...args} size="lg" label="Large" />\r
    </Stack>
}`,...b.parameters?.docs?.source},description:{story:"The three sizes: `sm`, `md` (the default) and `lg`.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'View',
    defaultValue: 'grid',
    options: [{
      value: 'grid',
      label: 'Grid',
      icon: <GridIcon />
    }, {
      value: 'list',
      label: 'List',
      icon: <ListIcon />
    }, {
      value: 'board',
      label: 'Board',
      icon: <ColumnsIcon />
    }]
  }
}`,...x.parameters?.docs?.source},description:{story:"Each option can take a decorative `icon`, shown before its label.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', {
      name: 'List view'
    })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Grid view'
    }));
    await expect(canvas.getByRole('radio', {
      name: 'Grid view'
    })).toBeChecked();
  },
  args: {
    label: 'View',
    defaultValue: 'list',
    options: [{
      value: 'grid',
      label: 'Grid view',
      icon: <GridIcon />,
      iconOnly: true
    }, {
      value: 'list',
      label: 'List view',
      icon: <ListIcon />,
      iconOnly: true
    }, {
      value: 'board',
      label: 'Board view',
      icon: <ColumnsIcon />,
      iconOnly: true
    }]
  }
}`,...S.parameters?.docs?.source},description:{story:"With `iconOnly`, only the icon is shown. A string `label` becomes the segment’s accessible name\r\nand appears in a tooltip on hover and keyboard focus, so every icon-only option still needs a\r\nmeaningful label.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Billing period',
    fullWidth: true,
    defaultValue: 'monthly',
    options: [{
      value: 'monthly',
      label: 'Monthly'
    }, {
      value: 'yearly',
      label: 'Yearly (save 20%)'
    }]
  },
  decorators: [Story => <div style={{
    maxWidth: 420
  }}><Story /></div>]
}`,...C.parameters?.docs?.source},description:{story:"`fullWidth` stretches the control to its container; the segments always share one width.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Staging'
    }));
    await userEvent.keyboard('{ArrowRight}');
    // Production is disabled, so the arrow wraps to Dev.
    await expect(canvas.getByRole('radio', {
      name: 'Dev'
    })).toBeChecked();
    await expect(canvas.getByRole('radio', {
      name: 'Production'
    })).toBeDisabled();
  },
  args: {
    label: 'Environment',
    defaultValue: 'staging',
    options: [{
      value: 'dev',
      label: 'Dev'
    }, {
      value: 'staging',
      label: 'Staging'
    }, {
      value: 'prod',
      label: 'Production',
      disabled: true
    }]
  }
}`,...w.parameters?.docs?.source},description:{story:"A `disabled` option can’t be chosen, and the arrow keys skip it, wrapping past it to the next\r\nenabled option.",...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: undefined
  }
}`,...T.parameters?.docs?.source},description:{story:`With no value, no option is checked and the pill stays hidden until one is chosen. The first\r
enabled option is the tab stop.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', {
      name: '3D'
    }));
    await expect(canvas.getByText('3d')).toBeVisible();
    // After the slide, the pill sits exactly under the chosen segment.
    const chosen = canvas.getByRole('radio', {
      name: '3D'
    });
    const thumb = chosen.parentElement!.querySelector('span[aria-hidden]') as HTMLElement;
    await waitFor(() => expect(Math.round(thumb.getBoundingClientRect().left)).toBe(Math.round(chosen.getBoundingClientRect().left)), {
      timeout: 2000
    });
  },
  render: function Render(args) {
    const [value, setValue] = useState('web');
    return <Stack gap={3} align="flex-start">\r
        <ButtonGroup {...args} value={value} onValueChange={setValue} />\r
        <p style={{
        margin: 0
      }}>\r
          Showing <strong>{value}</strong> work.\r
        </p>\r
      </Stack>;
  }
}`,...E.parameters?.docs?.source},description:{story:"Pass `value` and `onValueChange` to own the state, shown here in the paragraph below. The pill\r\nslides to sit exactly under the chosen segment.",...E.parameters?.docs?.description}}}})))()}O();export{E as Controlled,y as Default,C as FullWidth,S as IconOnly,T as NoInitialValue,b as Sizes,w as WithDisabledOption,x as WithIcons,D as __namedExportsOrder,v as default};