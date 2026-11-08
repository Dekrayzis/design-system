import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";import{_ as i,c as a,i as o,o as s}from"./icons-C9TAZLL5.js";import{n as c,t as l}from"./TextField-Cpptxuig.js";import{n as u,t as d}from"./Switch-Dbjoih5B.js";import{a as f,i as p,n as m,r as h,t as g}from"./Tabs-BiIGn6EW.js";var _,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{i(),u(),c(),n(),f(),_=t(),{expect:v,fn:y,userEvent:b,waitFor:x,within:S}=__STORYBOOK_MODULE_TEST__,C={title:`Components/Tabs`,component:p,subcomponents:{TabList:m,Tab:g,TabPanel:h},args:{defaultValue:`profile`,onValueChange:y(),children:null},argTypes:{children:{control:!1}},parameters:{docs:{description:{component:'Switches between panels of related content in the same place, following the WAI-ARIA tabs pattern: `TabList` renders `role="tablist"`, each `Tab` a `<button role="tab">` and each `TabPanel` a `role="tabpanel"` labelled by its tab. Selection follows focus, and only the selected tab is in the tab order. If each tab should be its own page with its own URL, use navigation links instead.'}}}},w={render:e=>(0,_.jsx)(`div`,{style:{maxWidth:480},children:(0,_.jsxs)(p,{...e,children:[(0,_.jsxs)(m,{label:`Account settings`,children:[(0,_.jsx)(g,{value:`profile`,children:`Profile`}),(0,_.jsx)(g,{value:`notifications`,children:`Notifications`}),(0,_.jsx)(g,{value:`billing`,disabled:!0,children:`Billing`}),(0,_.jsx)(g,{value:`security`,children:`Security`})]}),(0,_.jsx)(h,{value:`profile`,children:(0,_.jsxs)(r,{gap:4,children:[(0,_.jsx)(l,{label:`Display name`,defaultValue:`Alex Morgan`}),(0,_.jsx)(l,{label:`Email`,type:`email`,defaultValue:`alex@example.com`})]})}),(0,_.jsx)(h,{value:`notifications`,children:(0,_.jsxs)(r,{gap:4,children:[(0,_.jsx)(d,{label:`Mentions`,defaultChecked:!0}),(0,_.jsx)(d,{label:`Weekly digest`})]})}),(0,_.jsx)(h,{value:`billing`,children:`Billing details.`}),(0,_.jsx)(h,{value:`security`,children:(0,_.jsx)(`p`,{style:{margin:0},children:`Two-factor authentication is on.`})})]})}),play:async({canvasElement:e,args:t})=>{let n=S(e),r=n.getByRole(`tab`,{name:`Profile`});await b.click(r),await b.keyboard(`{ArrowRight}`),await v(n.getByRole(`tab`,{name:`Notifications`})).toHaveFocus(),await v(t.onValueChange).toHaveBeenLastCalledWith(`notifications`),await b.keyboard(`{ArrowRight}`),await v(n.getByRole(`tab`,{name:`Security`})).toHaveAttribute(`aria-selected`,`true`),await b.keyboard(`{Home}`),await v(r).toHaveAttribute(`aria-selected`,`true`)}},T={game:`Gameplay systems, tools and pipelines in Unreal Engine.`,web:`Full-stack web apps with React and Next.js.`,"3d":`Real-time 3D: models, shaders and viewers.`},E={name:`Pill (sliding)`,args:{defaultValue:`game`},render:e=>(0,_.jsxs)(p,{...e,children:[(0,_.jsxs)(m,{label:`Kind of work`,variant:`pill`,children:[(0,_.jsx)(g,{value:`game`,children:`Game`}),(0,_.jsx)(g,{value:`web`,children:`Web`}),(0,_.jsx)(g,{value:`3d`,children:`3D`})]}),Object.entries(T).map(([e,t])=>(0,_.jsx)(h,{value:e,children:(0,_.jsx)(`p`,{style:{margin:0},children:t})},e))]}),play:async({canvasElement:e,args:t})=>{let n=S(e);await b.click(n.getByRole(`tab`,{name:`Game`})),await b.keyboard(`{ArrowRight}`),await v(n.getByRole(`tab`,{name:`Web`})).toHaveAttribute(`aria-selected`,`true`),await v(n.getByRole(`tabpanel`)).toHaveTextContent(`React`),await v(t.onValueChange).toHaveBeenLastCalledWith(`web`)}},D={args:{defaultValue:`web`},render:e=>(0,_.jsx)(r,{gap:5,children:[`sm`,`md`,`lg`].map(t=>(0,_.jsxs)(p,{...e,children:[(0,_.jsxs)(m,{label:`Kind of work (${t})`,variant:`pill`,size:t,children:[(0,_.jsx)(g,{value:`game`,children:`Game`}),(0,_.jsx)(g,{value:`web`,children:`Web`}),(0,_.jsx)(g,{value:`3d`,children:`3D`})]}),Object.entries(T).map(([e,t])=>(0,_.jsx)(h,{value:e,children:(0,_.jsx)(`p`,{style:{margin:0},children:t})},e))]},t))})},O={play:async({canvasElement:e})=>{let t=S(e);await b.click(t.getByRole(`tab`,{name:`Grid`})),await b.keyboard(`{ArrowRight}{ArrowRight}`),await v(t.getByRole(`tab`,{name:`Grid`})).toHaveFocus(),await b.keyboard(`{ArrowRight}`),await v(t.getByRole(`tabpanel`)).toHaveTextContent(`A compact list.`);let n=t.getByRole(`tab`,{name:`List`}),r=n.parentElement.querySelector(`span[aria-hidden]`);await x(()=>v(Math.round(r.getBoundingClientRect().left)).toBe(Math.round(n.getBoundingClientRect().left)),{timeout:2e3})},args:{defaultValue:`grid`},render:e=>(0,_.jsx)(`div`,{style:{maxWidth:480},children:(0,_.jsxs)(p,{...e,children:[(0,_.jsxs)(m,{label:`View`,variant:`pill`,fullWidth:!0,children:[(0,_.jsx)(g,{value:`grid`,icon:(0,_.jsx)(s,{}),children:`Grid`}),(0,_.jsx)(g,{value:`list`,icon:(0,_.jsx)(a,{}),children:`List`}),(0,_.jsx)(g,{value:`board`,icon:(0,_.jsx)(o,{}),disabled:!0,children:`Board`})]}),(0,_.jsx)(h,{value:`grid`,children:`Cards in a responsive grid.`}),(0,_.jsx)(h,{value:`list`,children:`A compact list.`}),(0,_.jsx)(h,{value:`board`,children:`Columns by status.`})]})})},k={args:{defaultValue:`grid`},render:e=>(0,_.jsxs)(p,{...e,children:[(0,_.jsxs)(m,{label:`View`,children:[(0,_.jsx)(g,{value:`grid`,icon:(0,_.jsx)(s,{}),children:`Grid`}),(0,_.jsx)(g,{value:`list`,icon:(0,_.jsx)(a,{}),children:`List`})]}),(0,_.jsx)(h,{value:`grid`,children:`Cards in a responsive grid.`}),(0,_.jsx)(h,{value:`list`,children:`A compact list.`})]})},A=[`Default`,`Pill`,`PillSizes`,`PillWithIcons`,`UnderlineWithIcons`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 480
  }}>\r
      <Tabs {...args}>\r
        <TabList label="Account settings">\r
          <Tab value="profile">Profile</Tab>\r
          <Tab value="notifications">Notifications</Tab>\r
          <Tab value="billing" disabled>Billing</Tab>\r
          <Tab value="security">Security</Tab>\r
        </TabList>\r
        <TabPanel value="profile">\r
          <Stack gap={4}>\r
            <TextField label="Display name" defaultValue="Alex Morgan" />\r
            <TextField label="Email" type="email" defaultValue="alex@example.com" />\r
          </Stack>\r
        </TabPanel>\r
        <TabPanel value="notifications">\r
          <Stack gap={4}>\r
            <Switch label="Mentions" defaultChecked />\r
            <Switch label="Weekly digest" />\r
          </Stack>\r
        </TabPanel>\r
        <TabPanel value="billing">Billing details.</TabPanel>\r
        <TabPanel value="security">\r
          <p style={{
          margin: 0
        }}>Two-factor authentication is on.</p>\r
        </TabPanel>\r
      </Tabs>\r
    </div>,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', {
      name: 'Profile'
    });
    await userEvent.click(profile);
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', {
      name: 'Notifications'
    })).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('notifications');

    // Disabled tabs are skipped.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', {
      name: 'Security'
    })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(profile).toHaveAttribute('aria-selected', 'true');
  }
}`,...w.parameters?.docs?.source},description:{story:'Underline tabs, named by the `TabList` `label` ("Account settings"). The list is a single tab\r\nstop: Left and Right arrows move between tabs and select them, Home and End jump to the ends,\r\nand the `disabled` Billing tab is skipped.',...w.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Pill (sliding)',
  args: {
    defaultValue: 'game'
  },
  render: args => <Tabs {...args}>\r
      <TabList label="Kind of work" variant="pill">\r
        <Tab value="game">Game</Tab>\r
        <Tab value="web">Web</Tab>\r
        <Tab value="3d">3D</Tab>\r
      </TabList>\r
      {Object.entries(panelText).map(([value, text]) => <TabPanel key={value} value={value}>\r
          <p style={{
        margin: 0
      }}>{text}</p>\r
        </TabPanel>)}\r
    </Tabs>,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', {
      name: 'Game'
    }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', {
      name: 'Web'
    })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('React');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('web');
  }
}`,...E.parameters?.docs?.source},description:{story:'With `variant="pill"` the tabs share the sliding accent pill of `ButtonGroup` but keep full tab\r\nsemantics: each tab controls its panel, and the arrow keys move between tabs and select them.',...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'web'
  },
  render: args => <Stack gap={5}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Tabs key={size} {...args}>\r
          <TabList label={\`Kind of work (\${size})\`} variant="pill" size={size}>\r
            <Tab value="game">Game</Tab>\r
            <Tab value="web">Web</Tab>\r
            <Tab value="3d">3D</Tab>\r
          </TabList>\r
          {/* Every tab must control a panel; aria-controls would point at nothing otherwise. */}\r
          {Object.entries(panelText).map(([value, text]) => <TabPanel key={value} value={value}>\r
              <p style={{
          margin: 0
        }}>{text}</p>\r
            </TabPanel>)}\r
        </Tabs>)}\r
    </Stack>
}`,...D.parameters?.docs?.source},description:{story:"The pill variant at `size` `sm`, `md` and `lg`. Pill tabs in a list share one width, set by the\r\nwidest label.",...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', {
      name: 'Grid'
    }));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    // Board is disabled, so focus wraps back to Grid.
    await expect(canvas.getByRole('tab', {
      name: 'Grid'
    })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('A compact list.');
    const tab = canvas.getByRole('tab', {
      name: 'List'
    });
    const thumb = tab.parentElement!.querySelector('span[aria-hidden]') as HTMLElement;
    await waitFor(() => expect(Math.round(thumb.getBoundingClientRect().left)).toBe(Math.round(tab.getBoundingClientRect().left)), {
      timeout: 2000
    });
  },
  args: {
    defaultValue: 'grid'
  },
  render: args => <div style={{
    maxWidth: 480
  }}>\r
      <Tabs {...args}>\r
        <TabList label="View" variant="pill" fullWidth>\r
          <Tab value="grid" icon={<GridIcon />}>Grid</Tab>\r
          <Tab value="list" icon={<ListIcon />}>List</Tab>\r
          <Tab value="board" icon={<ColumnsIcon />} disabled>Board</Tab>\r
        </TabList>\r
        <TabPanel value="grid">Cards in a responsive grid.</TabPanel>\r
        <TabPanel value="list">A compact list.</TabPanel>\r
        <TabPanel value="board">Columns by status.</TabPanel>\r
      </Tabs>\r
    </div>
}`,...O.parameters?.docs?.source},description:{story:"Pill tabs with an `icon` before each label, stretched to the container with `fullWidth`. The\r\nicons are decorative (`aria-hidden`), so the text names each tab; the disabled Board tab is\r\nskipped and arrow keys wrap from the last enabled tab to the first.",...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'grid'
  },
  render: args => <Tabs {...args}>\r
      <TabList label="View">\r
        <Tab value="grid" icon={<GridIcon />}>Grid</Tab>\r
        <Tab value="list" icon={<ListIcon />}>List</Tab>\r
      </TabList>\r
      <TabPanel value="grid">Cards in a responsive grid.</TabPanel>\r
      <TabPanel value="list">A compact list.</TabPanel>\r
    </Tabs>
}`,...k.parameters?.docs?.source},description:{story:"The default underline variant with a decorative `icon` before each label.",...k.parameters?.docs?.description}}}})))()}j();export{w as Default,E as Pill,D as PillSizes,O as PillWithIcons,k as UnderlineWithIcons,A as __namedExportsOrder,C as default};