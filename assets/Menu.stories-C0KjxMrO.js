import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./VisuallyHidden-DTJ2aJZj.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{r as o,t as s}from"./Card-RSkRbbOw.js";import{_ as c,a as l,f as u,g as d,h as f,l as p,m,t as h,u as g}from"./icons-C9TAZLL5.js";import{a as _,i as v,n as y,r as b,t as x}from"./Menu-gLn_KFpY.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{c(),o(),i(),n(),_(),S=t(),{expect:C,fn:w,userEvent:T,within:E}=__STORYBOOK_MODULE_TEST__,D={title:`Components/Menu`,component:x,subcomponents:{MenuItem:b,MenuGroup:y,MenuSeparator:v},args:{label:`Actions`,onOpenChange:w()},argTypes:{triggerIcon:{control:!1},items:{control:!1},variant:{control:`inline-radio`,options:[`primary`,`secondary`,`ghost`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},decorators:[e=>(0,S.jsx)(`div`,{style:{minHeight:320},children:(0,S.jsx)(e,{})})],parameters:{docs:{description:{component:'An actions menu: a `<button aria-haspopup="menu">` that opens a `role="menu"` list of `menuitem` buttons and links in the top layer, following the WAI-ARIA menu button pattern. Use it for commands such as Edit, Duplicate or Delete. To pick a value use `Select`, and for site navigation use ordinary links.'}}}},O=w(),k=w(),A=w(),j={render:e=>(0,S.jsxs)(x,{...e,children:[(0,S.jsx)(b,{onSelect:O,children:`Edit`}),(0,S.jsx)(b,{onSelect:k,children:`Duplicate`}),(0,S.jsx)(b,{onSelect:A,destructive:!0,children:`Delete`})]}),play:async({canvasElement:e,args:t})=>{let n=E(e),r=n.getByRole(`button`,{name:`Actions`});r.focus(),await T.keyboard(`{Enter}`),await C(r).toHaveAttribute(`aria-expanded`,`true`),await C(n.getByRole(`menuitem`,{name:`Edit`})).toHaveFocus(),await T.keyboard(`{ArrowUp}`),await C(n.getByRole(`menuitem`,{name:`Delete`})).toHaveFocus(),await T.keyboard(`{ArrowDown}`),await C(n.getByRole(`menuitem`,{name:`Edit`})).toHaveFocus(),await T.keyboard(`{Escape}`),await C(r).toHaveAttribute(`aria-expanded`,`false`),await C(r).toHaveFocus(),await T.keyboard(`{ArrowDown}{ArrowDown}{Enter}`),await C(k).toHaveBeenCalled(),await C(t.onOpenChange).toHaveBeenLastCalledWith(!1),await C(r).toHaveFocus()}},M={name:`Icon-only trigger`,args:{label:`More actions`,iconOnly:!0},render:e=>(0,S.jsxs)(a,{direction:`row`,gap:3,align:`center`,children:[(0,S.jsxs)(x,{...e,children:[(0,S.jsx)(b,{children:`Rename`}),(0,S.jsx)(b,{children:`Move to folder`}),(0,S.jsx)(b,{destructive:!0,children:`Delete`})]}),(0,S.jsxs)(x,{label:`Settings`,iconOnly:!0,variant:`secondary`,triggerIcon:(0,S.jsx)(m,{}),children:[(0,S.jsx)(b,{children:`Preferences`}),(0,S.jsx)(b,{children:`Keyboard shortcuts`})]})]}),play:async({canvasElement:e})=>{let t=E(e),n=t.getByRole(`button`,{name:`More actions`});await T.click(n),await C(t.getByRole(`menu`,{name:`More actions`})).not.toHaveAttribute(`hidden`),await C(t.getByRole(`menuitem`,{name:`Rename`})).toHaveFocus(),await T.tab(),await C(n).toHaveAttribute(`aria-expanded`,`false`),await C(t.getByRole(`button`,{name:`Settings`})).toHaveFocus()}},N={name:`Icons and shortcuts`,args:{label:`File`},render:e=>(0,S.jsxs)(x,{...e,children:[(0,S.jsx)(b,{icon:(0,S.jsx)(u,{}),shortcut:`Ctrl+N`,children:`New file`}),(0,S.jsx)(b,{icon:(0,S.jsx)(g,{}),shortcut:`Ctrl+Shift+E`,children:`Email a copy`}),(0,S.jsx)(b,{icon:(0,S.jsx)(p,{}),shortcut:`Ctrl+L`,children:`Lock`}),(0,S.jsx)(b,{icon:(0,S.jsx)(h,{}),children:`Move to…`})]}),play:async({canvasElement:e})=>{let t=E(e);await T.click(t.getByRole(`button`,{name:`File`})),await T.keyboard(`l`),await C(t.getByRole(`menuitem`,{name:`Lock`})).toHaveFocus()}},P={name:`Disabled and destructive items`,args:{label:`Project`},render:e=>(0,S.jsxs)(x,{...e,children:[(0,S.jsx)(b,{children:`Rename`}),(0,S.jsx)(b,{disabled:!0,children:`Transfer ownership`}),(0,S.jsx)(v,{}),(0,S.jsx)(b,{icon:(0,S.jsx)(f,{}),destructive:!0,children:`Delete project`}),(0,S.jsx)(b,{icon:(0,S.jsx)(f,{}),destructive:!0,disabled:!0,children:`Delete workspace`})]}),play:async({canvasElement:e})=>{let t=E(e);await T.click(t.getByRole(`button`,{name:`Project`})),await T.keyboard(`{ArrowDown}`);let n=t.getByRole(`menuitem`,{name:`Transfer ownership`});await C(n).toHaveFocus(),await C(n).toHaveAttribute(`aria-disabled`,`true`),await T.keyboard(`{Enter}`),await C(t.getByRole(`menu`)).not.toHaveAttribute(`hidden`)}},F={name:`Groups and separators`,args:{label:`Account`},render:e=>(0,S.jsxs)(x,{...e,triggerIcon:(0,S.jsx)(d,{}),children:[(0,S.jsxs)(y,{label:`Signed in as Ada`,children:[(0,S.jsx)(b,{icon:(0,S.jsx)(d,{}),children:`Profile`}),(0,S.jsx)(b,{icon:(0,S.jsx)(m,{}),children:`Settings`})]}),(0,S.jsx)(v,{}),(0,S.jsxs)(y,{label:`Language`,children:[(0,S.jsx)(b,{icon:(0,S.jsx)(l,{}),children:`English (UK)`}),(0,S.jsx)(b,{icon:(0,S.jsx)(l,{}),children:`Français`})]}),(0,S.jsx)(v,{}),(0,S.jsx)(b,{children:`Sign out`})]}),play:async({canvasElement:e})=>{let t=E(e);await T.click(t.getByRole(`button`,{name:`Account`})),await C(t.getByRole(`group`,{name:`Language`})).toBeInTheDocument(),await C(t.getAllByRole(`separator`)).toHaveLength(2)}},I={name:`Link items`,args:{label:`Open`},render:e=>(0,S.jsxs)(x,{...e,children:[(0,S.jsx)(b,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/`,target:`_blank`,rel:`noreferrer`,children:`Open the APG pattern in a new tab`}),(0,S.jsx)(b,{href:`#preview`,children:`Jump to the preview`}),(0,S.jsx)(v,{}),(0,S.jsx)(b,{children:`Copy link`})]}),play:async({canvasElement:e})=>{let t=E(e);await T.click(t.getByRole(`button`,{name:`Open`}));let n=t.getByRole(`menuitem`,{name:`Open the APG pattern in a new tab`});await C(n.tagName).toBe(`A`),await C(n).toHaveAttribute(`target`,`_blank`)}},L={name:`Items shorthand`,args:{label:`Sort`,items:[{label:`Newest first`,onSelect:w()},{label:`Oldest first`,onSelect:w()},{label:`Most replies`,onSelect:w(),shortcut:`R`},{label:`Unanswered only`,disabled:!0}]}},R={name:`Inside a card`,render:()=>(0,S.jsxs)(s,{as:`article`,style:{maxWidth:360},children:[(0,S.jsxs)(a,{direction:`row`,justify:`space-between`,align:`center`,children:[(0,S.jsx)(`h3`,{style:{margin:0,fontSize:`var(--ds-font-size-md)`},children:`Quarterly report`}),(0,S.jsxs)(x,{label:`Actions for Quarterly report`,iconOnly:!0,size:`sm`,children:[(0,S.jsx)(b,{children:`Share`}),(0,S.jsx)(b,{children:`Download PDF`}),(0,S.jsx)(v,{}),(0,S.jsx)(b,{destructive:!0,children:`Archive`})]})]}),(0,S.jsx)(`p`,{style:{marginBottom:0},children:`Revenue grew 12% on the previous quarter.`})]}),play:async({canvasElement:e})=>{let t=E(e),n=t.getByRole(`button`,{name:`Actions for Quarterly report`});await T.click(n),await T.click(t.getByRole(`menuitem`,{name:`Share`})),await C(n).toHaveFocus(),await C(n).toHaveAttribute(`aria-expanded`,`false`)}},z=[{id:`INV-041`,customer:`Northwind`,total:`£1,200.00`},{id:`INV-042`,customer:`Contoso`,total:`£860.50`},{id:`INV-043`,customer:`Fabrikam`,total:`£2,410.00`}],B={name:`Inside a table row`,render:()=>(0,S.jsxs)(`table`,{style:{borderCollapse:`collapse`,minWidth:420},children:[(0,S.jsx)(`caption`,{style:{textAlign:`start`,paddingBottom:8},children:`Invoices`}),(0,S.jsx)(`thead`,{children:(0,S.jsxs)(`tr`,{children:[(0,S.jsx)(`th`,{scope:`col`,style:{textAlign:`start`},children:`Invoice`}),(0,S.jsx)(`th`,{scope:`col`,style:{textAlign:`start`},children:`Customer`}),(0,S.jsx)(`th`,{scope:`col`,style:{textAlign:`end`},children:`Total`}),(0,S.jsx)(`th`,{scope:`col`,children:(0,S.jsx)(r,{children:`Actions`})})]})}),(0,S.jsx)(`tbody`,{children:z.map(e=>(0,S.jsxs)(`tr`,{style:{borderTop:`1px solid var(--ds-color-border)`},children:[(0,S.jsx)(`td`,{children:e.id}),(0,S.jsx)(`td`,{children:e.customer}),(0,S.jsx)(`td`,{style:{textAlign:`end`},children:e.total}),(0,S.jsx)(`td`,{style:{textAlign:`end`},children:(0,S.jsxs)(x,{label:`Actions for ${e.id}`,iconOnly:!0,size:`sm`,children:[(0,S.jsx)(b,{children:`View`}),(0,S.jsx)(b,{children:`Send reminder`}),(0,S.jsx)(b,{href:`#${e.id}`,children:`Open in new tab`}),(0,S.jsx)(v,{}),(0,S.jsx)(b,{destructive:!0,children:`Void invoice`})]})})]},e.id))})]}),play:async({canvasElement:e})=>{let t=E(e),n=t.getByRole(`button`,{name:`Actions for INV-042`});n.focus(),await T.keyboard(`{ArrowUp}`),await C(n).toHaveAttribute(`aria-expanded`,`true`),await C(E(t.getByRole(`menu`,{name:`Actions for INV-042`})).getByRole(`menuitem`,{name:`Void invoice`})).toHaveFocus(),await T.keyboard(`{Escape}`),await C(n).toHaveFocus()}},V=[`Default`,`IconTrigger`,`IconsAndShortcuts`,`DisabledAndDestructive`,`GroupsAndSeparators`,`LinkItems`,`ItemsShorthand`,`InACard`,`InATableRow`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <Menu {...args}>\r
      <MenuItem onSelect={onEdit}>Edit</MenuItem>\r
      <MenuItem onSelect={onDuplicate}>Duplicate</MenuItem>\r
      <MenuItem onSelect={onDelete} destructive>\r
        Delete\r
      </MenuItem>\r
    </Menu>,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Actions'
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('menuitem', {
      name: 'Edit'
    })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('menuitem', {
      name: 'Delete'
    })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', {
      name: 'Edit'
    })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(onDuplicate).toHaveBeenCalled();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  }
}`,...j.parameters?.docs?.source},description:{story:`A labelled trigger with a chevron. Enter, Space or ↓ opens the menu on the first item and ↑ on the last; the arrow keys wrap, Escape closes it and focus goes back to the button.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Icon-only trigger',
  args: {
    label: 'More actions',
    iconOnly: true
  },
  render: args => <Stack direction="row" gap={3} align="center">\r
      <Menu {...args}>\r
        <MenuItem>Rename</MenuItem>\r
        <MenuItem>Move to folder</MenuItem>\r
        <MenuItem destructive>Delete</MenuItem>\r
      </Menu>\r
      <Menu label="Settings" iconOnly variant="secondary" triggerIcon={<SettingsIcon />}>\r
        <MenuItem>Preferences</MenuItem>\r
        <MenuItem>Keyboard shortcuts</MenuItem>\r
      </Menu>\r
    </Stack>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'More actions'
    });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('menu', {
      name: 'More actions'
    })).not.toHaveAttribute('hidden');
    await expect(canvas.getByRole('menuitem', {
      name: 'Rename'
    })).toHaveFocus();
    await userEvent.tab();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', {
      name: 'Settings'
    })).toHaveFocus();
  }
}`,...M.parameters?.docs?.source},description:{story:'`iconOnly` renders an `IconButton`, a "⋯" icon by default, with `label` as its accessible name and tooltip, so the trigger is always named. Tab closes the menu and moves on to the next control.',...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Icons and shortcuts',
  args: {
    label: 'File'
  },
  render: args => <Menu {...args}>\r
      <MenuItem icon={<PlusIcon />} shortcut="Ctrl+N">New file</MenuItem>\r
      <MenuItem icon={<MailIcon />} shortcut="Ctrl+Shift+E">Email a copy</MenuItem>\r
      <MenuItem icon={<LockIcon />} shortcut="Ctrl+L">Lock</MenuItem>\r
      <MenuItem icon={<ArrowRightIcon />}>Move to…</MenuItem>\r
    </Menu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'File'
    }));
    await userEvent.keyboard('l');
    await expect(canvas.getByRole('menuitem', {
      name: 'Lock'
    })).toHaveFocus();
  }
}`,...N.parameters?.docs?.source},description:{story:"Decorative icons before each label and shortcut hints after it. The hint is visual only; pass `keyShortcuts` to set `aria-keyshortcuts` when the shortcut really works on the page. Typing a letter jumps to the next item starting with it.",...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'Disabled and destructive items',
  args: {
    label: 'Project'
  },
  render: args => <Menu {...args}>\r
      <MenuItem>Rename</MenuItem>\r
      <MenuItem disabled>Transfer ownership</MenuItem>\r
      <MenuSeparator />\r
      <MenuItem icon={<TrashIcon />} destructive>\r
        Delete project\r
      </MenuItem>\r
      <MenuItem icon={<TrashIcon />} destructive disabled>\r
        Delete workspace\r
      </MenuItem>\r
    </Menu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Project'
    }));
    await userEvent.keyboard('{ArrowDown}');
    const disabled = canvas.getByRole('menuitem', {
      name: 'Transfer ownership'
    });
    await expect(disabled).toHaveFocus();
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('menu')).not.toHaveAttribute('hidden');
  }
}`,...P.parameters?.docs?.source},description:{story:"A disabled item stays focusable with `aria-disabled`, as the APG recommends, so keyboard users learn it exists; choosing it does nothing. `destructive` gives danger styling to actions such as Delete.",...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: 'Groups and separators',
  args: {
    label: 'Account'
  },
  render: args => <Menu {...args} triggerIcon={<UserIcon />}>\r
      <MenuGroup label="Signed in as Ada">\r
        <MenuItem icon={<UserIcon />}>Profile</MenuItem>\r
        <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>\r
      </MenuGroup>\r
      <MenuSeparator />\r
      <MenuGroup label="Language">\r
        <MenuItem icon={<GlobeIcon />}>English (UK)</MenuItem>\r
        <MenuItem icon={<GlobeIcon />}>Français</MenuItem>\r
      </MenuGroup>\r
      <MenuSeparator />\r
      <MenuItem>Sign out</MenuItem>\r
    </Menu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Account'
    }));
    await expect(canvas.getByRole('group', {
      name: 'Language'
    })).toBeInTheDocument();
    await expect(canvas.getAllByRole('separator')).toHaveLength(2);
  }
}`,...F.parameters?.docs?.source},description:{story:"`MenuGroup` labels a set of related items and `MenuSeparator` divides them. Groups are announced with their label, which also shows as a small heading.",...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: 'Link items',
  args: {
    label: 'Open'
  },
  render: args => <Menu {...args}>\r
      <MenuItem href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" target="_blank" rel="noreferrer">\r
        Open the APG pattern in a new tab\r
      </MenuItem>\r
      <MenuItem href="#preview">Jump to the preview</MenuItem>\r
      <MenuSeparator />\r
      <MenuItem>Copy link</MenuItem>\r
    </Menu>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Open'
    }));
    const link = canvas.getByRole('menuitem', {
      name: 'Open the APG pattern in a new tab'
    });
    await expect(link.tagName).toBe('A');
    await expect(link).toHaveAttribute('target', '_blank');
  }
}`,...I.parameters?.docs?.source},description:{story:'An item with `href` renders a real `<a role="menuitem">`, so the browser\'s own link behaviour (new tab, copy link address, status bar URL) works. Enter and Space both follow it.',...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  name: 'Items shorthand',
  args: {
    label: 'Sort',
    items: [{
      label: 'Newest first',
      onSelect: fn()
    }, {
      label: 'Oldest first',
      onSelect: fn()
    }, {
      label: 'Most replies',
      onSelect: fn(),
      shortcut: 'R'
    }, {
      label: 'Unanswered only',
      disabled: true
    }]
  }
}`,...L.parameters?.docs?.source},description:{story:"The `items` shorthand builds a flat menu from an array, like `options` on `Select`. Use children when the menu needs groups or separators.",...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: 'Inside a card',
  render: () => <Card as="article" style={{
    maxWidth: 360
  }}>\r
      <Stack direction="row" justify="space-between" align="center">\r
        <h3 style={{
        margin: 0,
        fontSize: 'var(--ds-font-size-md)'
      }}>Quarterly report</h3>\r
        <Menu label="Actions for Quarterly report" iconOnly size="sm">\r
          <MenuItem>Share</MenuItem>\r
          <MenuItem>Download PDF</MenuItem>\r
          <MenuSeparator />\r
          <MenuItem destructive>Archive</MenuItem>\r
        </Menu>\r
      </Stack>\r
      <p style={{
      marginBottom: 0
    }}>Revenue grew 12% on the previous quarter.</p>\r
    </Card>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Actions for Quarterly report'
    });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('menuitem', {
      name: 'Share'
    }));
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
}`,...R.parameters?.docs?.source},description:{story:`A "⋯" menu in a card header. Each trigger needs a unique name on the page, so it names the card it belongs to.`,...R.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: 'Inside a table row',
  render: () => <table style={{
    borderCollapse: 'collapse',
    minWidth: 420
  }}>\r
      <caption style={{
      textAlign: 'start',
      paddingBottom: 8
    }}>Invoices</caption>\r
      <thead>\r
        <tr>\r
          <th scope="col" style={{
          textAlign: 'start'
        }}>Invoice</th>\r
          <th scope="col" style={{
          textAlign: 'start'
        }}>Customer</th>\r
          <th scope="col" style={{
          textAlign: 'end'
        }}>Total</th>\r
          <th scope="col">\r
            <VisuallyHidden>Actions</VisuallyHidden>\r
          </th>\r
        </tr>\r
      </thead>\r
      <tbody>\r
        {invoices.map(invoice => <tr key={invoice.id} style={{
        borderTop: '1px solid var(--ds-color-border)'
      }}>\r
            <td>{invoice.id}</td>\r
            <td>{invoice.customer}</td>\r
            <td style={{
          textAlign: 'end'
        }}>{invoice.total}</td>\r
            <td style={{
          textAlign: 'end'
        }}>\r
              <Menu label={\`Actions for \${invoice.id}\`} iconOnly size="sm">\r
                <MenuItem>View</MenuItem>\r
                <MenuItem>Send reminder</MenuItem>\r
                <MenuItem href={\`#\${invoice.id}\`}>Open in new tab</MenuItem>\r
                <MenuSeparator />\r
                <MenuItem destructive>Void invoice</MenuItem>\r
              </Menu>\r
            </td>\r
          </tr>)}\r
      </tbody>\r
    </table>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Actions for INV-042'
    });
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(within(canvas.getByRole('menu', {
      name: 'Actions for INV-042'
    })).getByRole('menuitem', {
      name: 'Void invoice'
    })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  }
}`,...B.parameters?.docs?.source},description:{story:`One menu per table row, with the row's invoice in each trigger's name ("Actions for INV-042"). The menu opens in the top layer, so the table's overflow never clips it.`,...B.parameters?.docs?.description}}}})))()}H();export{j as Default,P as DisabledAndDestructive,F as GroupsAndSeparators,M as IconTrigger,N as IconsAndShortcuts,R as InACard,B as InATableRow,L as ItemsShorthand,I as LinkItems,V as __namedExportsOrder,D as default};