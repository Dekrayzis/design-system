import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{r as s,t as c}from"./Checkbox-8TrzcQ2V.js";import{n as l,t as u}from"./TextField-Cpptxuig.js";import{n as d,r as f,t as p}from"./ErrorSummary-DFBOT0nB.js";function m(){let e=(0,h.useRef)(null),t=f(e);return(0,g.jsxs)(o,{gap:4,style:{maxWidth:420},children:[(0,g.jsx)(p,{...t}),(0,g.jsx)(`form`,{ref:e,onSubmit:e=>e.preventDefault(),children:(0,g.jsxs)(o,{gap:4,children:[(0,g.jsx)(u,{label:`Full name`,name:`name`,required:!0,validationMessages:{valueMissing:`Enter your full name.`}}),(0,g.jsx)(u,{label:`Email`,name:`email`,type:`email`,required:!0,validationMessages:{valueMissing:`Enter your email address.`}}),(0,g.jsx)(c,{label:`I accept the terms`,name:`terms`,required:!0,validationMessages:{valueMissing:`Accept the terms to continue.`}}),(0,g.jsx)(`div`,{children:(0,g.jsx)(i,{type:`submit`,children:`Continue`})})]})})]})}var h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{h=n(),r(),s(),a(),l(),d(),g=t(),{expect:_,userEvent:v,waitFor:y,within:b}=__STORYBOOK_MODULE_TEST__,x={title:`Components/Forms/ErrorSummary`,component:m,parameters:{docs:{description:{component:"After a blocked submit, `useErrorSummary` collects the errors the fields are already showing; `ErrorSummary` lists them, takes focus so screen readers announce them, and links each one to its field (the GOV.UK pattern)."}}}},S={play:async({canvasElement:e})=>{let t=b(e);await v.click(t.getByRole(`button`,{name:`Continue`}));let n=await t.findByRole(`alert`);await y(()=>_(n.parentElement).toHaveFocus()),await _(b(n).getAllByRole(`link`).map(e=>e.textContent)).toEqual([`Enter your full name.`,`Enter your email address.`,`Accept the terms to continue.`]),await v.click(b(n).getByRole(`link`,{name:`Enter your email address.`})),await _(t.getByRole(`textbox`,{name:/email/i})).toHaveFocus()}},C=[`Default`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Continue'
    }));
    const alert = await canvas.findByRole('alert');
    await waitFor(() => expect(alert.parentElement).toHaveFocus());
    await expect(within(alert).getAllByRole('link').map(link => link.textContent)).toEqual(['Enter your full name.', 'Enter your email address.', 'Accept the terms to continue.']);
    await userEvent.click(within(alert).getByRole('link', {
      name: 'Enter your email address.'
    }));
    await expect(canvas.getByRole('textbox', {
      name: /email/i
    })).toHaveFocus();
  }
}`,...S.parameters?.docs?.source},description:{story:"Submit the empty form to see the summary appear above it. `useErrorSummary` gathers the messages the fields are already showing, `ErrorSummary` takes focus so a screen reader announces the list, and choosing a link moves focus to that field. The checkbox is listed once, and the list clears on the next successful submit or reset.",...S.parameters?.docs?.description}}}})))()}w();export{S as Default,C as __namedExportsOrder,x as default};