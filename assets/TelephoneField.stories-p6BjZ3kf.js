import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,t as c}from"./TelephoneField-rafi6yyZ.js";function l(){let[e,t]=(0,d.useState)(`+353851234567`),[n,r]=(0,d.useState)(`IE`),[i,a]=(0,d.useState)(!0);return(0,f.jsxs)(o,{gap:3,children:[(0,f.jsx)(c,{label:`Phone number`,value:e,country:n,onCountryChange:r,onValueChange:(e,n)=>{t(e),a(n.valid)}}),(0,f.jsxs)(`output`,{children:[(0,f.jsx)(`code`,{children:e||`(empty)`}),` · `,n,` · `,i?`valid`:`not valid yet`]})]})}function u(){let[e,t]=(0,d.useState)(null);return(0,f.jsx)(`form`,{onSubmit:e=>{e.preventDefault(),t(String(new FormData(e.currentTarget).get(`phone`)))},children:(0,f.jsxs)(o,{gap:4,children:[(0,f.jsx)(c,{label:`Phone number`,name:`phone`,required:!0,preferredCountries:[`GB`,`IE`]}),(0,f.jsx)(i,{type:`submit`,children:`Save`}),e&&(0,f.jsxs)(`output`,{children:[`Submitted `,e]})]})})}var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{d=n(),r(),a(),s(),f=t(),{expect:p,userEvent:m,waitFor:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Forms/TelephoneField`,component:c,args:{label:`Phone number`},argTypes:{validateOn:{control:`inline-radio`,options:[`blur`,`change`,`submit`]}},decorators:[e=>(0,f.jsx)(`div`,{style:{maxWidth:400},children:(0,f.jsx)(e,{})})],parameters:{docs:{description:{component:'A phone number field: a searchable country picker with flags and dialling codes, grouped by region, joined to a native `<input type="tel">`. It formats the number for the chosen country as you type, switches country when an international number is pasted, checks the number is valid for that country, and reports and submits it in E.164 form (`+447400123456`). Uses `libphonenumber-js` for the rules; the flags load as one separate chunk the first time the field appears.'}}}},v={play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`textbox`,{name:`Phone number`});await m.type(n,`07400123456`),await p(n).toHaveValue(`07400 123456`),await p(t.getByRole(`button`,{name:/Country United Kingdom \+44/})).toBeInTheDocument()}},y={args:{hint:`We’ll only call about your delivery.`}},b={args:{preferredCountries:[`GB`,`IE`,`US`,`FR`,`DE`]},play:async({canvasElement:e})=>{let t=g(e);await m.click(t.getByRole(`button`,{name:/Country/}));let n=g(e.ownerDocument.body),r=await n.findAllByRole(`option`);await p(r[1]).toHaveTextContent(`Ireland`),await p(n.getByRole(`group`,{name:`Suggested`})).toBeInTheDocument(),await p(n.getByRole(`group`,{name:`Europe`})).toBeInTheDocument(),await m.type(n.getByRole(`combobox`,{name:`Country`}),`353{Enter}`),await p(t.getByRole(`button`,{name:/Country Ireland \+353/})).toBeInTheDocument()}},x={args:{countries:[`GB`,`IE`,`FR`,`DE`,`ES`,`NL`]},play:async({canvasElement:e})=>{let t=g(e);await m.click(t.getByRole(`button`,{name:/Country/}));let n=g(e.ownerDocument.body);await p(await n.findAllByRole(`option`)).toHaveLength(6)}},S={play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`textbox`,{name:`Phone number`});await m.click(n),await m.paste(`+33 6 12 34 56 78`),await p(n).toHaveValue(`06 12 34 56 78`),await p(t.getByRole(`button`,{name:/Country France \+33/})).toBeInTheDocument()}},C={args:{defaultValue:`+14155550123`}},w={args:{required:!0},play:async({canvasElement:e})=>{let t=g(e).getByRole(`textbox`,{name:/Phone number/});await m.type(t,`0123`),await m.tab(),await p(t).toHaveAccessibleDescription(`Enter a valid phone number, like 07400 123456.`),await m.clear(t),await m.type(t,`07400123456`),await p(t).not.toHaveAccessibleDescription()}},T={args:{defaultValue:`+447400123456`,error:`This number is already registered.`}},E={args:{defaultValue:`+447400123456`,disabled:!0}},D={render:()=>(0,f.jsx)(l,{}),play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`textbox`,{name:`Phone number`});await p(n).toHaveValue(`085 123 4567`),await m.clear(n),await m.type(n,`0851`),await p(t.getByRole(`status`)).toHaveTextContent(`+353851 · IE · not valid yet`)}},O={render:()=>(0,f.jsx)(u,{}),play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`textbox`,{name:/Phone number/});await m.click(t.getByRole(`button`,{name:`Save`})),await h(()=>p(n).toHaveFocus()),await m.type(n,`07400123456`),await m.click(t.getByRole(`button`,{name:`Save`})),await p(await t.findByRole(`status`)).toHaveTextContent(`Submitted +447400123456`)}},k=[`Default`,`WithHint`,`PreferredCountries`,`LimitedCountries`,`PasteInternational`,`WithValue`,`Validation`,`WithError`,`Disabled`,`Controlled`,`InAForm`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Phone number'
    });
    await userEvent.type(input, '07400123456');
    await expect(input).toHaveValue('07400 123456');
    await expect(canvas.getByRole('button', {
      name: /Country United Kingdom \\+44/
    })).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source},description:{story:`Starts on the United Kingdom. The placeholder shows an example number in the local format, and\r
typing is formatted as you go. The country picker's accessible name includes the country, not\r
just its code.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    hint: 'We’ll only call about your delivery.'
  }
}`,...y.parameters?.docs?.source},description:{story:"A `hint` under the label, read after the label by screen readers.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    preferredCountries: ['GB', 'IE', 'US', 'FR', 'DE']
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: /Country/
    }));
    const body = within(canvasElement.ownerDocument.body);
    const options = await body.findAllByRole('option');
    await expect(options[1]).toHaveTextContent('Ireland');
    await expect(body.getByRole('group', {
      name: 'Suggested'
    })).toBeInTheDocument();
    await expect(body.getByRole('group', {
      name: 'Europe'
    })).toBeInTheDocument();
    await userEvent.type(body.getByRole('combobox', {
      name: 'Country'
    }), '353{Enter}');
    await expect(canvas.getByRole('button', {
      name: /Country Ireland \\+353/
    })).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source},description:{story:`Countries are grouped by region (Africa, Americas, Asia, Europe, Oceania). Those in\r
\`preferredCountries\` get their own "Suggested" group at the top. Search matches country names\r
and dialling codes, so typing "353" finds Ireland, and groups with no matches are hidden.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    countries: ['GB', 'IE', 'FR', 'DE', 'ES', 'NL']
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: /Country/
    }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findAllByRole('option')).toHaveLength(6);
  }
}`,...x.parameters?.docs?.source},description:{story:"`countries` limits the list, for example to the countries you deliver to. The selected country\r\nis always listed, so a pasted number from elsewhere still shows its country.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Phone number'
    });
    await userEvent.click(input);
    await userEvent.paste('+33 6 12 34 56 78');
    await expect(input).toHaveValue('06 12 34 56 78');
    await expect(canvas.getByRole('button', {
      name: /Country France \\+33/
    })).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source},description:{story:"Pasting or typing a number with its `+` code switches the country to match and shows the number\r\nin that country's local format.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '+14155550123'
  }
}`,...C.parameters?.docs?.source},description:{story:"Starts from an E.164 `defaultValue`; the country comes from the number.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: /Phone number/
    });
    await userEvent.type(input, '0123');
    await userEvent.tab();
    await expect(input).toHaveAccessibleDescription('Enter a valid phone number, like 07400 123456.');
    await userEvent.clear(input);
    await userEvent.type(input, '07400123456');
    await expect(input).not.toHaveAccessibleDescription();
  }
}`,...w.parameters?.docs?.source},description:{story:`A number that can't exist in the chosen country gets an error on blur, with an example of the\r
right format. It clears as soon as the number is fixed.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '+447400123456',
    error: 'This number is already registered.'
  }
}`,...T.parameters?.docs?.source},description:{story:"An explicit `error`, for problems only the server knows about.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '+447400123456',
    disabled: true
  }
}`,...E.parameters?.docs?.source},description:{story:`Disables both the country picker and the number.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledDemo />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Phone number'
    });
    await expect(input).toHaveValue('085 123 4567');
    await userEvent.clear(input);
    await userEvent.type(input, '0851');
    await expect(canvas.getByRole('status')).toHaveTextContent('+353851 · IE · not valid yet');
  }
}`,...D.parameters?.docs?.source},description:{story:"Controlled `value` and `country`. `onValueChange` reports the E.164 number on every change,\r\nwith the country and whether the number is complete and valid.",...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <FormDemo />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: /Phone number/
    });
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.type(input, '07400123456');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Save'
    }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Submitted +447400123456');
  }
}`,...O.parameters?.docs?.source},description:{story:"Inside a form, `name` submits the E.164 number. An empty or invalid number blocks submission and\r\nfocuses the field.",...O.parameters?.docs?.description}}}})))()}A();export{D as Controlled,v as Default,E as Disabled,O as InAForm,x as LimitedCountries,S as PasteInternational,b as PreferredCountries,w as Validation,T as WithError,y as WithHint,C as WithValue,k as __namedExportsOrder,_ as default};