import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{n as o,t as s}from"./ScaleSelect-CE2TyF7r.js";var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),o(),c=t(),{expect:l,fn:u,userEvent:d,waitFor:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Forms/ScaleSelect`,component:s,args:{label:`Budget`,options:[{value:`lt5`,label:`Under £5k`},{value:`5-15`,label:`£5–15k`},{value:`15-50`,label:`£15–50k`},{value:`50-100`,label:`£50–100k`},{value:`gt100`,label:`£100k+`},{value:`discuss`,label:`Let's discuss`}],defaultValue:`15-50`,onValueChange:u()},decorators:[e=>(0,c.jsx)(`div`,{style:{maxWidth:640},children:(0,c.jsx)(e,{})})],parameters:{docs:{description:{component:"A single choice along an ordered range, as one continuous bar. Native radios underneath (forms, `required`, validation, reset, screen readers); arrow keys move focus and selection together and stop at the ends. It switches to two columns when its own container is narrow."}}}},h={play:async({canvasElement:e,args:t})=>{let n=p(e);await d.click(n.getByRole(`radio`,{name:`£15–50k`})),await d.keyboard(`{ArrowRight}`);let r=n.getByRole(`radio`,{name:`£50–100k`});await l(r).toBeChecked(),await l(r).toHaveFocus(),await l(t.onValueChange).toHaveBeenLastCalledWith(`50-100`);let i=r.closest(`label`).getBoundingClientRect(),a=e.querySelector(`[data-set]`);await f(()=>{let e=a.getBoundingClientRect();l(Math.abs(e.left+e.width/2-(i.left+i.width/2))).toBeLessThan(2)},{timeout:2e3})}},g={name:`Narrow container (two columns)`,decorators:[e=>(0,c.jsx)(`div`,{style:{maxWidth:320},children:(0,c.jsx)(e,{})})],play:async({canvasElement:e})=>{let t=p(e),n=t.getByText(`Under £5k`).getBoundingClientRect(),r=t.getByText(`£15–50k`).getBoundingClientRect();await l(r.top).toBeGreaterThan(n.bottom)}},_={args:{defaultValue:void 0},render:e=>(0,c.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,c.jsxs)(a,{gap:4,children:[(0,c.jsx)(s,{...e,label:`Timeline`,name:`timeline`,required:!0,hint:`When would you like to start?`,validationMessages:{valueMissing:`Choose a timeline.`},options:[{value:`asap`,label:`ASAP`},{value:`month`,label:`Within a month`},{value:`quarter`,label:`This quarter`},{value:`later`,label:`Later`}]}),(0,c.jsx)(`div`,{children:(0,c.jsx)(r,{type:`submit`,children:`Send brief`})})]})}),play:async({canvasElement:e})=>{let t=p(e);await d.click(t.getByRole(`button`,{name:`Send brief`}));let n=t.getByRole(`radio`,{name:`ASAP`});await l(n).toHaveAccessibleDescription(/Choose a timeline\./),await l(n).toHaveFocus(),await d.click(t.getByRole(`radio`,{name:`This quarter`})),await l(n).not.toHaveAttribute(`aria-invalid`)}},v=[`Default`,`Narrow`,`Validation`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    // Real clicks land on the radio stretched over each segment.
    await userEvent.click(canvas.getByRole('radio', {
      name: '£15–50k'
    }));
    await userEvent.keyboard('{ArrowRight}');
    const next = canvas.getByRole('radio', {
      name: '£50–100k'
    });
    await expect(next).toBeChecked();
    await expect(next).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('50-100');

    // Once it has slid, the rail's thumb sits under the chosen segment.
    const segment = next.closest('label')!.getBoundingClientRect();
    const thumb = canvasElement.querySelector('[data-set]')!;
    await waitFor(() => {
      const t = thumb.getBoundingClientRect();
      expect(Math.abs(t.left + t.width / 2 - (segment.left + segment.width / 2))).toBeLessThan(2);
    }, {
      timeout: 2000
    });
  }
}`,...h.parameters?.docs?.source},description:{story:`A budget scale with a middle option preselected. Arrow keys move focus and selection together and stop at the first and last options instead of wrapping; the rail’s thumb slides under the chosen segment and is hidden from assistive tech.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Narrow container (two columns)',
  decorators: [Story => <div style={{
    maxWidth: 320
  }}><Story /></div>],
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const a = canvas.getByText('Under £5k').getBoundingClientRect();
    const c = canvas.getByText('£15–50k').getBoundingClientRect();
    // The third option wraps under the first.
    await expect(c.top).toBeGreaterThan(a.bottom);
  }
}`,...g.parameters?.docs?.source},description:{story:`When the component’s own container is narrow it switches to a two-column grid and drops the rail. This responds to the container, not the viewport, so it also works in sidebars and cards.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: undefined
  },
  render: args => <form onSubmit={event => event.preventDefault()}>\r
      <Stack gap={4}>\r
        <ScaleSelect {...args} label="Timeline" name="timeline" required hint="When would you like to start?" validationMessages={{
        valueMissing: 'Choose a timeline.'
      }} options={[{
        value: 'asap',
        label: 'ASAP'
      }, {
        value: 'month',
        label: 'Within a month'
      }, {
        value: 'quarter',
        label: 'This quarter'
      }, {
        value: 'later',
        label: 'Later'
      }]} />\r
        <div>\r
          <Button type="submit">Send brief</Button>\r
        </div>\r
      </Stack>\r
    </form>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Send brief'
    }));
    const first = canvas.getByRole('radio', {
      name: 'ASAP'
    });
    await expect(first).toHaveAccessibleDescription(/Choose a timeline\\./);
    await expect(first).toHaveFocus();
    await userEvent.click(canvas.getByRole('radio', {
      name: 'This quarter'
    }));
    await expect(first).not.toHaveAttribute('aria-invalid');
  }
}`,..._.parameters?.docs?.source},description:{story:"A required scale with a hint in a form. Submitting with nothing chosen shows the `valueMissing` message, links it to each radio through `aria-describedby` and focuses the first option; choosing one clears it.",..._.parameters?.docs?.description}}}})))()}y();export{h as Default,g as Narrow,_ as Validation,v as __namedExportsOrder,m as default};