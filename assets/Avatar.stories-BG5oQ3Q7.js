import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";import{n as i,t as a}from"./Avatar-DvWWUtF0.js";var o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%238187fb%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%234ade80%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2232%22%20r%3D%2214%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.85%22%2F%3E%3Cellipse%20cx%3D%2240%22%20cy%3D%2274%22%20rx%3D%2226%22%20ry%3D%2220%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.85%22%2F%3E%3C%2Fsvg%3E`,u={title:`Components/Avatar`,component:a,args:{name:`Alex Morgan`,size:`md`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]}},parameters:{docs:{description:{component:'A picture of a person, rendered as an `<img>` when `src` loads, otherwise as their initials in a `role="img"` span named after them. Initials get a stable colour derived from the name. Set `decorative` when the name is already visible beside it, and use `AvatarGroup` to show several people together.'}}}},d={},f={args:{src:l}},p={play:async({canvasElement:e})=>{let t=await c(e).findByText(`AM`,{},{timeout:8e3});await s(t.closest(`[role="img"]`)).toHaveAccessibleName(`Alex Morgan`)},args:{src:`https://invalid.example/missing.png`}},m={render:e=>(0,o.jsxs)(r,{direction:`row`,gap:3,align:`center`,children:[(0,o.jsx)(a,{...e,size:`sm`}),(0,o.jsx)(a,{...e,size:`md`}),(0,o.jsx)(a,{...e,size:`lg`,src:l}),(0,o.jsx)(a,{...e,size:`xl`,src:l})]})},h={play:async({canvasElement:e})=>{let t=c(e);await s(t.queryByRole(`img`)).not.toBeInTheDocument(),await s(t.getByText(`Alex Morgan`)).toBeVisible()},name:`Decorative (name shown beside it)`,render:e=>(0,o.jsxs)(r,{direction:`row`,gap:2,align:`center`,children:[(0,o.jsx)(a,{...e,decorative:!0}),(0,o.jsx)(`span`,{children:e.name})]})},g=[`Initials`,`WithImage`,`BrokenImageFallsBack`,`Sizes`,`WithName`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:'With no `src`, the avatar shows the first and last initials on a colour derived from the name, so\r\nthe same person always gets the same colour. It is a `role="img"` named after the person, so\r\nscreen readers hear the full name rather than the letters.',...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    src: portrait
  }
}`,...f.parameters?.docs?.source},description:{story:"With `src`, it renders an `<img>` whose `alt` is the person’s `name`.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    // The image fails to load; the initials take over, still named for screen readers.
    const canvas = within(canvasElement);
    const avatar = await canvas.findByText('AM', {}, {
      timeout: 8000
    });
    await expect(avatar.closest('[role="img"]')).toHaveAccessibleName('Alex Morgan');
  },
  args: {
    src: 'https://invalid.example/missing.png'
  }
}`,...p.parameters?.docs?.source},description:{story:`If the image fails to load, the avatar switches to initials and keeps the person’s name as its\r
accessible name, so a broken URL never leaves an empty or unnamed box.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="row" gap={3} align="center">\r
      <Avatar {...args} size="sm" />\r
      <Avatar {...args} size="md" />\r
      <Avatar {...args} size="lg" src={portrait} />\r
      <Avatar {...args} size="xl" src={portrait} />\r
    </Stack>
}`,...m.parameters?.docs?.source},description:{story:"The four sizes, `sm` to `xl`, with both initials and images.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
    await expect(canvas.getByText('Alex Morgan')).toBeVisible();
  },
  name: 'Decorative (name shown beside it)',
  render: args => <Stack direction="row" gap={2} align="center">\r
      <Avatar {...args} decorative />\r
      <span>{args.name}</span>\r
    </Stack>
}`,...h.parameters?.docs?.source},description:{story:"When the name is already shown beside the avatar, set `decorative` so screen readers don’t hear\r\nit twice: an image gets an empty `alt`, and initials are hidden from the accessibility tree.",...h.parameters?.docs?.description}}}})))()}_();export{p as BrokenImageFallsBack,d as Initials,m as Sizes,f as WithImage,h as WithName,g as __namedExportsOrder,u as default};