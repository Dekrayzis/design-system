import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,r as c,t as l}from"./Checkbox-8TrzcQ2V.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{u=n(),r(),a(),c(),d=t(),{expect:f,fn:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g={title:`Components/Forms/Checkbox`,component:l,subcomponents:{CheckboxGroup:s},args:{label:`Email me about product updates`,onCheckedChange:p()},argTypes:{checked:{control:`inline-radio`,options:[void 0,!0,!1,`indeterminate`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:'Radix-style API (`checked: boolean | "indeterminate"`, `onCheckedChange`) on a real `<input type="checkbox">`, so it submits, validates, autofills and resets with its form natively.'}}}},_={play:async({canvasElement:e,args:t})=>{let n=h(e).getByRole(`checkbox`,{name:`Email me about product updates`});await m.click(h(e).getByText(`Email me about product updates`)),await f(n).toBeChecked(),await f(t.onCheckedChange).toHaveBeenLastCalledWith(!0),await m.keyboard(` `),await f(n).not.toBeChecked()}},v={args:{hint:`About one email a month. Unsubscribe any time.`}},y={play:async({canvasElement:e})=>{let t=h(e);for(let n of[`Checked`,`Disabled and checked`]){let r=t.getByRole(`checkbox`,{name:n}).nextElementSibling;r.style.pointerEvents=`auto`;let i=r.getBoundingClientRect(),a=e.ownerDocument.elementFromPoint(i.left+i.width/2,i.top+i.height/2);r.style.pointerEvents=``,await f(r.contains(a)).toBe(!0)}await f(t.getByRole(`checkbox`,{name:`Indeterminate`})).toBePartiallyChecked()},render:()=>(0,d.jsxs)(o,{gap:3,children:[(0,d.jsx)(l,{label:`Unchecked`}),(0,d.jsx)(l,{label:`Checked`,defaultChecked:!0}),(0,d.jsx)(l,{label:`Indeterminate`,defaultChecked:`indeterminate`}),(0,d.jsx)(l,{label:`Disabled`,disabled:!0}),(0,d.jsx)(l,{label:`Disabled and checked`,disabled:!0,defaultChecked:!0})]})},b={render:()=>(0,d.jsx)(o,{gap:4,children:[`sm`,`md`,`lg`].map(e=>(0,d.jsxs)(o,{direction:`row`,gap:6,wrap:!0,children:[(0,d.jsx)(l,{size:e,label:`${e.toUpperCase()} unchecked`}),(0,d.jsx)(l,{size:e,label:`${e.toUpperCase()} checked`,defaultChecked:!0}),(0,d.jsx)(l,{size:e,label:`${e.toUpperCase()} mixed`,defaultChecked:`indeterminate`}),(0,d.jsx)(l,{size:e,label:`${e.toUpperCase()} with hint`,hint:`Supporting text scales too`,defaultChecked:!0})]},e))})},x={name:`Group size (with an override)`,render:()=>(0,d.jsxs)(s,{legend:`Compact list`,size:`sm`,defaultValue:[`b`],children:[(0,d.jsx)(l,{value:`a`,label:`Inherits sm from the group`}),(0,d.jsx)(l,{value:`b`,label:`Also sm`}),(0,d.jsx)(l,{value:`c`,label:`Overrides to lg`,size:`lg`})]})},S={args:{label:`I accept the terms of service`,required:!0,error:`You need to accept the terms to continue.`}},C=[`Mushrooms`,`Peppers`,`Olives`],w={play:async({canvasElement:e})=>{let t=h(e),n=t.getByRole(`checkbox`,{name:`All toppings`});await f(n).toBePartiallyChecked(),await m.click(n);for(let e of[`Mushrooms`,`Peppers`,`Olives`])await f(t.getByRole(`checkbox`,{name:e})).toBeChecked();await m.click(t.getByRole(`checkbox`,{name:`Olives`})),await f(n).toBePartiallyChecked(),await m.click(n),await f(n).toBeChecked()},name:`Indeterminate "select all"`,render:function(){let[e,t]=(0,u.useState)([`Peppers`]),n=e.length===C.length||e.length>0&&`indeterminate`;return(0,d.jsxs)(o,{gap:2,children:[(0,d.jsx)(l,{label:`All toppings`,checked:n,onCheckedChange:e=>t(e?C:[])}),(0,d.jsx)(s,{legend:`Toppings`,value:e,onValueChange:t,children:C.map(e=>(0,d.jsx)(l,{value:e,label:e},e))})]})}},T={name:`CheckboxGroup`,render:()=>(0,d.jsxs)(s,{legend:`Notify me about`,name:`notifications`,defaultValue:[`mentions`],hint:`You can change this any time in settings.`,onValueChange:p(),children:[(0,d.jsx)(l,{value:`mentions`,label:`Mentions`,hint:`When someone @mentions you`}),(0,d.jsx)(l,{value:`replies`,label:`Replies`}),(0,d.jsx)(l,{value:`digest`,label:`Weekly digest`}),(0,d.jsx)(l,{value:`marketing`,label:`Product news`,disabled:!0})]})},E={render:()=>(0,d.jsx)(s,{legend:`Days`,orientation:`horizontal`,error:`Pick at least one day.`,children:[`Mon`,`Tue`,`Wed`,`Thu`,`Fri`].map(e=>(0,d.jsx)(l,{value:e.toLowerCase(),label:e},e))})},D={play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:`Continue`})),await f(t.getByText(`Select at least one option.`)).toBeVisible(),await f(t.getByRole(`checkbox`,{name:`Design`})).toHaveFocus(),await f(t.getByRole(`checkbox`,{name:/accept the terms/})).toHaveAccessibleDescription(`You need to accept the terms to continue.`),await m.click(t.getByRole(`checkbox`,{name:`Design`})),await f(t.queryByText(`Select at least one option.`)).not.toBeInTheDocument()},render:()=>(0,d.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,d.jsxs)(o,{gap:5,children:[(0,d.jsxs)(s,{legend:`Interests`,name:`interests`,required:!0,validate:e=>e.length>2?`Choose no more than two.`:null,hint:`Choose one or two.`,children:[(0,d.jsx)(l,{value:`design`,label:`Design`}),(0,d.jsx)(l,{value:`code`,label:`Code`}),(0,d.jsx)(l,{value:`writing`,label:`Writing`})]}),(0,d.jsx)(l,{name:`terms`,label:`I accept the terms of service`,required:!0,validationMessages:{valueMissing:`You need to accept the terms to continue.`}}),(0,d.jsx)(`div`,{children:(0,d.jsx)(i,{type:`submit`,children:`Continue`})})]})})},O=[`Default`,`WithHint`,`States`,`Sizes`,`GroupSize`,`WithError`,`SelectAll`,`Group`,`HorizontalGroupWithError`,`Validation`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Email me about product updates'
    });
    await userEvent.click(within(canvasElement).getByText('Email me about product updates'));
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(' ');
    await expect(checkbox).not.toBeChecked();
  }
}`,..._.parameters?.docs?.source},description:{story:"A single uncontrolled checkbox. Clicking the label or pressing Space toggles it, and\r\n`onCheckedChange` receives the new boolean.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'About one email a month. Unsubscribe any time.'
  }
}`,...v.parameters?.docs?.source},description:{story:"`hint` adds supporting text under the label, linked to the input with `aria-describedby`.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // The tick must be painted on top of the box (it once wasn't: disabled opacity and a Card's
    // z-index both buried it). The tick ignores pointer events, so enable them briefly to ask the
    // browser which element is topmost at its centre.
    for (const name of ['Checked', 'Disabled and checked']) {
      const tick = canvas.getByRole('checkbox', {
        name
      }).nextElementSibling as SVGElement;
      tick.style.pointerEvents = 'auto';
      const box = tick.getBoundingClientRect();
      const hit = canvasElement.ownerDocument.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      tick.style.pointerEvents = '';
      await expect(tick.contains(hit)).toBe(true);
    }
    await expect(canvas.getByRole('checkbox', {
      name: 'Indeterminate'
    })).toBePartiallyChecked();
  },
  render: () => <Stack gap={3}>\r
      <Checkbox label="Unchecked" />\r
      <Checkbox label="Checked" defaultChecked />\r
      <Checkbox label="Indeterminate" defaultChecked="indeterminate" />\r
      <Checkbox label="Disabled" disabled />\r
      <Checkbox label="Disabled and checked" disabled defaultChecked />\r
    </Stack>
}`,...y.parameters?.docs?.source},description:{story:`Unchecked, checked, indeterminate, disabled, and disabled and checked. The indeterminate state is\r
set through the input’s DOM \`indeterminate\` property, so assistive technology reports it as\r
mixed.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={4}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Stack key={size} direction="row" gap={6} wrap>\r
          <Checkbox size={size} label={\`\${size.toUpperCase()} unchecked\`} />\r
          <Checkbox size={size} label={\`\${size.toUpperCase()} checked\`} defaultChecked />\r
          <Checkbox size={size} label={\`\${size.toUpperCase()} mixed\`} defaultChecked="indeterminate" />\r
          <Checkbox size={size} label={\`\${size.toUpperCase()} with hint\`} hint="Supporting text scales too" defaultChecked />\r
        </Stack>)}\r
    </Stack>
}`,...b.parameters?.docs?.source},description:{story:"`sm`, `md` and `lg` scale the box, its mark, the label, the hint and the spacing together.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Group size (with an override)',
  render: () => <CheckboxGroup legend="Compact list" size="sm" defaultValue={['b']}>\r
      <Checkbox value="a" label="Inherits sm from the group" />\r
      <Checkbox value="b" label="Also sm" />\r
      <Checkbox value="c" label="Overrides to lg" size="lg" />\r
    </CheckboxGroup>
}`,...x.parameters?.docs?.source},description:{story:"A `CheckboxGroup`’s `size` applies to every checkbox inside it, and a checkbox’s own `size`\r\noverrides it.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'I accept the terms of service',
    required: true,
    error: 'You need to accept the terms to continue.'
  }
}`,...S.parameters?.docs?.source},description:{story:"`error` shows a message under the label, links it with `aria-describedby` and sets\r\n`aria-invalid`. Here it marks a required consent box.",...S.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole('checkbox', {
      name: 'All toppings'
    });
    await expect(all).toBePartiallyChecked();
    await userEvent.click(all);
    for (const name of ['Mushrooms', 'Peppers', 'Olives']) await expect(canvas.getByRole('checkbox', {
      name
    })).toBeChecked();
    await userEvent.click(canvas.getByRole('checkbox', {
      name: 'Olives'
    }));
    await expect(all).toBePartiallyChecked();
    await userEvent.click(all);
    await expect(all).toBeChecked();
  },
  name: 'Indeterminate "select all"',
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['Peppers']);
    const allState: CheckedState = selected.length === toppings.length ? true : selected.length > 0 ? 'indeterminate' : false;
    return <Stack gap={2}>\r
        <Checkbox label="All toppings" checked={allState} onCheckedChange={checked => setSelected(checked ? toppings : [])} />\r
        <CheckboxGroup legend="Toppings" value={selected} onValueChange={setSelected}>\r
          {toppings.map(t => <Checkbox key={t} value={t} label={t} />)}\r
        </CheckboxGroup>\r
      </Stack>;
  }
}`,...w.parameters?.docs?.source},description:{story:"A parent checkbox that reflects a group: indeterminate when some toppings are chosen, checked\r\nwhen all are. Clicking it while indeterminate reports `true` and selects everything.",...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'CheckboxGroup',
  render: () => <CheckboxGroup legend="Notify me about" name="notifications" defaultValue={['mentions']} hint="You can change this any time in settings." onValueChange={fn()}>\r
      <Checkbox value="mentions" label="Mentions" hint="When someone @mentions you" />\r
      <Checkbox value="replies" label="Replies" />\r
      <Checkbox value="digest" label="Weekly digest" />\r
      <Checkbox value="marketing" label="Product news" disabled />\r
    </CheckboxGroup>
}`,...T.parameters?.docs?.source},description:{story:"`CheckboxGroup` renders a `<fieldset>` with the `legend` and shares one array value across its\r\ncheckboxes. With `name`, each checked box submits its `value` with the form; a `disabled`\r\ncheckbox can’t be toggled.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <CheckboxGroup legend="Days" orientation="horizontal" error="Pick at least one day.">\r
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => <Checkbox key={day} value={day.toLowerCase()} label={day} />)}\r
    </CheckboxGroup>
}`,...E.parameters?.docs?.source},description:{story:'`orientation="horizontal"` lays the options out in a row. The group’s `error` is shown once under\r\nthe fieldset, and every checkbox is marked invalid and described by it.',...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Continue'
    }));
    await expect(canvas.getByText('Select at least one option.')).toBeVisible();
    await expect(canvas.getByRole('checkbox', {
      name: 'Design'
    })).toHaveFocus();
    await expect(canvas.getByRole('checkbox', {
      name: /accept the terms/
    })).toHaveAccessibleDescription('You need to accept the terms to continue.');
    await userEvent.click(canvas.getByRole('checkbox', {
      name: 'Design'
    }));
    await expect(canvas.queryByText('Select at least one option.')).not.toBeInTheDocument();
  },
  render: () => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={5}>\r
        <CheckboxGroup legend="Interests" name="interests" required validate={value => value.length > 2 ? 'Choose no more than two.' : null} hint="Choose one or two.">\r
          <Checkbox value="design" label="Design" />\r
          <Checkbox value="code" label="Code" />\r
          <Checkbox value="writing" label="Writing" />\r
        </CheckboxGroup>\r
        <Checkbox name="terms" label="I accept the terms of service" required validationMessages={{
        valueMissing: 'You need to accept the terms to continue.'
      }} />\r
        <div>\r
          <Button type="submit">Continue</Button>\r
        </div>\r
      </Stack>\r
    </form>
}`,...D.parameters?.docs?.source},description:{story:`Validation inside a real form. Submitting with nothing chosen shows the group’s ‘Select at least\r
one option.’ message and focuses the first checkbox, and \`validationMessages\` replaces the\r
browser’s wording for the terms box. Choosing an option clears the group error.`,...D.parameters?.docs?.description}}}})))()}k();export{_ as Default,T as Group,x as GroupSize,E as HorizontalGroupWithError,w as SelectAll,b as Sizes,y as States,D as Validation,S as WithError,v as WithHint,O as __namedExportsOrder,g as default};