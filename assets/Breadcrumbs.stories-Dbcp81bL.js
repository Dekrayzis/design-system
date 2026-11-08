import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Breadcrumbs-BkID5x6A.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),i=t(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l=[{label:`Home`,href:`#home`},{label:`Products`,href:`#products`},{label:`Laptops`,href:`#laptops`},{label:`Aero 14`}],u=[{label:`Home`,href:`#home`},{label:`Help centre`,href:`#help`},{label:`Accounts and billing`,href:`#accounts`},{label:`Payment methods`,href:`#payments`},{label:`Cards issued outside the United Kingdom`,href:`#cards`},{label:`Why was my international card declined at checkout?`}],d={title:`Components/Breadcrumbs`,component:r,args:{items:l},argTypes:{renderLink:{control:!1}},parameters:{docs:{description:{component:'A trail of links from the top level to the current page, rendered as `<nav aria-label="Breadcrumb">` around an `<ol>`, with the last item marked `aria-current="page"`. Separators are drawn in CSS, so screen readers only hear the crumbs. Use it on pages deep in a hierarchy, alongside (not instead of) the main navigation.'}}}},f={play:async({canvasElement:e})=>{let t=c(e).getByRole(`navigation`,{name:`Breadcrumb`});await a(c(t).getAllByRole(`link`)).toHaveLength(3),await a(c(t).getByText(`Aero 14`)).toHaveAttribute(`aria-current`,`page`)}},p={play:async({canvasElement:e})=>{let t=c(e).getByRole(`link`,{name:`Aero 14`});await a(t).toHaveAttribute(`aria-current`,`page`)},name:`Current page as a link`,args:{items:[...l.slice(0,3),{label:`Aero 14`,href:`#aero-14`}]}},m={args:{items:u},render:e=>(0,i.jsx)(`div`,{style:{maxWidth:`20rem`},children:(0,i.jsx)(r,{...e})})},h={play:async({canvasElement:e})=>{let t=c(e);await a(t.queryByRole(`link`,{name:`Accounts and billing`})).not.toBeInTheDocument();let n=t.getByRole(`button`,{name:`Show full breadcrumb trail`});await s.click(n),await a(t.getByRole(`link`,{name:`Help centre`})).toHaveFocus(),await a(t.getAllByRole(`listitem`)).toHaveLength(u.length)},args:{items:u,maxItems:3}},g={play:async({canvasElement:e})=>{await a(c(e).getByRole(`navigation`,{name:`Fil d’Ariane`})).toBeInTheDocument()},args:{label:`Fil d’Ariane`,items:[{label:`Accueil`,href:`#accueil`},{label:`Produits`,href:`#produits`},{label:`Ordinateurs`}]}},_={name:`Right to left`,render:e=>(0,i.jsx)(`div`,{dir:`rtl`,children:(0,i.jsx)(r,{...e})})},v=o(),y={play:async({canvasElement:e})=>{await s.click(c(e).getByRole(`link`,{name:`Products`})),await a(v).toHaveBeenCalledWith(`/products`)},name:`With router links`,args:{items:[{label:`Home`,href:`/`},{label:`Products`,href:`/products`},{label:`Laptops`}],renderLink:({item:e,href:t,...n})=>(0,i.jsx)(`a`,{...n,href:t,onClick:e=>{e.preventDefault(),v(t)}})}},b=[`Default`,`CurrentPageAsLink`,`LongTrail`,`Collapsed`,`CustomLabel`,`RightToLeft`,`WithRouterLinks`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Breadcrumb'
    });
    await expect(within(nav).getAllByRole('link')).toHaveLength(3);
    await expect(within(nav).getByText('Aero 14')).toHaveAttribute('aria-current', 'page');
  }
}`,...f.parameters?.docs?.source},description:{story:'Ancestors are links; the last item is the current page, shown as text with `aria-current="page"`.',...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const current = within(canvasElement).getByRole('link', {
      name: 'Aero 14'
    });
    await expect(current).toHaveAttribute('aria-current', 'page');
  },
  name: 'Current page as a link',
  args: {
    items: [...trail.slice(0, 3), {
      label: 'Aero 14',
      href: '#aero-14'
    }]
  }
}`,...p.parameters?.docs?.source},description:{story:'Give the last item an `href` and it renders as a link to the current page, still marked `aria-current="page"`.',...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    items: longTrail
  },
  render: args => <div style={{
    maxWidth: '20rem'
  }}>\r
      <Breadcrumbs {...args} />\r
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Long trails wrap between crumbs on narrow screens, and a very long label wraps within itself rather than overflowing.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', {
      name: 'Accounts and billing'
    })).not.toBeInTheDocument();
    const expand = canvas.getByRole('button', {
      name: 'Show full breadcrumb trail'
    });
    await userEvent.click(expand);
    await expect(canvas.getByRole('link', {
      name: 'Help centre'
    })).toHaveFocus();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(longTrail.length);
  },
  args: {
    items: longTrail,
    maxItems: 3
  }
}`,...h.parameters?.docs?.source},description:{story:'`maxItems` keeps the first item and the last `maxItems - 1`, hiding the rest behind a "…"\r\nbutton. Activating it reveals the full trail and moves focus to the first crumb it revealed.',...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('navigation', {
      name: 'Fil d’Ariane'
    })).toBeInTheDocument();
  },
  args: {
    label: 'Fil d’Ariane',
    items: [{
      label: 'Accueil',
      href: '#accueil'
    }, {
      label: 'Produits',
      href: '#produits'
    }, {
      label: 'Ordinateurs'
    }]
  }
}`,...g.parameters?.docs?.source},description:{story:"`label` renames the navigation landmark, for example to match the page language.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Right to left',
  render: args => <div dir="rtl">\r
      <Breadcrumbs {...args} />\r
    </div>
}`,..._.parameters?.docs?.source},description:{story:`In a right-to-left page the trail reads from the right and the separators point the other way.`,..._.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole('link', {
      name: 'Products'
    }));
    await expect(onNavigate).toHaveBeenCalledWith('/products');
  },
  name: 'With router links',
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Products',
      href: '/products'
    }, {
      label: 'Laptops'
    }],
    renderLink: ({
      item: _item,
      href,
      ...props
    }) => <a {...props} href={href} onClick={event => {
      event.preventDefault();
      onNavigate(href);
    }} />
  }
}`,...y.parameters?.docs?.source},description:{story:"`renderLink` swaps in your router’s link, for example\r\n`renderLink={({ item, ...props }) => <NextLink {...props} />}`. Spread the props so the styling\r\nand `aria-current` reach the link.",...y.parameters?.docs?.description}}}})))()}x();export{h as Collapsed,p as CurrentPageAsLink,g as CustomLabel,f as Default,m as LongTrail,_ as RightToLeft,y as WithRouterLinks,b as __namedExportsOrder,d as default};