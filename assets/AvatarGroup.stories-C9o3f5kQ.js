import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Stack-CCsQXNDC.js";import{n as i,t as a}from"./Avatar-DvWWUtF0.js";import{r as o,t as s}from"./Card-RSkRbbOw.js";import{n as c,t as l}from"./Heading-Dt4BQF7u.js";import{n as u,t as d}from"./AvatarGroup-RjhBMa_b.js";var f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{i(),o(),c(),n(),u(),f=t(),{expect:p,fn:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_=(e,t)=>`data:image/svg+xml;utf8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${e}"/><stop offset="1" stop-color="${t}"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#fff" fill-opacity=".85"/><ellipse cx="40" cy="74" rx="26" ry="20" fill="#fff" fill-opacity=".85"/></svg>`),v=[{name:`Ada Lovelace`,src:_(`#8187fb`,`#4ade80`)},{name:`Alan Turing`},{name:`Grace Hopper`,src:_(`#f59e0b`,`#ef4444`)},{name:`Katherine Johnson`},{name:`Margaret Hamilton`},{name:`Radia Perlman`,src:_(`#60a5fa`,`#a78bfa`)},{name:`Barbara Liskov`},{name:`Tim Berners-Lee`}].map(e=>(0,f.jsx)(a,{name:e.name,src:e.src},e.name)),y={title:`Components/AvatarGroup`,component:d,args:{label:`Project members`,max:5,children:v},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]},spacing:{control:`inline-radio`,options:[`tight`,`normal`,`loose`]},children:{control:!1}},parameters:{docs:{description:{component:`Overlapping avatars with a "+N" overflow. Rendered as a labelled list, so each person is announced by name and the overflow says who is hidden. Initials avatars get a colour from the person's name, so neighbours are easy to tell apart and a person keeps their colour everywhere.`}}}},b={play:async({canvasElement:e})=>{let t=g(e).getByRole(`list`,{name:`Project members`});await p(g(t).getAllByRole(`listitem`)).toHaveLength(6),await p(g(t).getByText(`+3`)).toBeVisible()}},x={render:e=>(0,f.jsx)(r,{gap:4,children:[`sm`,`md`,`lg`,`xl`].map(t=>(0,f.jsx)(d,{...e,label:`Members (${t})`,size:t},t))})},S={render:e=>(0,f.jsx)(r,{gap:4,children:[`tight`,`normal`,`loose`].map(t=>(0,f.jsx)(d,{...e,label:`Members (${t})`,spacing:t},t))})},C={args:{max:void 0,children:v.slice(0,4)}},w={name:`Partial list with a known total`,args:{max:void 0,total:128,children:v.slice(0,3)}},T={play:async({canvasElement:e,args:t})=>{await h.click(g(e).getByRole(`button`,{name:/^Show 4 more: Margaret Hamilton/})),await p(t.onOverflowClick).toHaveBeenCalledTimes(1)},args:{max:4,onOverflowClick:m()}},E={name:`On a card (matching ring colour)`,render:e=>(0,f.jsx)(s,{elevation:`raised`,style:{maxWidth:360},children:(0,f.jsxs)(r,{gap:3,children:[(0,f.jsx)(l,{level:3,size:`md`,children:`Design system`}),(0,f.jsx)(d,{...e,size:`sm`,style:{"--avatar-group-ring":`var(--ds-color-surface-raised)`}})]})})},D=[`Default`,`Sizes`,`Spacing`,`NoOverflow`,`KnownTotal`,`ClickableOverflow`,`OnACard`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Project members'
    });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(6);
    await expect(within(list).getByText('+3')).toBeVisible();
  }
}`,...b.parameters?.docs?.source},description:{story:`Eight people with \`max={5}\`: five avatars are shown and the rest collapse into a ‘+3’ bubble.\r
Each avatar shows its name in a tooltip on hover, and the bubble carries visually hidden text\r
naming who is left out.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Stack gap={4}>\r
      {(['sm', 'md', 'lg', 'xl'] as const).map(size => <AvatarGroup key={size} {...args} label={\`Members (\${size})\`} size={size} />)}\r
    </Stack>
}`,...x.parameters?.docs?.source},description:{story:"`size` is applied to every avatar in the group, replacing each avatar’s own size.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Stack gap={4}>\r
      {(['tight', 'normal', 'loose'] as const).map(spacing => <AvatarGroup key={spacing} {...args} label={\`Members (\${spacing})\`} spacing={spacing} />)}\r
    </Stack>
}`,...S.parameters?.docs?.source},description:{story:"`spacing` sets how far the avatars overlap: `tight`, `normal` or `loose`.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    max: undefined,
    children: team.slice(0, 4)
  }
}`,...C.parameters?.docs?.source},description:{story:"Without `max`, every avatar is shown and there is no overflow bubble.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Partial list with a known total',
  args: {
    max: undefined,
    total: 128,
    children: team.slice(0, 3)
  }
}`,...w.parameters?.docs?.source},description:{story:"Use `total` when `children` holds only the first few people, for example from a paged API. Here\r\nonly three people were loaded but the project has 128 members, so the bubble reads ‘+125’.",...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button', {
      name: /^Show 4 more: Margaret Hamilton/
    }));
    await expect(args.onOverflowClick).toHaveBeenCalledTimes(1);
  },
  args: {
    max: 4,
    onOverflowClick: fn()
  }
}`,...T.parameters?.docs?.source},description:{story:"With `onOverflowClick`, the bubble becomes a `<button>` whose accessible name lists the hidden\r\npeople (‘Show 4 more: …’). Use it to open the full member list.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'On a card (matching ring colour)',
  render: args => <Card elevation="raised" style={{
    maxWidth: 360
  }}>\r
      <Stack gap={3}>\r
        <Heading level={3} size="md">Design system</Heading>\r
        <AvatarGroup {...args} size="sm" style={{
        '--avatar-group-ring': 'var(--ds-color-surface-raised)'
      } as React.CSSProperties} />\r
      </Stack>\r
    </Card>
}`,...E.parameters?.docs?.source},description:{story:"On a surface other than the page background, set the `--avatar-group-ring` custom property to\r\nthat surface’s colour so the rings separating the avatars blend into the card.",...E.parameters?.docs?.description}}}})))()}O();export{T as ClickableOverflow,b as Default,w as KnownTotal,C as NoOverflow,E as OnACard,x as Sizes,S as Spacing,D as __namedExportsOrder,y as default};