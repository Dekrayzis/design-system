import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";import{n as i,t as a}from"./Badge-Rh9PSFv9.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/Badge`,component:a,args:{children:`Draft`},argTypes:{tone:{control:`inline-radio`,options:[`neutral`,`accent`,`success`,`warning`,`danger`,`info`]}},parameters:{docs:{description:{component:"A short, non-interactive status label rendered as a `<span>`. Colour reinforces the tone but must not carry the meaning alone: the text says what the status is. For something clickable use `Button`; for a message about the page use `Alert`."}}}},u={},d={play:async({canvasElement:e})=>{let t=c(e);for(let e of[`Draft`,`New`,`Published`,`Pending review`,`Failed`,`Beta`])await s(t.getByText(e)).toBeVisible()},render:()=>(0,o.jsxs)(r,{direction:`row`,gap:2,wrap:!0,children:[(0,o.jsx)(a,{tone:`neutral`,children:`Draft`}),(0,o.jsx)(a,{tone:`accent`,children:`New`}),(0,o.jsx)(a,{tone:`success`,children:`Published`}),(0,o.jsx)(a,{tone:`warning`,children:`Pending review`}),(0,o.jsx)(a,{tone:`danger`,children:`Failed`}),(0,o.jsx)(a,{tone:`info`,children:`Beta`})]})},f=[`Default`,`Tones`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:"The default `neutral` tone, for labels such as a draft state that need no emphasis.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    for (const text of ['Draft', 'New', 'Published', 'Pending review', 'Failed', 'Beta']) {
      await expect(canvas.getByText(text)).toBeVisible();
    }
  },
  render: () => <Stack direction="row" gap={2} wrap>\r
      <Badge tone="neutral">Draft</Badge>\r
      <Badge tone="accent">New</Badge>\r
      <Badge tone="success">Published</Badge>\r
      <Badge tone="warning">Pending review</Badge>\r
      <Badge tone="danger">Failed</Badge>\r
      <Badge tone="info">Beta</Badge>\r
    </Stack>
}`,...d.parameters?.docs?.source},description:{story:"The six tones. Pick the tone that matches the words, for example `success` for ‘Published’ and\r\n`danger` for ‘Failed’, so colour and text agree.",...d.parameters?.docs?.description}}}})))()}p();export{u as Default,d as Tones,f as __namedExportsOrder,l as default};