import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";import{n as i,t as a}from"./Heading-Dt4BQF7u.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/Heading`,component:a,args:{level:2,children:`Account settings`},argTypes:{level:{control:`inline-radio`,options:[1,2,3,4,5,6]},size:{control:`inline-radio`,options:[void 0,`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`]}},parameters:{docs:{description:{component:"A section heading that renders a real `<h1>` to `<h6>`. Set `level` from the document outline and `size` only when the looks should differ from that level’s default, so the heading structure screen readers navigate by stays correct."}}}},u={},d={play:async({canvasElement:e})=>{let t=c(e);for(let e of[1,2,3,4,5,6])await s(t.getByRole(`heading`,{level:e})).toHaveTextContent(`Heading level ${e}`)},render:()=>(0,o.jsxs)(r,{gap:3,children:[(0,o.jsx)(a,{level:1,children:`Heading level 1`}),(0,o.jsx)(a,{level:2,children:`Heading level 2`}),(0,o.jsx)(a,{level:3,children:`Heading level 3`}),(0,o.jsx)(a,{level:4,children:`Heading level 4`}),(0,o.jsx)(a,{level:5,children:`Heading level 5`}),(0,o.jsx)(a,{level:6,children:`Heading level 6`})]})},f={play:async({canvasElement:e})=>{let t=c(e).getByRole(`heading`,{level:2});await s(parseFloat(getComputedStyle(t).fontSize)).toBe(16)},name:`Level is independent of size`,args:{level:2,size:`md`,children:`An h2 that looks small`}},p=[`Default`,`Scale`,`LevelIndependentOfSize`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:"A single heading. Choose `level` from where the section sits in the page outline; it renders the matching `<h1>` to `<h6>`.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    for (const level of [1, 2, 3, 4, 5, 6]) {
      await expect(canvas.getByRole('heading', {
        level
      })).toHaveTextContent(\`Heading level \${level}\`);
    }
  },
  render: () => <Stack gap={3}>\r
      <Heading level={1}>Heading level 1</Heading>\r
      <Heading level={2}>Heading level 2</Heading>\r
      <Heading level={3}>Heading level 3</Heading>\r
      <Heading level={4}>Heading level 4</Heading>\r
      <Heading level={5}>Heading level 5</Heading>\r
      <Heading level={6}>Heading level 6</Heading>\r
    </Stack>
}`,...d.parameters?.docs?.source},description:{story:"Every level at its default size, from `<h1>` (`3xl`) down to `<h6>` (`sm`). Use it as a reference for the type scale.",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const heading = within(canvasElement).getByRole('heading', {
      level: 2
    });
    await expect(parseFloat(getComputedStyle(heading).fontSize)).toBe(16);
  },
  name: 'Level is independent of size',
  args: {
    level: 2,
    size: 'md',
    children: 'An h2 that looks small'
  }
}`,...f.parameters?.docs?.source},description:{story:'An `<h2>` rendered at `size="md"`. When a heading needs to look smaller or larger, change `size` and keep the `level` the outline needs, so screen reader users still get a correct heading structure.',...f.parameters?.docs?.description}}}})))()}m();export{u as Default,f as LevelIndependentOfSize,d as Scale,p as __namedExportsOrder,l as default};