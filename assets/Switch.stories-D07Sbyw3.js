import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{n as o,t as s}from"./Switch-Dbjoih5B.js";var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),o(),c=t(),{expect:l,userEvent:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`Components/Forms/Switch`,component:s,args:{label:`Dark mode`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},decorators:[e=>(0,c.jsx)(`div`,{style:{maxWidth:420},children:(0,c.jsx)(e,{})})],parameters:{docs:{description:{component:'An on/off setting that takes effect immediately, such as a preference. It renders a native `<input type="checkbox" role="switch">` with a `<label>`, so it submits with forms, supports `required` and `validate` rules, and toggles with Space. Use a `Checkbox` instead when the choice only applies once a form is submitted.'}}}},p={play:async({canvasElement:e})=>{let t=d(e).getByRole(`switch`,{name:`Dark mode`});await u.click(t),await l(t).toBeChecked();let n=t.getBoundingClientRect(),r=getComputedStyle(t,`::before`);await l(r.translate).not.toBe(`none`),await l(n.width).toBeGreaterThan(n.height),await u.keyboard(` `),await l(t).not.toBeChecked()}},m={args:{defaultChecked:!0}},h={render:()=>(0,c.jsxs)(a,{gap:5,children:[(0,c.jsx)(s,{label:`Push notifications`,hint:`Mentions and direct messages.`,defaultChecked:!0}),(0,c.jsx)(s,{label:`Weekly digest`,hint:`A summary every Monday morning.`}),(0,c.jsx)(s,{label:`Beta features`,hint:`Managed by your organisation.`,disabled:!0})]})},g={render:()=>(0,c.jsxs)(a,{gap:5,children:[(0,c.jsx)(s,{size:`sm`,label:`Small`,hint:`Compact settings lists`,defaultChecked:!0}),(0,c.jsx)(s,{size:`md`,label:`Medium`,hint:`The default`,defaultChecked:!0}),(0,c.jsx)(s,{size:`lg`,label:`Large`,hint:`Touch-first layouts`,defaultChecked:!0}),(0,c.jsx)(s,{size:`lg`,label:`Large, off`})]})},_={play:async({canvasElement:e})=>{let t=d(e);await u.click(t.getByRole(`button`,{name:`Join beta`}));let n=t.getByRole(`switch`);await l(n).toHaveAccessibleDescription(/Turn this on to continue/),await l(n).toHaveFocus(),await u.click(n),await l(n).not.toHaveAttribute(`aria-invalid`)},render:()=>(0,c.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,c.jsxs)(a,{gap:4,children:[(0,c.jsx)(s,{name:`consent`,label:`Share anonymous usage data`,required:!0,hint:`Required to join the beta.`}),(0,c.jsx)(`div`,{children:(0,c.jsx)(r,{type:`submit`,children:`Join beta`})})]})})},v=[`Default`,`On`,`SettingsList`,`Sizes`,`Validation`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Dark mode'
    });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    // The thumb has travelled to the end of the track.
    const track = toggle.getBoundingClientRect();
    const thumb = getComputedStyle(toggle, '::before');
    await expect(thumb.translate).not.toBe('none');
    await expect(track.width).toBeGreaterThan(track.height);
    await userEvent.keyboard(' ');
    await expect(toggle).not.toBeChecked();
  }
}`,...p.parameters?.docs?.source},description:{story:'A single switch, off to start. It is a native checkbox with `role="switch"`, so clicking the\r\nlabel or the track toggles it, and so does Space when it has focus.',...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...m.parameters?.docs?.source},description:{story:"Starts on via `defaultChecked`, as an uncontrolled input. Pass `checked` and `onChange` instead\r\nwhen the state lives in your app.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={5}>\r
      <Switch label="Push notifications" hint="Mentions and direct messages." defaultChecked />\r
      <Switch label="Weekly digest" hint="A summary every Monday morning." />\r
      <Switch label="Beta features" hint="Managed by your organisation." disabled />\r
    </Stack>
}`,...h.parameters?.docs?.source},description:{story:"A typical settings list: each switch has a `hint` linked to it with `aria-describedby`. The last\r\none is `disabled`, for a setting the user can see but not change.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={5}>\r
      <Switch size="sm" label="Small" hint="Compact settings lists" defaultChecked />\r
      <Switch size="md" label="Medium" hint="The default" defaultChecked />\r
      <Switch size="lg" label="Large" hint="Touch-first layouts" defaultChecked />\r
      <Switch size="lg" label="Large, off" />\r
    </Stack>
}`,...g.parameters?.docs?.source},description:{story:"`size` scales the track, thumb, label and hint together: `sm` for compact lists, `md` by\r\ndefault, `lg` for touch-first layouts.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Join beta'
    }));
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAccessibleDescription(/Turn this on to continue/);
    await expect(toggle).toHaveFocus();
    await userEvent.click(toggle);
    await expect(toggle).not.toHaveAttribute('aria-invalid');
  },
  render: () => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={4}>\r
        <Switch name="consent" label="Share anonymous usage data" required hint="Required to join the beta." />\r
        <div>\r
          <Button type="submit">Join beta</Button>\r
        </div>\r
      </Stack>\r
    </form>
}`,..._.parameters?.docs?.source},description:{story:"A `required` switch in a form. Submitting while it is off shows “Turn this on to continue.”,\r\nlinks it to the switch with `aria-describedby` and moves focus to it; turning it on clears the\r\nerror. Reserve this for consent-style settings that must be on to continue.",..._.parameters?.docs?.description}}}})))()}y();export{p as Default,m as On,h as SettingsList,g as Sizes,_ as Validation,v as __namedExportsOrder,f as default};