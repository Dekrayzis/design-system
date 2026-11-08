import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{_ as o,d as s}from"./icons-C9TAZLL5.js";import{n as c,t as l}from"./TextArea-BV4EYpls.js";var u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{o(),n(),i(),c(),u=t(),{expect:d,userEvent:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Forms/TextArea`,component:l,args:{label:`Feedback`,hint:`Tell us what worked and what didn’t.`},argTypes:{validateOn:{control:`inline-radio`,options:[`blur`,`change`,`submit`]},startIcon:{control:!1},endIcon:{control:!1}},parameters:{docs:{description:{component:"Multi-line text input that renders a native `<textarea>` with a `<label>`, an optional hint, decorative icons, built-in validation and an optional character count. Use it for free text that may run to several lines; use `TextField` for short, single-line values."}}},decorators:[e=>(0,u.jsx)(`div`,{style:{maxWidth:480},children:(0,u.jsx)(e,{})})]},h={},g={args:{label:`Message`,hint:void 0,placeholder:`Write a message…`,startIcon:(0,u.jsx)(s,{})}},_={args:{error:`Feedback must be at least 20 characters.`,defaultValue:`Too short`}},v={args:{disabled:!0,defaultValue:`Submitted on 3 October.`}},y={name:`Character count (showCount)`,args:{label:`The brief`,hint:`What are you making, and who is it for?`,rows:6,showCount:!0,minLength:40,maxLength:500,countStatus:{empty:`Over to you`,short:`Keep going`,good:`Good to send`,near:`Nearly full`,full:`Limit reached`}},play:async({canvasElement:e})=>{let t=p(e),n=t.getByRole(`textbox`,{name:`The brief`});await d(n).toHaveAccessibleDescription(/Up to 500 characters\./),await f.type(n,`A small puzzle game for the web.`),await d(t.getByText(`Keep going`)).toBeVisible(),await d(t.getByText(`32 / 500`)).toBeVisible(),await f.type(n,` Two levels.`),await d(t.getByText(`Good to send`)).toBeVisible()}},b={play:async({canvasElement:e})=>{let t=p(e);await f.click(t.getByRole(`button`,{name:`Send report`}));let n=t.getByRole(`textbox`,{name:/bug report/i});await d(n).toHaveFocus(),await d(n).toHaveAccessibleDescription(/Describe the bug\./),await f.type(n,`It crashes when I open http://example.com in the viewer.`),await f.tab(),await d(n).toHaveAccessibleDescription(/Remove links/)},render:()=>(0,u.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,u.jsxs)(a,{gap:4,children:[(0,u.jsx)(l,{label:`Bug report`,name:`report`,required:!0,minLength:20,maxLength:500,startIcon:(0,u.jsx)(s,{}),hint:`At least 20 characters.`,validationMessages:{valueMissing:`Describe the bug.`},validate:e=>/https?:\/\//.test(e)?`Remove links; attach screenshots instead.`:null}),(0,u.jsx)(r,{type:`submit`,children:`Send report`})]})})},x=[`Default`,`WithIcon`,`WithError`,`Disabled`,`CharacterCount`,`Validation`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:"A labelled `<textarea>` with a `hint` linked through `aria-describedby`. It shows four rows by\r\ndefault; set `rows` to change that.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Message',
    hint: undefined,
    placeholder: 'Write a message…',
    startIcon: <MessageIcon />
  }
}`,...g.parameters?.docs?.source},description:{story:"A decorative `startIcon` pinned to the first line. Icons are `aria-hidden`, so the label still\r\nhas to say what the field is for.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Feedback must be at least 20 characters.',
    defaultValue: 'Too short'
  }
}`,..._.parameters?.docs?.source},description:{story:"An explicit `error` prop: the message is linked with `aria-describedby` and the field gets\r\n`aria-invalid`. The prop always wins over built-in validation, so use it for errors from the\r\nserver.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'Submitted on 3 October.'
  }
}`,...v.parameters?.docs?.source},description:{story:"A `disabled` field keeps its value visible but can’t be focused or edited, and isn’t submitted\r\nwith the form.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Character count (showCount)',
  args: {
    label: 'The brief',
    hint: 'What are you making, and who is it for?',
    rows: 6,
    showCount: true,
    minLength: 40,
    maxLength: 500,
    countStatus: {
      empty: 'Over to you',
      short: 'Keep going',
      good: 'Good to send',
      near: 'Nearly full',
      full: 'Limit reached'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const brief = canvas.getByRole('textbox', {
      name: 'The brief'
    });
    await expect(brief).toHaveAccessibleDescription(/Up to 500 characters\\./);
    await userEvent.type(brief, 'A small puzzle game for the web.');
    await expect(canvas.getByText('Keep going')).toBeVisible();
    await expect(canvas.getByText('32 / 500')).toBeVisible();
    await userEvent.type(brief, ' Two levels.');
    await expect(canvas.getByText('Good to send')).toBeVisible();
  }
}`,...y.parameters?.docs?.source},description:{story:"`showCount` with `minLength` and `maxLength` adds a bar that fills towards the limit, a “32 /\r\n500” count and optional `countStatus` words for each state. Screen readers hear the limit in the\r\nfield’s description rather than the changing number; once typing pauses near the limit, a polite\r\nlive region says how many characters are left.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Send report'
    }));
    const report = canvas.getByRole('textbox', {
      name: /bug report/i
    });
    await expect(report).toHaveFocus();
    await expect(report).toHaveAccessibleDescription(/Describe the bug\\./);
    await userEvent.type(report, 'It crashes when I open http://example.com in the viewer.');
    await userEvent.tab();
    await expect(report).toHaveAccessibleDescription(/Remove links/);
  },
  render: () => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={4}>\r
        <TextArea label="Bug report" name="report" required minLength={20} maxLength={500} startIcon={<MessageIcon />} hint="At least 20 characters." validationMessages={{
        valueMissing: 'Describe the bug.'
      }} validate={value => /https?:\\/\\//.test(value) ? 'Remove links; attach screenshots instead.' : null} />\r
        <Button type="submit">Send report</Button>\r
      </Stack>\r
    </form>
}`,...b.parameters?.docs?.source},description:{story:"Native constraints and a custom `validate` rule in a form. Submitting it empty shows the\r\n`valueMissing` message and focuses the field; leaving the field with a link in it then shows the\r\ncustom rule’s error.",...b.parameters?.docs?.description}}}})))()}S();export{y as CharacterCount,h as Default,v as Disabled,b as Validation,_ as WithError,g as WithIcon,x as __namedExportsOrder,m as default};