import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Stack-CCsQXNDC.js";import{i as a,n as o,t as s}from"./Pagination-Doglj9CC.js";function c({initialPage:e,...t}){let[n,r]=(0,d.useState)(e);return(0,f.jsx)(s,{...t,page:n,getHref:e=>`?page=${e}`,onPageChange:(e,t)=>{t.preventDefault(),r(e)}})}function l({initialPage:e=1,pageCount:t=12}){let[n,r]=(0,d.useState)(e);return(0,f.jsx)(s,{page:n,pageCount:t,onPageChange:r})}function u(){let[e,t]=(0,d.useState)(2);return(0,f.jsxs)(i,{direction:`row`,gap:4,align:`center`,justify:`space-between`,wrap:!0,children:[(0,f.jsx)(o,{page:e,pageSize:20,total:312,live:!0}),(0,f.jsx)(s,{page:e,pageCount:16,onPageChange:t,"aria-label":`Results pages`})]})}var d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{d=n(),r(),a(),f=t(),{expect:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g={title:`Components/Pagination`,component:s,args:{page:4,pageCount:20,getHref:e=>`?page=${e}`},argTypes:{getHref:{control:!1},onPageChange:{control:!1}},parameters:{docs:{description:{component:'Page navigation: a `<nav aria-label="Pagination">` holding a list of page links, with `aria-current="page"` on the current one and ellipses for long ranges. Use link mode (`getHref`) when each page has its own URL, so pages can be shared, bookmarked and crawled; use button mode (`onPageChange`) for client-side paging that does not change the URL, such as a table. For an endless feed, a "Load more" button is often kinder than pages.'}}}},_={render:()=>(0,f.jsx)(c,{initialPage:4,pageCount:20}),play:async({canvasElement:e})=>{let t=h(e);await p(t.getByRole(`navigation`,{name:`Pagination`})).toBeInTheDocument(),await p(t.getByRole(`link`,{name:`Page 4`})).toHaveAttribute(`aria-current`,`page`),await p(t.getByRole(`link`,{name:`Page 5`})).toHaveAttribute(`href`,`?page=5`),await m.click(t.getByRole(`link`,{name:`Page 5`})),await p(t.getByRole(`link`,{name:`Page 5`})).toHaveAttribute(`aria-current`,`page`),await p(t.getByRole(`link`,{name:`Page 4`})).not.toHaveAttribute(`aria-current`)}},v={render:()=>(0,f.jsx)(l,{initialPage:10,pageCount:12}),play:async({canvasElement:e})=>{let t=h(e);await p(t.queryByRole(`link`)).not.toBeInTheDocument();let n=t.getByRole(`button`,{name:`Next`});await m.click(n),await p(t.getByRole(`button`,{name:`Page 11`})).toHaveAttribute(`aria-current`,`page`),await m.click(n),await p(t.getByRole(`button`,{name:`Page 12`})).toHaveAttribute(`aria-current`,`page`),await p(n).toHaveAttribute(`aria-disabled`,`true`),await p(n).toHaveFocus(),await m.click(t.getByRole(`button`,{name:`Previous`})),await p(t.getByRole(`button`,{name:`Page 11`})).toHaveAttribute(`aria-current`,`page`)}},y={args:{page:2,pageCount:5},play:async({canvasElement:e})=>{let t=h(e);await p(t.getAllByRole(`link`,{name:/^Page \d$/})).toHaveLength(5),await p(t.queryByText(`…`)).not.toBeInTheDocument()}},b={render:()=>(0,f.jsxs)(i,{gap:4,children:[(0,f.jsx)(c,{initialPage:50,pageCount:100,"aria-label":`Default range`}),(0,f.jsx)(c,{initialPage:50,pageCount:100,siblingCount:2,boundaryCount:2,"aria-label":`Wider range`})]}),play:async({canvasElement:e})=>{let t=h(e).getByRole(`navigation`,{name:`Default range`});await p([...t.querySelectorAll(`li`)].map(e=>e.textContent)).toEqual([`Previous`,`1`,`…`,`49`,`50`,`51`,`…`,`100`,`Next`]),await p(h(t).getAllByRole(`listitem`).map(e=>e.textContent)).toEqual([`Previous`,`1`,`49`,`50`,`51`,`100`,`Next`])}},x={args:{page:1},play:async({canvasElement:e})=>{let t=h(e);await p(t.queryByRole(`link`,{name:`Previous`})).not.toBeInTheDocument(),await p(t.getByRole(`link`,{name:`Next`})).toHaveAttribute(`href`,`?page=2`)}},S={args:{page:20},play:async({canvasElement:e})=>{let t=h(e);await p(t.queryByRole(`link`,{name:`Next`})).not.toBeInTheDocument(),await p(t.getByRole(`link`,{name:`Page 20`})).toHaveAttribute(`aria-current`,`page`)}},C={render:()=>(0,f.jsx)(u,{}),play:async({canvasElement:e})=>{let t=h(e);await p(t.getByRole(`status`)).toHaveTextContent(`Showing 21–40 of 312`),await m.click(t.getByRole(`button`,{name:`Page 3`})),await p(t.getByRole(`status`)).toHaveTextContent(`Showing 41–60 of 312`)}},w=[`LinkMode`,`ButtonMode`,`FewPages`,`ManyPages`,`FirstPage`,`LastPage`,`WithSummary`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <RoutedPagination initialPage={4} pageCount={20} />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', {
      name: 'Pagination'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Page 4'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Page 5'
    })).toHaveAttribute('href', '?page=5');
    await userEvent.click(canvas.getByRole('link', {
      name: 'Page 5'
    }));
    await expect(canvas.getByRole('link', {
      name: 'Page 5'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Page 4'
    })).not.toHaveAttribute('aria-current');
  }
}`,..._.parameters?.docs?.source},description:{story:"Link mode: every page is a real `<a href>` built by `getHref`, so open in new tab, history and\r\ncrawling work. Clicking a page here is intercepted, as a client-side router would do.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonPagination initialPage={10} pageCount={12} />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    const next = canvas.getByRole('button', {
      name: 'Next'
    });
    await userEvent.click(next);
    await expect(canvas.getByRole('button', {
      name: 'Page 11'
    })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(next);
    await expect(canvas.getByRole('button', {
      name: 'Page 12'
    })).toHaveAttribute('aria-current', 'page');
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Previous'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Page 11'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...v.parameters?.docs?.source},description:{story:"Button mode: pages are `<button>`s that call `onPageChange`, for paging that does not change the\r\nURL. On the last page, Next stays focusable with `aria-disabled`, so keyboard focus is not lost.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    page: 2,
    pageCount: 5
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link', {
      name: /^Page \\d$/
    })).toHaveLength(5);
    await expect(canvas.queryByText('…')).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source},description:{story:`With only a few pages, every page is listed and no ellipsis is needed.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={4}>\r
      <RoutedPagination initialPage={50} pageCount={100} aria-label="Default range" />\r
      <RoutedPagination initialPage={50} pageCount={100} siblingCount={2} boundaryCount={2} aria-label="Wider range" />\r
    </Stack>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const navElement = canvas.getByRole('navigation', {
      name: 'Default range'
    });
    // On screen: both ellipses.
    await expect([...navElement.querySelectorAll('li')].map(li => li.textContent)).toEqual(['Previous', '1', '…', '49', '50', '51', '…', '100', 'Next']);
    // To assistive tech: the ellipses are hidden, the numbers carry the meaning.
    await expect(within(navElement).getAllByRole('listitem').map(li => li.textContent)).toEqual(['Previous', '1', '49', '50', '51', '100', 'Next']);
  }
}`,...b.parameters?.docs?.source},description:{story:"Many pages collapse into ellipses: `boundaryCount` pages at each end and `siblingCount` either\r\nside of the current page. The ellipses are hidden from screen readers, since the numbers around\r\nthem already say which pages are skipped.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    page: 1
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', {
      name: 'Previous'
    })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Next'
    })).toHaveAttribute('href', '?page=2');
  }
}`,...x.parameters?.docs?.source},description:{story:`On the first page there is no previous page, so in link mode Previous is a greyed placeholder\r
rather than a link: it keeps the layout steady and is hidden from assistive tech.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    page: 20
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('link', {
      name: 'Next'
    })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Page 20'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...S.parameters?.docs?.source},description:{story:`The last page mirrors the first: Next becomes a placeholder and the last page is current.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <WithSummaryExample />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 21–40 of 312');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Page 3'
    }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 41–60 of 312');
  }
}`,...C.parameters?.docs?.source},description:{story:'`PaginationSummary` says which items are showing, such as "Showing 21–40 of 312". With `live` it\r\nis a polite status message, so client-side page changes are announced.',...C.parameters?.docs?.description}}}})))()}T();export{v as ButtonMode,y as FewPages,x as FirstPage,S as LastPage,_ as LinkMode,b as ManyPages,C as WithSummary,w as __namedExportsOrder,g as default};