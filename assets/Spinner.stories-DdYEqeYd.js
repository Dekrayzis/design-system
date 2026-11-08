import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Spinner-DSlmNbGE.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{i(),n(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/Spinner`,component:r,args:{size:`md`,label:`Loading`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:'An indeterminate loading indicator: an `aria-hidden` ring inside a `<span role="status">` that announces `label` to screen readers. Pass `label={null}` when it sits inside something that already communicates the busy state, as in a loading `Button`; then only the decorative ring renders. Use it when you can’t show real progress or a placeholder for the content that is coming.'}}}},u={play:async({canvasElement:e})=>{await s(c(e).getByRole(`status`)).toHaveTextContent(`Loading`)}},d={render:()=>(0,o.jsxs)(a,{direction:`row`,gap:4,align:`center`,children:[(0,o.jsx)(r,{size:`sm`}),(0,o.jsx)(r,{size:`md`}),(0,o.jsx)(r,{size:`lg`})]})},f=[`Default`,`Sizes`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading');
  }
}`,...u.parameters?.docs?.source},description:{story:'A medium spinner inside `role="status"`, with its `label` ("Loading") as visually hidden text so\r\nscreen readers announce it. The ring itself is `aria-hidden`.',...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="row" gap={4} align="center">\r
      <Spinner size="sm" />\r
      <Spinner size="md" />\r
      <Spinner size="lg" />\r
    </Stack>
}`,...d.parameters?.docs?.source},description:{story:"The three sizes, `sm`, `md` and `lg`, side by side. Match the size to the surrounding text or to\r\nthe area that is loading.",...d.parameters?.docs?.description}}}})))()}p();export{u as Default,d as Sizes,f as __namedExportsOrder,l as default};