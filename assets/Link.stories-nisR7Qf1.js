import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Stack-CCsQXNDC.js";import{n as a,r as o,t as s}from"./Link-Bt8k7gYv.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{c=n(),r(),a(),l=t(),{expect:u,fn:d,userEvent:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Link`,component:s,args:{href:`https://example.com/docs`,children:`read the documentation`},argTypes:{variant:{control:`inline-radio`,options:[`default`,`subtle`]},external:{control:`boolean`}},parameters:{docs:{description:{component:"An inline text link that renders a real `<a href>`, underlined so it never relies on colour alone. Use `LinkButton` when navigation should look like a button, and `Button` for actions on the current page. For router links, put `linkClassName()` on your router’s own link component."}}}},h={play:async({canvasElement:e})=>{let t=p(e).getByRole(`link`,{name:`read the documentation`});await u(t).toHaveAttribute(`href`,`https://example.com/docs`),await f.tab(),await u(t).toHaveFocus()},render:e=>(0,l.jsxs)(`p`,{children:[`Before you start, `,(0,l.jsx)(s,{...e}),` for the full setup guide.`]})},g={args:{variant:`subtle`,href:`https://example.com/terms`,children:`terms of service`},render:e=>(0,l.jsxs)(`p`,{children:[`By continuing you agree to our `,(0,l.jsx)(s,{...e}),`.`]})},_={render:()=>(0,l.jsxs)(i,{gap:2,children:[(0,l.jsxs)(`p`,{children:[`Default: `,(0,l.jsx)(s,{href:`https://example.com/pricing`,children:`see pricing`})]}),(0,l.jsxs)(`p`,{children:[`Subtle: `,(0,l.jsx)(s,{href:`https://example.com/pricing`,variant:`subtle`,children:`see pricing`})]})]})},v={play:async({canvasElement:e})=>{let t=p(e).getByRole(`link`,{name:`React documentation (opens in a new tab)`});await u(t).toHaveAttribute(`target`,`_blank`),await u(t).toHaveAttribute(`rel`,`noopener noreferrer`)},args:{href:`https://react.dev`,external:!0,children:`React documentation`},render:e=>(0,l.jsxs)(`p`,{children:[`Hooks are covered in the `,(0,l.jsx)(s,{...e}),`.`]})},y={args:{href:`https://example.com/a/very/long/path`,children:`https://example.com/guides/getting-started/installing-the-design-system-in-a-monorepo`},render:e=>(0,l.jsxs)(`p`,{style:{maxWidth:`16rem`},children:[`Full guide: `,(0,l.jsx)(s,{...e})]})},b=(0,c.forwardRef)(function({onNavigate:e,href:t=``,onClick:n,...r},i){return(0,l.jsx)(`a`,{ref:i,href:t,onClick:r=>{n?.(r),r.preventDefault(),e(t)},...r})}),x=d(),S={play:async({canvasElement:e})=>{let t=p(e).getByRole(`link`,{name:`account settings`});await u(t).toHaveClass(o().split(` `)[0]),await f.click(t),await u(x).toHaveBeenCalledWith(`/settings`)},name:`With a router link`,render:()=>(0,l.jsxs)(`p`,{children:[`Change your password in`,` `,(0,l.jsx)(b,{href:`/settings`,className:o(),onNavigate:x,children:`account settings`}),`.`]})},C=[`Default`,`Subtle`,`Variants`,`External`,`LongText`,`WithRouterLink`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'read the documentation'
    });
    await expect(link).toHaveAttribute('href', 'https://example.com/docs');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  render: args => <p>\r
      Before you start, <Link {...args} /> for the full setup guide.\r
    </p>
}`,...h.parameters?.docs?.source},description:{story:`A link inside running text. It is underlined and uses the accent text colour, and it is reached with Tab like any other link.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'subtle',
    href: 'https://example.com/terms',
    children: 'terms of service'
  },
  render: args => <p>\r
      By continuing you agree to our <Link {...args} />.\r
    </p>
}`,...g.parameters?.docs?.source},description:{story:"`subtle` takes the surrounding text colour and keeps the underline, for footers, metadata and\r\ndense lists where accent-coloured links would be too loud.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={2}>\r
      <p>\r
        Default: <Link href="https://example.com/pricing">see pricing</Link>\r
      </p>\r
      <p>\r
        Subtle: <Link href="https://example.com/pricing" variant="subtle">see pricing</Link>\r
      </p>\r
    </Stack>
}`,..._.parameters?.docs?.source},description:{story:`Both variants side by side, so the difference in emphasis is easy to compare.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'React documentation (opens in a new tab)'
    });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
  args: {
    href: 'https://react.dev',
    external: true,
    children: 'React documentation'
  },
  render: args => <p>\r
      Hooks are covered in the <Link {...args} />.\r
    </p>
}`,...v.parameters?.docs?.source},description:{story:'`external` opens the page in a new tab with `rel="noopener noreferrer"`, adds an icon and tells\r\nscreen reader users "(opens in a new tab)". Change that text with `externalLabel`.',...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    href: 'https://example.com/a/very/long/path',
    children: 'https://example.com/guides/getting-started/installing-the-design-system-in-a-monorepo'
  },
  render: args => <p style={{
    maxWidth: '16rem'
  }}>\r
      Full guide: <Link {...args} />\r
    </p>
}`,...y.parameters?.docs?.source},description:{story:`A long link wraps inside narrow containers instead of overflowing them.`,...y.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'account settings'
    });
    await expect(link).toHaveClass(linkClassName().split(' ')[0]!);
    await userEvent.click(link);
    await expect(onNavigate).toHaveBeenCalledWith('/settings');
  },
  name: 'With a router link',
  render: () => <p>\r
      Change your password in{' '}\r
      <RouterLink href="/settings" className={linkClassName()} onNavigate={onNavigate}>\r
        account settings\r
      </RouterLink>\r
      .\r
    </p>
}`,...S.parameters?.docs?.source},description:{story:'With a router, keep its link component and give it `className={linkClassName()}` (optionally\r\nwith a `variant`), for example `<NextLink href="/settings" className={linkClassName()}>`. It\r\nlooks the same as `Link` and keeps client-side navigation.',...S.parameters?.docs?.description}}}})))()}w();export{h as Default,v as External,y as LongText,g as Subtle,_ as Variants,S as WithRouterLink,C as __namedExportsOrder,m as default};