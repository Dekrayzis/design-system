import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Link-Bt8k7gYv.js";import{n as a,t as o}from"./SkipLink-DnMnyzjz.js";var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{s=n(),r(),a(),c=t(),{expect:l,userEvent:u,waitFor:d,within:f}=__STORYBOOK_MODULE_TEST__,p=e=>((0,s.useEffect)(()=>{let e=e=>{e.target.closest?.(`a[href^="#"]`)&&e.preventDefault()};return document.addEventListener(`click`,e),()=>document.removeEventListener(`click`,e)},[]),(0,c.jsx)(e,{})),m={title:`Components/SkipLink`,component:o,decorators:[p],parameters:{layout:`fullscreen`,docs:{description:{component:'A “Skip to main content” link (WCAG 2.4.1) that renders an `<a href="#main">`, hidden until it receives keyboard focus. Render it as the very first focusable element on every page, and give your `<main>` the matching `id`; activating it moves keyboard focus into that element. For any other in-page link, use `Link`.'}}},render:e=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(o,{...e}),(0,c.jsx)(`header`,{style:{padding:`var(--ds-space-4)`,borderBottom:`var(--ds-border-width) solid var(--ds-color-border)`},children:(0,c.jsxs)(`nav`,{"aria-label":`Primary`,children:[(0,c.jsx)(i,{href:`#home`,variant:`subtle`,children:`Home`}),` · `,(0,c.jsx)(i,{href:`#products`,variant:`subtle`,children:`Products`}),` ·`,` `,(0,c.jsx)(i,{href:`#pricing`,variant:`subtle`,children:`Pricing`})]})}),(0,c.jsxs)(`main`,{id:`main`,style:{padding:`var(--ds-space-4)`},children:[(0,c.jsx)(`h1`,{children:`Main content`}),(0,c.jsx)(`p`,{children:`Press Tab once to reveal the skip link, then Enter to jump here.`})]})]})},h={play:async({canvasElement:e})=>{let t=f(e),n=t.getByRole(`link`,{name:`Skip to main content`});await l(n.getBoundingClientRect().width).toBeLessThanOrEqual(1),await u.tab(),await l(n).toHaveFocus(),await l(n.getBoundingClientRect().width).toBeGreaterThan(1),await u.keyboard(`{Enter}`);let r=t.getByRole(`main`);await d(()=>l(r).toHaveFocus()),await l(r).toHaveAttribute(`tabindex`,`-1`)}},g={play:async({canvasElement:e})=>{let t=f(e);await u.click(t.getByRole(`link`,{name:`Skip to search`})),await l(t.getByRole(`searchbox`,{name:`Search the shop`})).toHaveFocus()},args:{href:`#site-search`,children:`Skip to search`},render:e=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(o,{...e}),(0,c.jsxs)(`main`,{id:`main`,style:{padding:`var(--ds-space-4)`},children:[(0,c.jsx)(`h1`,{children:`Shop`}),(0,c.jsxs)(`form`,{role:`search`,onSubmit:e=>e.preventDefault(),children:[(0,c.jsx)(`label`,{htmlFor:`site-search`,children:`Search the shop`}),` `,(0,c.jsx)(`input`,{id:`site-search`,type:`search`})]})]})]})},_=[`Default`,`CustomTarget`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', {
      name: 'Skip to main content'
    });
    await expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.getBoundingClientRect().width).toBeGreaterThan(1);
    await userEvent.keyboard('{Enter}');
    const main = canvas.getByRole('main');
    await waitFor(() => expect(main).toHaveFocus());
    await expect(main).toHaveAttribute('tabindex', '-1');
  }
}`,...h.parameters?.docs?.source},description:{story:'Hidden until the first Tab press, then shown at the top left. Enter moves focus to `#main`,\r\ngiving it `tabindex="-1"` while it holds focus, so the next Tab continues from the main content.',...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', {
      name: 'Skip to search'
    }));
    await expect(canvas.getByRole('searchbox', {
      name: 'Search the shop'
    })).toHaveFocus();
  },
  args: {
    href: '#site-search',
    children: 'Skip to search'
  },
  render: args => <>\r
      <SkipLink {...args} />\r
      <main id="main" style={{
      padding: 'var(--ds-space-4)'
    }}>\r
        <h1>Shop</h1>\r
        <form role="search" onSubmit={event => event.preventDefault()}>\r
          <label htmlFor="site-search">Search the shop</label> <input id="site-search" type="search" />\r
        </form>\r
      </main>\r
    </>
}`,...g.parameters?.docs?.source},description:{story:"`href` and the link text can point somewhere else, such as a search field, when that is where most visitors want to go.",...g.parameters?.docs?.description}}}})))()}v();export{g as CustomTarget,h as Default,_ as __namedExportsOrder,m as default};