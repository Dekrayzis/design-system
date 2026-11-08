import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,t as r}from"./Button-CksBOm96.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";import{n as o,t as s}from"./IconButton-DL3_kfGg.js";import{n as c,t as l}from"./Avatar-DvWWUtF0.js";import{n as u,r as d,t as f}from"./Card-RSkRbbOw.js";import{n as p,t as m}from"./Heading-Dt4BQF7u.js";import{n as h,t as g}from"./Badge-Rh9PSFv9.js";import{_,s as v}from"./icons-C9TAZLL5.js";var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{_(),c(),h(),n(),p(),o(),i(),d(),y=t(),{expect:b,fn:x,within:S}=__STORYBOOK_MODULE_TEST__,C={title:`Components/Card`,component:f,subcomponents:{CardLink:u},args:{padding:`md`,elevation:`flat`},argTypes:{as:{control:`inline-radio`,options:[`article`,`section`,`div`,`li`]},padding:{control:`inline-radio`,options:[`none`,`sm`,`md`,`lg`]},elevation:{control:`inline-radio`,options:[`flat`,`raised`]}},decorators:[e=>(0,y.jsx)(`div`,{style:{maxWidth:380},children:(0,y.jsx)(e,{})})],parameters:{docs:{description:{component:"A surface that groups related content, rendered as a `<div>` by default or as an `article`, `section` or `li` through `as`. Choose the element by meaning: `article` for self-contained content, `section` for a headed part of the page, `li` inside a list. To make a whole card clickable, set `interactive` and put a `CardLink` in its heading instead of wrapping the card in a link."}}}},w={args:{as:`section`,"aria-labelledby":`usage-heading`,children:(0,y.jsxs)(a,{gap:2,children:[(0,y.jsx)(m,{level:2,size:`lg`,id:`usage-heading`,children:`Usage this month`}),(0,y.jsx)(`p`,{style:{margin:0,color:`var(--ds-color-text-muted)`},children:`You’ve used 7,420 of 10,000 API calls. The counter resets on 1 November.`})]})}},T={args:{...w.args,elevation:`raised`}},E={play:async({canvasElement:e})=>{let t=S(e),n=t.getByRole(`link`,{name:`Design tokens that scale`}),r=t.getByRole(`button`,{name:`Save to favourites`});await b(n).not.toContainElement(r);let i=r.getBoundingClientRect(),a=e.ownerDocument.elementFromPoint(i.left+i.width/2,i.top+i.height/2);await b(r.contains(a)).toBe(!0)},name:`Clickable card with inner actions`,render:()=>(0,y.jsx)(f,{as:`article`,interactive:!0,elevation:`raised`,children:(0,y.jsxs)(a,{gap:3,children:[(0,y.jsxs)(a,{direction:`row`,justify:`space-between`,align:`center`,children:[(0,y.jsx)(g,{tone:`accent`,children:`Guide`}),(0,y.jsx)(s,{label:`Save to favourites`,icon:(0,y.jsx)(v,{}),size:`sm`,onClick:x()})]}),(0,y.jsx)(m,{level:3,size:`lg`,children:(0,y.jsx)(u,{href:`https://example.com/articles/design-tokens`,children:`Design tokens that scale`})}),(0,y.jsx)(`p`,{style:{margin:0,color:`var(--ds-color-text-muted)`},children:`How to split primitives from semantic tokens so a theme only touches one layer.`}),(0,y.jsxs)(a,{direction:`row`,gap:2,align:`center`,children:[(0,y.jsx)(l,{name:`Sam Rivera`,size:`sm`,decorative:!0}),(0,y.jsxs)(`span`,{style:{fontSize:14},children:[`Sam Rivera · `,(0,y.jsx)(`time`,{dateTime:`2026-10-02`,children:`2 Oct 2026`})]})]})]})})},D={decorators:[e=>(0,y.jsx)(`div`,{style:{maxWidth:`none`},children:(0,y.jsx)(e,{})})],render:()=>(0,y.jsx)(`ul`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(220px, 1fr))`,gap:16,padding:0,margin:0},children:[`Starter`,`Team`,`Enterprise`].map(e=>(0,y.jsx)(f,{as:`li`,elevation:`raised`,children:(0,y.jsxs)(a,{gap:3,children:[(0,y.jsx)(m,{level:3,size:`lg`,children:e}),(0,y.jsxs)(r,{variant:e===`Team`?`primary`:`secondary`,fullWidth:!0,children:[`Choose `,e]})]})},e))})},O=[`Default`,`Raised`,`ClickableWithActions`,`Grid`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'section',
    'aria-labelledby': 'usage-heading',
    children: <Stack gap={2}>\r
        <Heading level={2} size="lg" id="usage-heading">Usage this month</Heading>\r
        <p style={{
        margin: 0,
        color: 'var(--ds-color-text-muted)'
      }}>\r
          You’ve used 7,420 of 10,000 API calls. The counter resets on 1 November.\r
        </p>\r
      </Stack>
  }
}`,...w.parameters?.docs?.source},description:{story:'A flat card rendered `as="section"` and labelled by its heading through `aria-labelledby`, so it\r\nis exposed as a named region.',...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    elevation: 'raised'
  }
}`,...T.parameters?.docs?.source},description:{story:'The same card with `elevation="raised"`, which adds a shadow on top of the border.',...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', {
      name: 'Design tokens that scale'
    });
    const save = canvas.getByRole('button', {
      name: 'Save to favourites'
    });
    // The inner action isn't nested in the stretched link, and sits above its overlay:
    // the element at the button's centre must be the button itself.
    await expect(link).not.toContainElement(save);
    const box = save.getBoundingClientRect();
    const hit = canvasElement.ownerDocument.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    await expect(save.contains(hit)).toBe(true);
  },
  name: 'Clickable card with inner actions',
  render: () => <Card as="article" interactive elevation="raised">\r
      <Stack gap={3}>\r
        <Stack direction="row" justify="space-between" align="center">\r
          <Badge tone="accent">Guide</Badge>\r
          <IconButton label="Save to favourites" icon={<HeartIcon />} size="sm" onClick={fn()} />\r
        </Stack>\r
        <Heading level={3} size="lg">\r
          <CardLink href="https://example.com/articles/design-tokens">Design tokens that scale</CardLink>\r
        </Heading>\r
        <p style={{
        margin: 0,
        color: 'var(--ds-color-text-muted)'
      }}>\r
          How to split primitives from semantic tokens so a theme only touches one layer.\r
        </p>\r
        <Stack direction="row" gap={2} align="center">\r
          <Avatar name="Sam Rivera" size="sm" decorative />\r
          <span style={{
          fontSize: 14
        }}>Sam Rivera · <time dateTime="2026-10-02">2 Oct 2026</time></span>\r
        </Stack>\r
      </Stack>\r
    </Card>
}`,...E.parameters?.docs?.source},description:{story:"An `interactive` card whose `CardLink` stretches its hit area over the whole card and lifts it on\r\nhover. The like button stays a separate control layered above the link, so nothing interactive is\r\nnested inside it.",...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    maxWidth: 'none'
  }}><Story /></div>],
  render: () => <ul style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
    padding: 0,
    margin: 0
  }}>\r
      {['Starter', 'Team', 'Enterprise'].map(plan => <Card key={plan} as="li" elevation="raised">\r
          <Stack gap={3}>\r
            <Heading level={3} size="lg">{plan}</Heading>\r
            <Button variant={plan === 'Team' ? 'primary' : 'secondary'} fullWidth>\r
              Choose {plan}\r
            </Button>\r
          </Stack>\r
        </Card>)}\r
    </ul>
}`,...D.parameters?.docs?.source},description:{story:'Cards rendered `as="li"` inside a `<ul>` grid, so screen readers announce the plans as a list and\r\ngive its length.',...D.parameters?.docs?.description}}}})))()}k();export{E as ClickableWithActions,w as Default,D as Grid,T as Raised,O as __namedExportsOrder,C as default};