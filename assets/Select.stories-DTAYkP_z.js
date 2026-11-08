import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,t as c}from"./Badge-Rh9PSFv9.js";import{_ as l,a as u,c as d,i as f,o as p,r as m}from"./icons-C9TAZLL5.js";import{n as h,t as g}from"./Dialog-DH6YBOAp.js";import{a as _,i as v,n as y,r as b,t as x}from"./Select-CXRgdC2U.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{S=n(),l(),s(),r(),h(),a(),_(),C=t(),{expect:w,fn:T,userEvent:E,within:D}=__STORYBOOK_MODULE_TEST__,O=x,k={title:`Components/Forms/Select`,component:O,subcomponents:{SelectItem:b,SelectGroup:y,SelectSeparator:v},args:{label:`Fruit`,placeholder:`Pick a fruit`,onValueChange:T(),onOpenChange:T()},decorators:[e=>(0,C.jsx)(`div`,{style:{maxWidth:320,minHeight:360},children:(0,C.jsx)(e,{})})],parameters:{docs:{description:{component:[`A custom dropdown built on the WAI-ARIA select-only combobox pattern. Compared with Radix Select:`,``,"- **Multi-select** (`multiple`) and **search** (`searchable`) built in.",'- **Real forms**: a hidden native `<select>` carries `name`, `required` (shown inline as an error), autofill and form reset. `""` is a valid value.',"- **Top layer via the Popover API**: no portal, no z-index fights, works inside `<dialog>`; no scroll lock or `pointer-events: none` on `<body>`.","- **Focus stays on the trigger** (`aria-activedescendant`), opens on click (not pointerdown) so touch-scrolling never opens it, Escape inside a Dialog closes only the list.",`- **Typeahead** with repeated-letter cycling, Home/End, PageUp/PageDown, Tab-to-commit and Alt+↑.`].join(`
`)}}}},A=[{value:`apple`,label:`Apple`},{value:`apricot`,label:`Apricot`},{value:`banana`,label:`Banana`},{value:`blueberry`,label:`Blueberry`},{value:`cherry`,label:`Cherry`},{value:`durian`,label:`Durian`,disabled:!0},{value:`grape`,label:`Grape`},{value:`mango`,label:`Mango`}],j={args:{options:A},play:async({canvasElement:e,args:t})=>{let n=D(e).getByRole(`combobox`,{name:`Fruit`});await E.click(n),await w(n).toHaveAttribute(`aria-expanded`,`true`),await w(n).toHaveFocus(),await E.keyboard(`bb`),await E.keyboard(`{Enter}`),await w(t.onValueChange).toHaveBeenLastCalledWith(`blueberry`),await w(n).toHaveTextContent(`Blueberry`),await w(n).toHaveAttribute(`aria-expanded`,`false`)}},M={name:`Groups, separators and disabled items`,render:e=>(0,C.jsxs)(O,{...e,label:`Time zone`,placeholder:`Choose a time zone`,defaultValue:`Europe/London`,children:[(0,C.jsxs)(y,{label:`Europe`,children:[(0,C.jsx)(b,{value:`Europe/London`,children:`London (GMT+1)`}),(0,C.jsx)(b,{value:`Europe/Paris`,children:`Paris (GMT+2)`}),(0,C.jsx)(b,{value:`Europe/Kyiv`,children:`Kyiv (GMT+3)`})]}),(0,C.jsx)(v,{}),(0,C.jsxs)(y,{label:`Americas`,children:[(0,C.jsx)(b,{value:`America/New_York`,children:`New York (GMT−4)`}),(0,C.jsx)(b,{value:`America/Chicago`,disabled:!0,children:`Chicago (unavailable)`}),(0,C.jsx)(b,{value:`America/Los_Angeles`,children:`Los Angeles (GMT−7)`})]}),(0,C.jsx)(v,{}),(0,C.jsxs)(y,{label:`Asia & Pacific`,children:[(0,C.jsx)(b,{value:`Asia/Tokyo`,children:`Tokyo (GMT+9)`}),(0,C.jsx)(b,{value:`Australia/Sydney`,children:`Sydney (GMT+10)`})]})]})},N=[[`Europe`,[`Austria`,`Belgium`,`Croatia`,`Denmark`,`Estonia`,`Finland`,`France`,`Germany`,`Greece`,`Ireland`,`Italy`,`Netherlands`,`Norway`,`Poland`,`Portugal`,`Spain`,`Sweden`,`Switzerland`,`United Kingdom`]],[`Americas`,[`Argentina`,`Brazil`,`Canada`,`Chile`,`Colombia`,`Mexico`,`Peru`,`United States`]],[`Asia`,[`India`,`Indonesia`,`Japan`,`Malaysia`,`Singapore`,`South Korea`,`Thailand`,`Vietnam`]]],P={args:{label:`Country`,placeholder:`Choose a country`,searchable:!0,searchPlaceholder:`Search countries…`},render:e=>(0,C.jsx)(O,{...e,children:N.map(([e,t])=>(0,C.jsx)(y,{label:e,children:t.map(e=>(0,C.jsx)(b,{value:e.toLowerCase().replace(/\s+/g,`-`),children:e},e))},e))}),play:async({canvasElement:e,args:t})=>{let n=D(e);await E.click(n.getByRole(`button`,{name:/country/i}));let r=D(e.ownerDocument.body).getByRole(`combobox`,{name:`Country`});await w(r).toHaveFocus(),await E.type(r,`land`),await E.keyboard(`{ArrowDown}{Enter}`),await w(t.onValueChange).toHaveBeenLastCalledWith(`ireland`)}},F={play:async({canvasElement:e,args:t})=>{let n=D(e),r=n.getByRole(`combobox`,{name:`Skills`});await w(r).toHaveTextContent(`React, CSS`),await E.click(r),await w(n.getByRole(`listbox`)).toHaveAttribute(`aria-multiselectable`,`true`),await E.click(n.getByRole(`option`,{name:`Testing`})),await w(t.onValueChange).toHaveBeenLastCalledWith([`react`,`css`,`testing`]),await w(r).toHaveAttribute(`aria-expanded`,`true`),await E.keyboard(`{Escape}`),await w(r).toHaveAttribute(`aria-expanded`,`false`)},args:{label:`Skills`,placeholder:`Select skills`,multiple:!0,defaultValue:[`react`,`css`],options:[{value:`react`,label:`React`},{value:`typescript`,label:`TypeScript`},{value:`css`,label:`CSS`},{value:`a11y`,label:`Accessibility`},{value:`testing`,label:`Testing`},{value:`node`,label:`Node.js`}]}},I={name:`Multiple + searchable`,args:{label:`Invite teammates`,placeholder:`Choose people`,multiple:!0,searchable:!0,searchPlaceholder:`Search by name…`,options:[`Ada Lovelace`,`Alan Turing`,`Barbara Liskov`,`Edsger Dijkstra`,`Grace Hopper`,`Katherine Johnson`,`Linus Torvalds`,`Margaret Hamilton`,`Radia Perlman`,`Tim Berners-Lee`].map(e=>({value:e.toLowerCase().replace(/\s+/g,`.`),label:e}))}},L={name:`Custom renderValue`,args:{label:`Labels`,multiple:!0,defaultValue:[`bug`,`p1`],renderValue:e=>(0,C.jsx)(o,{direction:`row`,gap:1,wrap:!0,children:e.map(e=>(0,C.jsx)(c,{tone:e.value===`bug`?`danger`:`accent`,children:e.text},e.value))}),options:[{value:`bug`,label:`Bug`},{value:`feature`,label:`Feature`},{value:`p1`,label:`P1`},{value:`docs`,label:`Docs`}]}},R={name:`"" as a real value`,args:{label:`Discount`,defaultValue:``,hint:`Radix rejects value="". Here it is just another option.`,options:[{value:``,label:`No discount`},{value:`10`,label:`10% off`},{value:`25`,label:`25% off`}]}},z={render:()=>(0,C.jsxs)(o,{gap:5,children:[(0,C.jsx)(x,{label:`With hint`,hint:`Shown under the label.`,options:A}),(0,C.jsx)(x,{label:`With error`,error:`Choose a fruit to continue.`,required:!0,options:A}),(0,C.jsx)(x,{label:`Disabled`,disabled:!0,defaultValue:`mango`,options:A})]})},B={name:`Form: required, submit and reset`,render:function(){let[e,t]=(0,S.useState)(null);return(0,C.jsx)(`form`,{onSubmit:e=>{e.preventDefault(),t(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)),null,2))},onReset:()=>t(null),children:(0,C.jsxs)(o,{gap:4,children:[(0,C.jsx)(x,{label:`Plan`,name:`plan`,required:!0,placeholder:`Choose a plan`,options:[{value:`free`,label:`Free`},{value:`pro`,label:`Pro`},{value:`team`,label:`Team`}]}),(0,C.jsx)(x,{label:`Add-ons`,name:`addons`,multiple:!0,defaultValue:[`backup`],options:[{value:`backup`,label:`Daily backups`},{value:`sso`,label:`Single sign-on`},{value:`audit`,label:`Audit log`}]}),(0,C.jsxs)(o,{direction:`row`,gap:2,children:[(0,C.jsx)(i,{type:`submit`,children:`Submit`}),(0,C.jsx)(i,{type:`reset`,variant:`secondary`,children:`Reset`})]}),e&&(0,C.jsx)(`pre`,{style:{margin:0,fontSize:13},children:e})]})})},play:async({canvasElement:e})=>{let t=D(e);await E.click(t.getByRole(`button`,{name:`Submit`}));let n=t.getByRole(`combobox`,{name:/plan/i});await w(n).toHaveAttribute(`aria-invalid`,`true`),await w(n).toHaveFocus()}},V={play:async({canvasElement:e})=>{let t=D(e);await E.click(t.getByRole(`button`,{name:`Open dialog`}));let n=t.getByRole(`dialog`,{name:`Move task`}),r=D(n).getByRole(`combobox`,{name:`Column`});await E.click(r),await w(r).toHaveAttribute(`aria-expanded`,`true`);let i=t.getByRole(`option`,{name:`In review`}),a=i.getBoundingClientRect();await w(i.contains(e.ownerDocument.elementFromPoint(a.left+8,a.top+a.height/2))).toBe(!0),await E.keyboard(`{Escape}`),await w(r).toHaveAttribute(`aria-expanded`,`false`),await w(n).toHaveAttribute(`open`),await E.keyboard(`{Escape}`),await w(n).not.toHaveAttribute(`open`)},render:function(e){let[t,n]=(0,S.useState)(!1);return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(i,{onClick:()=>n(!0),children:`Open dialog`}),(0,C.jsx)(g,{open:t,onClose:()=>n(!1),title:`Move task`,description:`Escape closes the dropdown first, then the dialog.`,footer:(0,C.jsx)(i,{onClick:()=>n(!1),children:`Done`}),children:(0,C.jsx)(O,{...e,label:`Column`,placeholder:`Choose a column`,options:[{value:`todo`,label:`To do`},{value:`doing`,label:`In progress`},{value:`review`,label:`In review`},{value:`done`,label:`Done`}]})})]})}},H={play:async({canvasElement:e})=>{let t=D(e),n=t.getByRole(`combobox`,{name:`Status`});await E.click(n),await E.click(t.getByRole(`option`,{name:`Done`})),await w(n).toHaveTextContent(`Done`),await w(n.querySelector(`svg circle`)).toHaveAttribute(`fill`,`#22c55e`)},name:`Icons (trigger and options)`,render:e=>(0,C.jsxs)(o,{gap:5,children:[(0,C.jsx)(O,{...e,label:`Layout`,placeholder:`Choose a layout`,defaultValue:`grid`,options:[{value:`grid`,label:`Grid`,icon:(0,C.jsx)(p,{})},{value:`list`,label:`List`,icon:(0,C.jsx)(d,{})},{value:`board`,label:`Board`,icon:(0,C.jsx)(f,{})}]}),(0,C.jsxs)(O,{...e,label:`Status`,placeholder:`Set a status`,children:[(0,C.jsx)(b,{value:`todo`,icon:(0,C.jsx)(m,{color:`#9a9aa5`}),children:`To do`}),(0,C.jsx)(b,{value:`doing`,icon:(0,C.jsx)(m,{color:`#f59e0b`}),children:`In progress`}),(0,C.jsx)(b,{value:`done`,icon:(0,C.jsx)(m,{color:`#22c55e`}),children:`Done`})]}),(0,C.jsx)(O,{...e,label:`Region`,placeholder:`Choose a region`,startIcon:(0,C.jsx)(u,{}),options:[{value:`eu`,label:`Europe`},{value:`us`,label:`North America`},{value:`apac`,label:`Asia Pacific`}]})]})},U={play:async({canvasElement:e})=>{let t=D(e);await E.click(t.getByRole(`button`,{name:`Continue`}));let n=t.getByRole(`combobox`,{name:/plan/i});await w(n).toHaveAccessibleDescription(`Choose a plan to continue.`),await w(n).toHaveFocus(),await E.click(n),await E.click(t.getByRole(`option`,{name:`Pro`})),await w(n).not.toHaveAttribute(`aria-invalid`)},render:e=>(0,C.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,C.jsxs)(o,{gap:4,children:[(0,C.jsx)(O,{...e,label:`Plan`,name:`plan`,required:!0,placeholder:`Choose a plan`,validationMessages:{valueMissing:`Choose a plan to continue.`},options:[{value:`free`,label:`Free`},{value:`pro`,label:`Pro`},{value:`team`,label:`Team`}]}),(0,C.jsx)(O,{...e,label:`Skills`,name:`skills`,multiple:!0,hint:`Pick up to two.`,placeholder:`Choose skills`,validate:e=>Array.isArray(e)&&e.length>2?`Choose no more than two skills.`:null,options:[{value:`react`,label:`React`},{value:`css`,label:`CSS`},{value:`ts`,label:`TypeScript`},{value:`a11y`,label:`Accessibility`}]}),(0,C.jsx)(i,{type:`submit`,children:`Continue`})]})})},W=[`Default`,`Composed`,`Searchable`,`Multiple`,`MultipleSearchable`,`CustomValue`,`EmptyStringValue`,`States`,`InAForm`,`InsideDialog`,`WithIcons`,`Validation`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    options: fruit
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', {
      name: 'Fruit'
    });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveFocus();

    // Typeahead: "b" jumps to Banana, a second "b" cycles to Blueberry.
    await userEvent.keyboard('bb');
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('blueberry');
    await expect(trigger).toHaveTextContent('Blueberry');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
}`,...j.parameters?.docs?.source},description:{story:"A flat list from the `options` shorthand, including one disabled option. Focus stays on the trigger while the list is open (`aria-activedescendant`). Typing a letter jumps to the first match and repeating it cycles through matches; Enter selects and closes.",...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Groups, separators and disabled items',
  render: args => <StorySelect {...args} label="Time zone" placeholder="Choose a time zone" defaultValue="Europe/London">\r
      <SelectGroup label="Europe">\r
        <SelectItem value="Europe/London">London (GMT+1)</SelectItem>\r
        <SelectItem value="Europe/Paris">Paris (GMT+2)</SelectItem>\r
        <SelectItem value="Europe/Kyiv">Kyiv (GMT+3)</SelectItem>\r
      </SelectGroup>\r
      <SelectSeparator />\r
      <SelectGroup label="Americas">\r
        <SelectItem value="America/New_York">New York (GMT−4)</SelectItem>\r
        <SelectItem value="America/Chicago" disabled>Chicago (unavailable)</SelectItem>\r
        <SelectItem value="America/Los_Angeles">Los Angeles (GMT−7)</SelectItem>\r
      </SelectGroup>\r
      <SelectSeparator />\r
      <SelectGroup label="Asia & Pacific">\r
        <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>\r
        <SelectItem value="Australia/Sydney">Sydney (GMT+10)</SelectItem>\r
      </SelectGroup>\r
    </StorySelect>
}`,...M.parameters?.docs?.source},description:{story:"Options built from `SelectItem` children, with `SelectGroup` for labelled sections, `SelectSeparator` between them and a `disabled` item that keyboard navigation skips. Use children instead of `options` when the list needs structure.",...M.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    placeholder: 'Choose a country',
    searchable: true,
    searchPlaceholder: 'Search countries…'
  },
  render: args => <StorySelect {...args}>\r
      {countries.map(([region, names]) => <SelectGroup key={region} label={region}>\r
          {names.map(country => <SelectItem key={country} value={country.toLowerCase().replace(/\\s+/g, '-')}>\r
              {country}\r
            </SelectItem>)}\r
        </SelectGroup>)}\r
    </StorySelect>,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: /country/i
    }));
    const search = within(canvasElement.ownerDocument.body).getByRole('combobox', {
      name: 'Country'
    });
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'land');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    // "land" matches Finland, Ireland, Netherlands, Poland, Switzerland, Thailand; ↓ moves to the 2nd.
    await expect(args.onValueChange).toHaveBeenLastCalledWith('ireland');
  }
}`,...P.parameters?.docs?.source},description:{story:"`searchable` adds a filter field to the dropdown, for long lists. The trigger becomes a plain button and focus moves into the search field, which is the combobox; groups with no matches hide themselves, and a status message is shown when nothing matches.",...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', {
      name: 'Skills'
    });
    await expect(trigger).toHaveTextContent('React, CSS');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await userEvent.click(canvas.getByRole('option', {
      name: 'Testing'
    }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['react', 'css', 'testing']);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
  args: {
    label: 'Skills',
    placeholder: 'Select skills',
    multiple: true,
    defaultValue: ['react', 'css'],
    options: [{
      value: 'react',
      label: 'React'
    }, {
      value: 'typescript',
      label: 'TypeScript'
    }, {
      value: 'css',
      label: 'CSS'
    }, {
      value: 'a11y',
      label: 'Accessibility'
    }, {
      value: 'testing',
      label: 'Testing'
    }, {
      value: 'node',
      label: 'Node.js'
    }]
  }
}`,...F.parameters?.docs?.source},description:{story:"`multiple` lets several options be selected. The listbox is `aria-multiselectable`, the dropdown stays open while toggling options and Escape closes it; the trigger lists the selected labels, separated by commas.",...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: 'Multiple + searchable',
  args: {
    label: 'Invite teammates',
    placeholder: 'Choose people',
    multiple: true,
    searchable: true,
    searchPlaceholder: 'Search by name…',
    options: ['Ada Lovelace', 'Alan Turing', 'Barbara Liskov', 'Edsger Dijkstra', 'Grace Hopper', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton', 'Radia Perlman', 'Tim Berners-Lee'].map(name => ({
      value: name.toLowerCase().replace(/\\s+/g, '.'),
      label: name
    }))
  }
}`,...I.parameters?.docs?.source},description:{story:"`multiple` and `searchable` together, for picking several items from a long list such as people to invite.",...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  name: 'Custom renderValue',
  args: {
    label: 'Labels',
    multiple: true,
    defaultValue: ['bug', 'p1'],
    renderValue: items => <Stack direction="row" gap={1} wrap>\r
        {items.map(item => <Badge key={item.value} tone={item.value === 'bug' ? 'danger' : 'accent'}>{item.text}</Badge>)}\r
      </Stack>,
    options: [{
      value: 'bug',
      label: 'Bug'
    }, {
      value: 'feature',
      label: 'Feature'
    }, {
      value: 'p1',
      label: 'P1'
    }, {
      value: 'docs',
      label: 'Docs'
    }]
  }
}`,...L.parameters?.docs?.source},description:{story:"`renderValue` replaces the trigger’s comma-separated text with custom content, here a `Badge` for each selected label.",...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: '"" as a real value',
  args: {
    label: 'Discount',
    defaultValue: '',
    hint: 'Radix rejects value="". Here it is just another option.',
    options: [{
      value: '',
      label: 'No discount'
    }, {
      value: '10',
      label: '10% off'
    }, {
      value: '25',
      label: '25% off'
    }]
  }
}`,...R.parameters?.docs?.source},description:{story:'`""` is an ordinary value, so a “none” option can be selected and submitted like any other. Radix Select doesn’t allow this.',...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={5}>\r
      <Select label="With hint" hint="Shown under the label." options={fruit} />\r
      <Select label="With error" error="Choose a fruit to continue." required options={fruit} />\r
      <Select label="Disabled" disabled defaultValue="mango" options={fruit} />\r
    </Stack>
}`,...z.parameters?.docs?.source},description:{story:"A `hint` under the label, an `error` (linked to the trigger and marking it invalid) and a `disabled` select that keeps its value but can’t be opened.",...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: 'Form: required, submit and reset',
  render: function Render() {
    const [submitted, setSubmitted] = useState<string | null>(null);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)), null, 2));
    };
    return <form onSubmit={onSubmit} onReset={() => setSubmitted(null)}>\r
        <Stack gap={4}>\r
          <Select label="Plan" name="plan" required placeholder="Choose a plan" options={[{
          value: 'free',
          label: 'Free'
        }, {
          value: 'pro',
          label: 'Pro'
        }, {
          value: 'team',
          label: 'Team'
        }]} />\r
          <Select label="Add-ons" name="addons" multiple defaultValue={['backup']} options={[{
          value: 'backup',
          label: 'Daily backups'
        }, {
          value: 'sso',
          label: 'Single sign-on'
        }, {
          value: 'audit',
          label: 'Audit log'
        }]} />\r
          <Stack direction="row" gap={2}>\r
            <Button type="submit">Submit</Button>\r
            <Button type="reset" variant="secondary">Reset</Button>\r
          </Stack>\r
          {submitted && <pre style={{
          margin: 0,
          fontSize: 13
        }}>{submitted}</pre>}\r
        </Stack>\r
      </form>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Submit'
    }));
    const plan = canvas.getByRole('combobox', {
      name: /plan/i
    });
    await expect(plan).toHaveAttribute('aria-invalid', 'true');
    await expect(plan).toHaveFocus();
  }
}`,...B.parameters?.docs?.source},description:{story:"Inside a real `<form>`. A hidden native `<select>` carries each `name`, so the values appear in `FormData`; `required` blocks the submit, marks the trigger invalid and focuses it, and Reset restores the defaults.",...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Open dialog'
    }));
    const dialog = canvas.getByRole('dialog', {
      name: 'Move task'
    });
    const column = within(dialog).getByRole('combobox', {
      name: 'Column'
    });
    await userEvent.click(column);
    await expect(column).toHaveAttribute('aria-expanded', 'true');
    // The list renders in the top layer above the dialog: its options are hit-testable.
    const option = canvas.getByRole('option', {
      name: 'In review'
    });
    const box = option.getBoundingClientRect();
    await expect(option.contains(canvasElement.ownerDocument.elementFromPoint(box.left + 8, box.top + box.height / 2))).toBe(true);
    // First Escape closes only the list, the second closes the dialog.
    await userEvent.keyboard('{Escape}');
    await expect(column).toHaveAttribute('aria-expanded', 'false');
    await expect(dialog).toHaveAttribute('open');
    await userEvent.keyboard('{Escape}');
    await expect(dialog).not.toHaveAttribute('open');
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return <>\r
        <Button onClick={() => setOpen(true)}>Open dialog</Button>\r
        <Dialog open={open} onClose={() => setOpen(false)} title="Move task" description="Escape closes the dropdown first, then the dialog." footer={<Button onClick={() => setOpen(false)}>Done</Button>}>\r
          <StorySelect {...args} label="Column" placeholder="Choose a column" options={[{
          value: 'todo',
          label: 'To do'
        }, {
          value: 'doing',
          label: 'In progress'
        }, {
          value: 'review',
          label: 'In review'
        }, {
          value: 'done',
          label: 'Done'
        }]} />\r
        </Dialog>\r
      </>;
  }
}`,...V.parameters?.docs?.source},description:{story:"A select inside a `Dialog`. The list opens in the top layer through the Popover API, so it sits above the dialog with no portal or z-index. The first Escape closes only the list and the second closes the dialog.",...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('combobox', {
      name: 'Status'
    });
    await userEvent.click(status);
    await userEvent.click(canvas.getByRole('option', {
      name: 'Done'
    }));
    await expect(status).toHaveTextContent('Done');
    await expect(status.querySelector('svg circle')).toHaveAttribute('fill', '#22c55e');
  },
  name: 'Icons (trigger and options)',
  render: args => <Stack gap={5}>\r
      <StorySelect {...args} label="Layout" placeholder="Choose a layout" defaultValue="grid" options={[{
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
    }]} />\r
      <StorySelect {...args} label="Status" placeholder="Set a status">\r
        <SelectItem value="todo" icon={<CircleIcon color="#9a9aa5" />}>To do</SelectItem>\r
        <SelectItem value="doing" icon={<CircleIcon color="#f59e0b" />}>In progress</SelectItem>\r
        <SelectItem value="done" icon={<CircleIcon color="#22c55e" />}>Done</SelectItem>\r
      </StorySelect>\r
      <StorySelect {...args} label="Region" placeholder="Choose a region" startIcon={<GlobeIcon />} options={[{
      value: 'eu',
      label: 'Europe'
    }, {
      value: 'us',
      label: 'North America'
    }, {
      value: 'apac',
      label: 'Asia Pacific'
    }]} />\r
    </Stack>
}`,...H.parameters?.docs?.source},description:{story:"Decorative icons on options, which also appear in the trigger when that option is selected, and a `startIcon` on the trigger for selects whose options have none.",...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Continue'
    }));
    const plan = canvas.getByRole('combobox', {
      name: /plan/i
    });
    await expect(plan).toHaveAccessibleDescription('Choose a plan to continue.');
    await expect(plan).toHaveFocus();
    await userEvent.click(plan);
    await userEvent.click(canvas.getByRole('option', {
      name: 'Pro'
    }));
    await expect(plan).not.toHaveAttribute('aria-invalid');
  },
  render: args => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={4}>\r
        <StorySelect {...args} label="Plan" name="plan" required placeholder="Choose a plan" validationMessages={{
        valueMissing: 'Choose a plan to continue.'
      }} options={[{
        value: 'free',
        label: 'Free'
      }, {
        value: 'pro',
        label: 'Pro'
      }, {
        value: 'team',
        label: 'Team'
      }]} />\r
        <StorySelect {...args} label="Skills" name="skills" multiple hint="Pick up to two." placeholder="Choose skills" validate={value => Array.isArray(value) && value.length > 2 ? 'Choose no more than two skills.' : null} options={[{
        value: 'react',
        label: 'React'
      }, {
        value: 'css',
        label: 'CSS'
      }, {
        value: 'ts',
        label: 'TypeScript'
      }, {
        value: 'a11y',
        label: 'Accessibility'
      }]} />\r
        <Button type="submit">Continue</Button>\r
      </Stack>\r
    </form>
}`,...U.parameters?.docs?.source},description:{story:"Validation in a form. Submitting without a plan shows its `valueMissing` message as the trigger’s description and focuses it. The skills select uses a `validate` rule that rejects more than two choices.",...U.parameters?.docs?.description}}}})))()}G();export{M as Composed,L as CustomValue,j as Default,R as EmptyStringValue,B as InAForm,V as InsideDialog,F as Multiple,I as MultipleSearchable,P as Searchable,z as States,U as Validation,H as WithIcons,W as __namedExportsOrder,k as default};