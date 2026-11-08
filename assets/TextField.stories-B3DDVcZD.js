import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{_ as s,g as c,l,n as u,p as d,u as f}from"./icons-C9TAZLL5.js";import{n as p,t as m}from"./TextField-Cpptxuig.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{h=n(),s(),r(),a(),p(),g=t(),{expect:_,userEvent:v,within:y}=__STORYBOOK_MODULE_TEST__,b={title:`Components/Forms/TextField`,component:m,args:{label:`Email address`,type:`email`,autoComplete:`email`,placeholder:`you@example.com`},argTypes:{type:{control:`select`,options:[`text`,`email`,`password`,`search`,`tel`,`url`,`number`,`date`]},validateOn:{control:`inline-radio`,options:[`blur`,`change`,`submit`]},startIcon:{control:!1},endIcon:{control:!1}},decorators:[e=>(0,g.jsx)(`div`,{style:{maxWidth:360},children:(0,g.jsx)(e,{})})],parameters:{docs:{description:{component:"Single-line text input that renders a native `<input>` with a `<label>`, an optional hint, decorative icons and inline errors from native constraints or a custom `validate` rule. Set `type` and `autoComplete` so browsers offer the right keyboard and autofill. Use `TextArea` for text that may run to several lines."}}}},x={},S={args:{hint:`We'll only use this to send receipts.`}},C={args:{defaultValue:`not-an-email`,error:`Enter an email address like name@example.com.`}},w={args:{required:!0}},T={args:{disabled:!0,defaultValue:`locked@example.com`}},E={render:()=>(0,g.jsxs)(o,{gap:4,children:[(0,g.jsx)(m,{label:`Email`,type:`email`,placeholder:`you@example.com`,startIcon:(0,g.jsx)(f,{})}),(0,g.jsx)(m,{label:`Username`,defaultValue:`vince`,startIcon:(0,g.jsx)(c,{}),endIcon:(0,g.jsx)(u,{})}),(0,g.jsx)(m,{label:`Password`,type:`password`,startIcon:(0,g.jsx)(l,{})}),(0,g.jsx)(m,{label:`Disabled`,disabled:!0,defaultValue:`Read only`,startIcon:(0,g.jsx)(l,{})})]})},D={args:{label:`Search projects`,hideLabel:!0,type:`search`,placeholder:`Search projects`,autoComplete:`off`,startIcon:(0,g.jsx)(d,{})}},O={name:`Validation (native constraints)`,render:function(){let[e,t]=(0,h.useState)(!1);return(0,g.jsx)(`form`,{onSubmit:e=>{e.preventDefault(),t(!0)},children:(0,g.jsxs)(o,{gap:4,children:[(0,g.jsx)(m,{label:`Full name`,name:`name`,required:!0,autoComplete:`name`,validationMessages:{valueMissing:`Enter your name.`}}),(0,g.jsx)(m,{label:`Email`,name:`email`,type:`email`,required:!0,startIcon:(0,g.jsx)(f,{}),autoComplete:`email`}),(0,g.jsx)(m,{label:`Username`,name:`username`,required:!0,minLength:3,pattern:`[a-z0-9_]+`,hint:`Lowercase letters, numbers and underscores.`,validationMessages:{patternMismatch:`Use lowercase letters, numbers and underscores only.`}}),(0,g.jsx)(m,{label:`Age`,name:`age`,type:`number`,min:13,max:120}),(0,g.jsx)(i,{type:`submit`,children:`Create account`}),e&&(0,g.jsx)(`p`,{style:{margin:0},children:`Submitted ✓`})]})})},play:async({canvasElement:e})=>{let t=y(e);await v.click(t.getByRole(`button`,{name:`Create account`}));let n=t.getByRole(`textbox`,{name:/full name/i});await _(n).toHaveAccessibleDescription(`Enter your name.`),await _(n).toHaveFocus()}},k={play:async({canvasElement:e})=>{let[t,n]=y(e).getAllByLabelText(/password/i);await v.type(t,`secret123`),await v.type(n,`secret12`),await v.tab(),await _(n).toHaveAccessibleDescription(`Passwords don’t match.`),await v.type(n,`3`),await _(n).not.toHaveAttribute(`aria-invalid`)},name:`Validation (custom rule, cross-field)`,render:function(){let[e,t]=(0,h.useState)(``);return(0,g.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,g.jsxs)(o,{gap:4,children:[(0,g.jsx)(m,{label:`Password`,type:`password`,required:!0,minLength:8,startIcon:(0,g.jsx)(l,{}),value:e,onChange:e=>t(e.target.value),validate:e=>/\d/.test(e)?null:`Include at least one number.`}),(0,g.jsx)(m,{label:`Confirm password`,type:`password`,required:!0,startIcon:(0,g.jsx)(l,{}),validate:t=>t===e?null:`Passwords don’t match.`}),(0,g.jsx)(i,{type:`submit`,children:`Save`})]})})}},A={play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:`Promo code`});await v.type(t,`abc`),await _(t).toHaveAccessibleDescription(`Use the format ABC-123.`),await v.clear(t),await v.type(t,`ABC-123`),await _(t).not.toHaveAttribute(`aria-invalid`)},args:{label:`Promo code`,type:`text`,placeholder:`ABC-123`,autoComplete:`off`,pattern:`[A-Z]{3}-\\d{3}`,validateOn:`change`,validationMessages:{patternMismatch:`Use the format ABC-123.`}}},j=[`Default`,`WithHint`,`WithError`,`Required`,`Disabled`,`WithIcons`,`Search`,`Validation`,`CustomRule`,`ValidateOnChange`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{}`,...x.parameters?.docs?.source},description:{story:'An email field with a visible `<label>`, `type="email"` and `autoComplete="email"`, so browsers\r\ncan offer the right keyboard and autofill. The placeholder only shows the format; it never\r\nreplaces the label.',...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    hint: "We'll only use this to send receipts."
  }
}`,...S.parameters?.docs?.source},description:{story:"A `hint` under the label, linked to the input with `aria-describedby` so screen readers read it\r\nafter the label.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'not-an-email',
    error: 'Enter an email address like name@example.com.'
  }
}`,...C.parameters?.docs?.source},description:{story:"An explicit `error` prop: the message is linked with `aria-describedby` and the input gets\r\n`aria-invalid`. The prop always wins over built-in validation, so use it for errors from the\r\nserver.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  }
}`,...w.parameters?.docs?.source},description:{story:"`required` adds an asterisk to the label that is hidden from screen readers, which hear the\r\nnative required state instead. Leaving the field empty then shows an error on blur.",...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'locked@example.com'
  }
}`,...T.parameters?.docs?.source},description:{story:"A `disabled` input keeps its value visible but can’t be focused or edited, and isn’t submitted\r\nwith the form.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={4}>\r
      <TextField label="Email" type="email" placeholder="you@example.com" startIcon={<MailIcon />} />\r
      <TextField label="Username" defaultValue="vince" startIcon={<UserIcon />} endIcon={<CheckCircleIcon />} />\r
      <TextField label="Password" type="password" startIcon={<LockIcon />} />\r
      <TextField label="Disabled" disabled defaultValue="Read only" startIcon={<LockIcon />} />\r
    </Stack>
}`,...E.parameters?.docs?.source},description:{story:"Decorative `startIcon` and `endIcon` inside the field. They are `aria-hidden`, so never rely on\r\nan icon alone to convey meaning, such as a valid username.",...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Search projects',
    hideLabel: true,
    type: 'search',
    placeholder: 'Search projects',
    autoComplete: 'off',
    startIcon: <SearchIcon />
  }
}`,...D.parameters?.docs?.source},description:{story:`A search field with \`hideLabel\`: the label is visually hidden but still names the input for\r
screen readers, and the search icon stands in for it visually. Only hide the label when the\r
context makes the field’s purpose obvious.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Validation (native constraints)',
  render: function Render() {
    const [sent, setSent] = useState(false);
    return <form onSubmit={event => {
      event.preventDefault();
      setSent(true);
    }}>\r
        <Stack gap={4}>\r
          <TextField label="Full name" name="name" required autoComplete="name" validationMessages={{
          valueMissing: 'Enter your name.'
        }} />\r
          <TextField label="Email" name="email" type="email" required startIcon={<MailIcon />} autoComplete="email" />\r
          <TextField label="Username" name="username" required minLength={3} pattern="[a-z0-9_]+" hint="Lowercase letters, numbers and underscores." validationMessages={{
          patternMismatch: 'Use lowercase letters, numbers and underscores only.'
        }} />\r
          <TextField label="Age" name="age" type="number" min={13} max={120} />\r
          <Button type="submit">Create account</Button>\r
          {sent && <p style={{
          margin: 0
        }}>Submitted ✓</p>}\r
        </Stack>\r
      </form>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create account'
    }));
    const name = canvas.getByRole('textbox', {
      name: /full name/i
    });
    await expect(name).toHaveAccessibleDescription('Enter your name.');
    await expect(name).toHaveFocus();
  }
}`,...O.parameters?.docs?.source},description:{story:'Native attributes (`required`, `type="email"`, `minLength`, `pattern`, `min` and `max`) drive\r\nvalidation. Errors appear when you leave a field, then update as you type so they clear the\r\nmoment the value is fixed. Submitting shows every error and focuses the first invalid field.',...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const [password, confirm] = canvas.getAllByLabelText(/password/i) as HTMLInputElement[];
    await userEvent.type(password!, 'secret123');
    await userEvent.type(confirm!, 'secret12');
    await userEvent.tab();
    await expect(confirm).toHaveAccessibleDescription('Passwords don’t match.');
    await userEvent.type(confirm!, '3');
    await expect(confirm).not.toHaveAttribute('aria-invalid');
  },
  name: 'Validation (custom rule, cross-field)',
  render: function Render() {
    const [password, setPassword] = useState('');
    return <form onSubmit={event => event.preventDefault()}>\r
        <Stack gap={4}>\r
          <TextField label="Password" type="password" required minLength={8} startIcon={<LockIcon />} value={password} onChange={event => setPassword(event.target.value)} validate={value => /\\d/.test(value) ? null : 'Include at least one number.'} />\r
          <TextField label="Confirm password" type="password" required startIcon={<LockIcon />} validate={value => value === password ? null : 'Passwords don’t match.'} />\r
          <Button type="submit">Save</Button>\r
        </Stack>\r
      </form>;
  }
}`,...k.parameters?.docs?.source},description:{story:`Custom \`validate\` rules alongside native constraints. The confirm field compares its value with\r
the password held in state, so the cross-field error appears on blur and clears as soon as the\r
values match.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Promo code'
    });
    await userEvent.type(input, 'abc');
    await expect(input).toHaveAccessibleDescription('Use the format ABC-123.');
    await userEvent.clear(input);
    await userEvent.type(input, 'ABC-123');
    await expect(input).not.toHaveAttribute('aria-invalid');
  },
  args: {
    label: 'Promo code',
    type: 'text',
    placeholder: 'ABC-123',
    autoComplete: 'off',
    pattern: '[A-Z]{3}-\\\\d{3}',
    validateOn: 'change',
    validationMessages: {
      patternMismatch: 'Use the format ABC-123.'
    }
  }
}`,...A.parameters?.docs?.source},description:{story:`With \`validateOn="change"\` the error appears while typing rather than on blur. Keep this for\r
short, strictly formatted values such as codes, where instant feedback helps more than it\r
interrupts.`,...A.parameters?.docs?.description}}}})))()}M();export{k as CustomRule,x as Default,T as Disabled,w as Required,D as Search,A as ValidateOnChange,O as Validation,C as WithError,S as WithHint,E as WithIcons,j as __namedExportsOrder,b as default};