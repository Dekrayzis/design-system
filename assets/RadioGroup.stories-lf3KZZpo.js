import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{n as o,r as s,t as c}from"./RadioGroup-CUn1i8lR.js";var l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),i(),s(),l=t(),{expect:u,fn:d,userEvent:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Forms/RadioGroup`,component:o,subcomponents:{Radio:c},args:{legend:`Delivery speed`,defaultValue:`standard`,onValueChange:d(),children:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(c,{value:`standard`,label:`Standard`,hint:`3–5 working days, free`}),(0,l.jsx)(c,{value:`express`,label:`Express`,hint:`Next working day, £4.99`}),(0,l.jsx)(c,{value:`collect`,label:`Click & collect`,hint:`Unavailable for this order`,disabled:!0})]})},argTypes:{orientation:{control:`inline-radio`,options:[`vertical`,`horizontal`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},children:{control:!1}},parameters:{docs:{description:{component:'A set of mutually exclusive options, rendered as a `<fieldset>` with a `<legend>` and native `<input type="radio">`s, so it submits, validates and resets with its form. Use it when every option should stay visible; use `Select` for long lists and `ScaleSelect` when the options form an ordered range.'}}}},h={play:async({canvasElement:e,args:t})=>{let n=p(e);await u(n.getByRole(`radio`,{name:`Standard`})).toBeChecked(),await f.click(n.getByRole(`radio`,{name:`Standard`})),await f.keyboard(`{ArrowDown}`),await u(n.getByRole(`radio`,{name:`Express`})).toBeChecked(),await u(t.onValueChange).toHaveBeenLastCalledWith(`express`)}},g={args:{legend:`Plan`,orientation:`horizontal`,defaultValue:`monthly`,children:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(c,{value:`monthly`,label:`Monthly`}),(0,l.jsx)(c,{value:`yearly`,label:`Yearly`})]})}},_={args:{defaultValue:void 0,required:!0,error:`Choose a delivery speed.`}},v={render:()=>(0,l.jsx)(a,{direction:`row`,gap:10,wrap:!0,children:[`sm`,`md`,`lg`].map(e=>(0,l.jsxs)(o,{legend:`Size ${e}`,size:e,defaultValue:`b`,children:[(0,l.jsx)(c,{value:`a`,label:`Option A`}),(0,l.jsx)(c,{value:`b`,label:`Option B`,hint:`With a hint`}),(0,l.jsx)(c,{value:`c`,label:`Option C`,disabled:!0})]},e))})},y={play:async({canvasElement:e})=>{let t=p(e);await f.click(t.getByRole(`button`,{name:`Place order`})),await u(t.getByText(`Choose a delivery speed.`)).toBeVisible(),await f.click(t.getByRole(`radio`,{name:`Express`})),await f.click(t.getByRole(`button`,{name:`Place order`})),await u(t.getByText(`Express is sold out today.`)).toBeVisible(),await f.click(t.getByRole(`radio`,{name:`Standard`})),await u(t.queryByText(`Express is sold out today.`)).not.toBeInTheDocument()},render:()=>(0,l.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,l.jsxs)(a,{gap:4,children:[(0,l.jsxs)(o,{legend:`Delivery speed`,name:`delivery`,required:!0,validationMessages:{valueMissing:`Choose a delivery speed.`},validate:e=>e===`express`?`Express is sold out today.`:null,children:[(0,l.jsx)(c,{value:`standard`,label:`Standard`,hint:`3–5 working days`}),(0,l.jsx)(c,{value:`express`,label:`Express`,hint:`Next working day`})]}),(0,l.jsx)(`div`,{children:(0,l.jsx)(r,{type:`submit`,children:`Place order`})})]})})},b=[`Default`,`Horizontal`,`WithError`,`Sizes`,`Validation`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', {
      name: 'Standard'
    })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Standard'
    }));
    // Native radio keyboard: the arrow moves and selects, skipping the disabled option.
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', {
      name: 'Express'
    })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('express');
  }
}`,...h.parameters?.docs?.source},description:{story:"A vertical group with a hint on each option and one disabled option. Built on a `<fieldset>` and `<legend>` with native radios, so Tab enters the group once and the arrow keys move and select, skipping the disabled option.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    legend: 'Plan',
    orientation: 'horizontal',
    defaultValue: 'monthly',
    children: <>\r
        <Radio value="monthly" label="Monthly" />\r
        <Radio value="yearly" label="Yearly" />\r
      </>
  }
}`,...g.parameters?.docs?.source},description:{story:'`orientation="horizontal"` lays short options out in a row. Keep it for two or three brief labels; longer lists read better stacked.',...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: undefined,
    required: true,
    error: 'Choose a delivery speed.'
  }
}`,..._.parameters?.docs?.source},description:{story:"A required group with an `error` passed in. The message is linked to every radio through `aria-describedby` and each one is marked `aria-invalid`, so screen readers announce it on any option.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" gap={10} wrap>\r
      {(['sm', 'md', 'lg'] as const).map(size => <RadioGroup key={size} legend={\`Size \${size}\`} size={size} defaultValue="b">\r
          <Radio value="a" label="Option A" />\r
          <Radio value="b" label="Option B" hint="With a hint" />\r
          <Radio value="c" label="Option C" disabled />\r
        </RadioGroup>)}\r
    </Stack>
}`,...v.parameters?.docs?.source},description:{story:"The `sm`, `md` and `lg` sizes. `size` on the group applies to every radio; a `Radio`’s own `size` overrides it.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Place order'
    }));
    await expect(canvas.getByText('Choose a delivery speed.')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Express'
    }));
    await userEvent.click(canvas.getByRole('button', {
      name: 'Place order'
    }));
    await expect(canvas.getByText('Express is sold out today.')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Standard'
    }));
    await expect(canvas.queryByText('Express is sold out today.')).not.toBeInTheDocument();
  },
  render: () => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={4}>\r
        <RadioGroup legend="Delivery speed" name="delivery" required validationMessages={{
        valueMissing: 'Choose a delivery speed.'
      }} validate={value => value === 'express' ? 'Express is sold out today.' : null}>\r
          <Radio value="standard" label="Standard" hint="3–5 working days" />\r
          <Radio value="express" label="Express" hint="Next working day" />\r
        </RadioGroup>\r
        <div>\r
          <Button type="submit">Place order</Button>\r
        </div>\r
      </Stack>\r
    </form>
}`,...y.parameters?.docs?.source},description:{story:"Built-in validation in a form. Submitting with nothing chosen shows the `valueMissing` message from native `required`; the `validate` rule then rejects “Express”, and the error clears as soon as a valid option is picked.",...y.parameters?.docs?.description}}}})))()}x();export{h as Default,g as Horizontal,v as Sizes,y as Validation,_ as WithError,b as __namedExportsOrder,m as default};