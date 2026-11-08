import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./VisuallyHidden-DTJ2aJZj.js";import{i as a,t as o}from"./Button-CksBOm96.js";import{n as ee,t as s}from"./Stack-CCsQXNDC.js";import{n as c,t as te}from"./Badge-Rh9PSFv9.js";import{i as l,n as u,r as ne,t as d}from"./Pagination-Doglj9CC.js";import{a as f,c as re,i as p,l as m,n as h,o as g,r as _,s as v,t as y}from"./Table-DXaHEhVq.js";function b(e){return Array.from({length:e},(t,n)=>({id:n+1,name:e>A.length?`${A[n%A.length]} ${Math.floor(n/A.length)+1}`:A[n],role:j[n%j.length],location:M[n*3%M.length],commits:n*7919%2400+12,joined:new Date(2018+n%7,n*5%12,1+n%27)}))}function x(e){return[...e.querySelector(`tbody`).querySelectorAll(`tr`)].map(e=>e.querySelector(`th, td`).textContent)}function S(){let[e,t]=(0,w.useState)({key:`commits`,direction:`descending`});return(0,T.jsx)(y,{caption:`Team members by commits`,columns:I,rows:m(N,I,e),getRowKey:L,sort:e,onSortChange:e=>{t(e),V(e)}})}function C(){let[e,t]=(0,w.useState)(null),[n,r]=(0,w.useState)(1),i=m(X,I,e).slice((n-1)*Y,n*Y);return(0,T.jsxs)(s,{gap:3,children:[(0,T.jsx)(y,{caption:`All contributors`,columns:I,rows:i,getRowKey:L,sort:e,onSortChange:e=>{t(e),r(1)}}),(0,T.jsxs)(s,{direction:`row`,gap:4,align:`center`,justify:`space-between`,wrap:!0,children:[(0,T.jsx)(u,{page:n,pageSize:Y,total:X.length,live:!0}),(0,T.jsx)(d,{"aria-label":`Contributors pages`,page:n,pageCount:ne(X.length,Y),onPageChange:r})]})]})}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{w=n(),c(),a(),l(),ee(),r(),re(),T=t(),{expect:E,fn:D,userEvent:O,within:k}=__STORYBOOK_MODULE_TEST__,A=[`Ada Lovelace`,`Grace Hopper`,`Alan Turing`,`Katherine Johnson`,`Linus Torvalds`,`Margaret Hamilton`,`Tim Berners-Lee`,`Radia Perlman`,`Dennis Ritchie`,`Barbara Liskov`,`Ken Thompson`,`Frances Allen`],j=[`Engineer`,`Designer`,`Researcher`,`Manager`],M=[`London`,`Leeds`,`Glasgow`,`Cardiff`,`Belfast`],N=b(6),P=new Intl.DateTimeFormat(`en-GB`,{day:`numeric`,month:`short`,year:`numeric`}),F=new Intl.NumberFormat(`en-GB`),I=[{key:`name`,header:`Name`,sortable:!0,rowHeader:!0},{key:`role`,header:`Role`,sortable:!0},{key:`location`,header:`Location`,sortable:!0},{key:`commits`,header:`Commits`,align:`end`,sortable:!0,cell:e=>F.format(e.commits)},{key:`joined`,header:`Joined`,align:`end`,sortable:!0,cell:e=>(0,T.jsx)(`time`,{dateTime:e.joined.toISOString().slice(0,10),children:P.format(e.joined)})}],L=e=>e.id,R={title:`Components/Table`,component:h,subcomponents:{DataTable:y,TableHead:f,TableBody:_,TableRow:v,TableHeader:g,TableCell:p},args:{caption:`Team members`},parameters:{docs:{description:{component:"A semantic `<table>` with a required `<caption>`, `<thead>`, `<tbody>` and scoped `<th>` headers, wrapped in a named scroll region that becomes keyboard-focusable when the table overflows, so narrow screens can scroll it without a mouse. Use `DataTable` for the common case (columns, rows, sorting, empty state) or the `Table*` primitives for full control. Reach for a list of `Card`s instead when each item is a self-contained object people scan one at a time rather than compare across columns."}}}},z={render:()=>(0,T.jsx)(y,{caption:`Team members`,columns:I.map(e=>({...e,sortable:!1})),rows:N,getRowKey:L}),play:async({canvasElement:e})=>{let t=k(e);await E(t.getByRole(`table`,{name:`Team members`})).toBeInTheDocument(),await E(t.getByRole(`region`,{name:`Team members`})).not.toHaveAttribute(`tabindex`),await E(t.getAllByRole(`columnheader`)).toHaveLength(5),await E(t.getByRole(`rowheader`,{name:`Ada Lovelace`})).toBeInTheDocument()}},B={name:`Sortable (uncontrolled)`,render:()=>(0,T.jsx)(y,{caption:`Team members`,columns:I,rows:N,getRowKey:L}),play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`columnheader`,{name:`Name`});await E(n).not.toHaveAttribute(`aria-sort`),await O.click(t.getByRole(`button`,{name:`Name`})),await E(n).toHaveAttribute(`aria-sort`,`ascending`),await E(x(e)[0]).toBe(`Ada Lovelace`),await E(t.getByRole(`status`)).toHaveTextContent(`Sorted by Name, ascending`),await O.click(t.getByRole(`button`,{name:`Name`})),await E(n).toHaveAttribute(`aria-sort`,`descending`),await E(x(e)[0]).toBe(`Margaret Hamilton`),await O.click(t.getByRole(`button`,{name:`Commits`})),await E(n).not.toHaveAttribute(`aria-sort`),await E(t.getByRole(`columnheader`,{name:`Commits`})).toHaveAttribute(`aria-sort`,`ascending`)}},V=D(),H={name:`Sortable (controlled)`,render:()=>(0,T.jsx)(S,{}),play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`columnheader`,{name:`Commits`});await E(n).toHaveAttribute(`aria-sort`,`descending`),await O.click(t.getByRole(`button`,{name:`Commits`})),await E(V).toHaveBeenLastCalledWith({key:`commits`,direction:`ascending`}),await E(n).toHaveAttribute(`aria-sort`,`ascending`);let r=[...e.querySelectorAll(`tbody tr td:nth-of-type(3)`)].map(e=>Number(e.textContent.replace(/,/g,``)));await E(r).toEqual([...r].sort((e,t)=>e-t))}},U={render:()=>(0,T.jsx)(y,{caption:`Quarterly revenue (GBP)`,density:`compact`,striped:!0,columns:[{key:`region`,header:`Region`,rowHeader:!0},{key:`q1`,header:`Q1`,align:`end`,cell:e=>F.format(e.q1)},{key:`q2`,header:`Q2`,align:`end`,cell:e=>F.format(e.q2)},{key:`q3`,header:`Q3`,align:`end`,cell:e=>F.format(e.q3)},{key:`q4`,header:`Q4`,align:`end`,cell:e=>F.format(e.q4)}],rows:[{region:`North`,q1:12450,q2:9870,q3:111200,q4:8020},{region:`South`,q1:1340,q2:21110,q3:4560,q4:117890},{region:`Wales`,q1:870,q2:990,q3:1011,q4:1450},{region:`Scotland`,q1:45210,q2:43980,q3:40120,q4:51800}],getRowKey:e=>e.region})},W={render:()=>(0,T.jsxs)(h,{caption:`Opening hours`,children:[(0,T.jsx)(f,{children:(0,T.jsxs)(v,{children:[(0,T.jsx)(g,{children:`Day`}),(0,T.jsx)(g,{children:`Opens`}),(0,T.jsx)(g,{children:`Closes`})]})}),(0,T.jsx)(_,{children:[[`Monday`,`09:00`,`17:30`],[`Wednesday`,`09:00`,`20:00`],[`Saturday`,`10:00`,`16:00`]].map(([e,t,n])=>(0,T.jsxs)(v,{children:[(0,T.jsx)(g,{scope:`row`,children:e}),(0,T.jsx)(p,{children:(0,T.jsx)(`time`,{dateTime:t,children:t})}),(0,T.jsx)(p,{children:(0,T.jsx)(`time`,{dateTime:n,children:n})})]},e))})]}),play:async({canvasElement:e})=>{let t=k(e);await E(t.getByRole(`rowheader`,{name:`Wednesday`})).toHaveAttribute(`scope`,`row`)}},G={render:()=>(0,T.jsx)(y,{caption:`Search results`,columns:I,rows:[],getRowKey:L,emptyMessage:`No team members match “Babbage”. Try a different name.`}),play:async({canvasElement:e})=>{let t=k(e).getByRole(`cell`);await E(t).toHaveAttribute(`colspan`,`5`)}},K={render:()=>(0,T.jsx)(y,{caption:`All contributors`,stickyHeader:!0,hoverable:!0,maxHeight:`18rem`,columns:I,rows:b(30),getRowKey:L})},q={name:`Narrow screen (scrolls)`,decorators:[e=>(0,T.jsx)(`div`,{style:{maxWidth:320},children:(0,T.jsx)(e,{})})],render:()=>(0,T.jsx)(y,{caption:`Team members`,columns:I,rows:N,getRowKey:L}),play:async({canvasElement:e})=>{let t=k(e).getByRole(`region`,{name:`Team members`});await E(t.scrollWidth).toBeGreaterThan(t.clientWidth),await O.tab(),await E(t).toHaveFocus()}},J={render:()=>(0,T.jsx)(y,{caption:`Team members`,columns:[{key:`name`,header:`Name`,rowHeader:!0},{key:`role`,header:`Role`,cell:e=>(0,T.jsx)(te,{tone:e.role===`Manager`?`accent`:`neutral`,children:e.role})},{key:`actions`,header:(0,T.jsx)(i,{children:`Actions`}),align:`end`,cell:e=>(0,T.jsxs)(s,{direction:`row`,gap:2,justify:`flex-end`,children:[(0,T.jsxs)(o,{size:`sm`,variant:`secondary`,children:[`Edit`,(0,T.jsxs)(i,{children:[` `,e.name]})]}),(0,T.jsxs)(o,{size:`sm`,variant:`ghost`,children:[`Remove`,(0,T.jsxs)(i,{children:[` `,e.name]})]})]})}],rows:N.slice(0,4),getRowKey:L}),play:async({canvasElement:e})=>{let t=k(e);await E(t.getByRole(`columnheader`,{name:`Actions`})).toBeInTheDocument(),await E(t.getByRole(`button`,{name:`Edit Grace Hopper`})).toBeInTheDocument()}},Y=5,X=b(23),Z={name:`With pagination (client-side)`,render:()=>(0,T.jsx)(C,{}),play:async({canvasElement:e})=>{let t=k(e);await E(x(e)[0]).toBe(`Ada Lovelace 1`),await O.click(t.getByRole(`button`,{name:`Page 2`})),await E(t.getByRole(`button`,{name:`Page 2`})).toHaveAttribute(`aria-current`,`page`),await E(x(e)[0]).toBe(`Margaret Hamilton 1`),await E(t.getByText(`Showing 6–10 of 23`)).toBeInTheDocument(),await O.click(t.getByRole(`button`,{name:`Name`})),await E(t.getByRole(`button`,{name:`Page 1`})).toHaveAttribute(`aria-current`,`page`)}},Q=[`Default`,`SortableUncontrolled`,`SortableControlled`,`NumericColumns`,`RowHeaders`,`Empty`,`StickyHeader`,`NarrowScroll`,`WithActions`,`WithPagination`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable caption="Team members" columns={columns.map(c => ({
    ...c,
    sortable: false
  }))} rows={members} getRowKey={getRowKey} />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', {
      name: 'Team members'
    })).toBeInTheDocument();
    // The whole table fits, so its scroll region adds no tab stop.
    await expect(canvas.getByRole('region', {
      name: 'Team members'
    })).not.toHaveAttribute('tabindex');
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(5);
    await expect(canvas.getByRole('rowheader', {
      name: 'Ada Lovelace'
    })).toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source},description:{story:'A `DataTable` built from `columns` and `rows`. The caption names both the table and its scroll\r\nregion, and each person\'s name is a row header (`<th scope="row">`).',...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: 'Sortable (uncontrolled)',
  render: () => <DataTable caption="Team members" columns={columns} rows={members} getRowKey={getRowKey} />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole('columnheader', {
      name: 'Name'
    });
    await expect(nameHeader).not.toHaveAttribute('aria-sort');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Name'
    }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstColumn(canvasElement)[0]).toBe('Ada Lovelace');
    await expect(canvas.getByRole('status')).toHaveTextContent('Sorted by Name, ascending');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Name'
    }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(firstColumn(canvasElement)[0]).toBe('Margaret Hamilton');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Commits'
    }));
    await expect(nameHeader).not.toHaveAttribute('aria-sort');
    await expect(canvas.getByRole('columnheader', {
      name: 'Commits'
    })).toHaveAttribute('aria-sort', 'ascending');
  }
}`,...B.parameters?.docs?.source},description:{story:"Uncontrolled sorting: the table sorts `rows` itself. Each sortable header holds a `<button>`, the\r\nsorted column's `<th>` carries `aria-sort`, and a polite status message says what changed.",...B.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: 'Sortable (controlled)',
  render: () => <ControlledTable />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const commits = canvas.getByRole('columnheader', {
      name: 'Commits'
    });
    await expect(commits).toHaveAttribute('aria-sort', 'descending');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Commits'
    }));
    await expect(reportSort).toHaveBeenLastCalledWith({
      key: 'commits',
      direction: 'ascending'
    });
    await expect(commits).toHaveAttribute('aria-sort', 'ascending');
    const cells = [...canvasElement.querySelectorAll('tbody tr td:nth-of-type(3)')].map(td => Number(td.textContent!.replace(/,/g, '')));
    await expect(cells).toEqual([...cells].sort((a, b) => a - b));
  }
}`,...H.parameters?.docs?.source},description:{story:"Controlled sorting with `sort` and `onSortChange`. The table renders rows in the order you pass,\r\nso you sort them yourself: here with the exported `sortRows`, or on the server for large data.",...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable caption="Quarterly revenue (GBP)" density="compact" striped columns={[{
    key: 'region',
    header: 'Region',
    rowHeader: true
  }, {
    key: 'q1',
    header: 'Q1',
    align: 'end',
    cell: (r: Record<string, number | string>) => numberFormat.format(r.q1 as number)
  }, {
    key: 'q2',
    header: 'Q2',
    align: 'end',
    cell: (r: Record<string, number | string>) => numberFormat.format(r.q2 as number)
  }, {
    key: 'q3',
    header: 'Q3',
    align: 'end',
    cell: (r: Record<string, number | string>) => numberFormat.format(r.q3 as number)
  }, {
    key: 'q4',
    header: 'Q4',
    align: 'end',
    cell: (r: Record<string, number | string>) => numberFormat.format(r.q4 as number)
  }]} rows={[{
    region: 'North',
    q1: 12450,
    q2: 9870,
    q3: 111200,
    q4: 8020
  }, {
    region: 'South',
    q1: 1340,
    q2: 21110,
    q3: 4560,
    q4: 117890
  }, {
    region: 'Wales',
    q1: 870,
    q2: 990,
    q3: 1011,
    q4: 1450
  }, {
    region: 'Scotland',
    q1: 45210,
    q2: 43980,
    q3: 40120,
    q4: 51800
  }]} getRowKey={r => r.region as string} />
}`,...U.parameters?.docs?.source},description:{story:"Numeric columns use `align: 'end'`: right-aligned in left-to-right languages with tabular\r\nfigures, so digits line up for comparison. Format numbers in `cell`; sorting still uses the raw\r\nvalue.",...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <Table caption="Opening hours">\r
      <TableHead>\r
        <TableRow>\r
          <TableHeader>Day</TableHeader>\r
          <TableHeader>Opens</TableHeader>\r
          <TableHeader>Closes</TableHeader>\r
        </TableRow>\r
      </TableHead>\r
      <TableBody>\r
        {[['Monday', '09:00', '17:30'], ['Wednesday', '09:00', '20:00'], ['Saturday', '10:00', '16:00']].map(([day, opens, closes]) => <TableRow key={day}>\r
            <TableHeader scope="row">{day}</TableHeader>\r
            <TableCell>\r
              <time dateTime={opens}>{opens}</time>\r
            </TableCell>\r
            <TableCell>\r
              <time dateTime={closes}>{closes}</time>\r
            </TableCell>\r
          </TableRow>)}\r
      </TableBody>\r
    </Table>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('rowheader', {
      name: 'Wednesday'
    })).toHaveAttribute('scope', 'row');
  }
}`,...W.parameters?.docs?.source},description:{story:'The composable primitives with row headers: the first cell of each row is a\r\n`<TableHeader scope="row">`, so screen readers announce "Wednesday" as they move along a row.',...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable caption="Search results" columns={columns} rows={[]} getRowKey={getRowKey} emptyMessage="No team members match “Babbage”. Try a different name." />,
  play: async ({
    canvasElement
  }) => {
    const cell = within(canvasElement).getByRole('cell');
    await expect(cell).toHaveAttribute('colspan', '5');
  }
}`,...G.parameters?.docs?.source},description:{story:`With no rows, a single full-width row explains why, instead of an empty, silent table.`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable caption="All contributors" stickyHeader hoverable maxHeight="18rem" columns={columns} rows={makeMembers(30)} getRowKey={getRowKey} />
}`,...K.parameters?.docs?.source},description:{story:"`stickyHeader` with `maxHeight` keeps the column headers in view while a long table scrolls\r\ninside its region. `hoverable` highlights the row under the pointer.",...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: 'Narrow screen (scrolls)',
  decorators: [Story => <div style={{
    maxWidth: 320
  }}><Story /></div>],
  render: () => <DataTable caption="Team members" columns={columns} rows={members} getRowKey={getRowKey} />,
  play: async ({
    canvasElement
  }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Team members'
    });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    // The region is the first tab stop, so keyboard users can reach it and scroll with arrow keys.
    await userEvent.tab();
    await expect(region).toHaveFocus();
  }
}`,...q.parameters?.docs?.source},description:{story:`On a narrow screen the table keeps its columns and scrolls sideways inside its region. The region\r
is focusable and named by the caption, so keyboard users can scroll it with the arrow keys.`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable caption="Team members" columns={[{
    key: 'name',
    header: 'Name',
    rowHeader: true
  }, {
    key: 'role',
    header: 'Role',
    cell: (m: Member) => <Badge tone={m.role === 'Manager' ? 'accent' : 'neutral'}>{m.role}</Badge>
  }, {
    key: 'actions',
    header: <VisuallyHidden>Actions</VisuallyHidden>,
    align: 'end',
    cell: (m: Member) => <Stack direction="row" gap={2} justify="flex-end">\r
              <Button size="sm" variant="secondary">\r
                Edit<VisuallyHidden> {m.name}</VisuallyHidden>\r
              </Button>\r
              <Button size="sm" variant="ghost">\r
                Remove<VisuallyHidden> {m.name}</VisuallyHidden>\r
              </Button>\r
            </Stack>
  }]} rows={members.slice(0, 4)} getRowKey={getRowKey} />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('columnheader', {
      name: 'Actions'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Edit Grace Hopper'
    })).toBeInTheDocument();
  }
}`,...J.parameters?.docs?.source},description:{story:`An actions column. Its header text is visually hidden but still names the column, and each\r
button adds the row's name off screen ("Edit Ada Lovelace") so the buttons are told apart.`,...J.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  name: 'With pagination (client-side)',
  render: () => <PagedTable />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(firstColumn(canvasElement)[0]).toBe('Ada Lovelace 1');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Page 2'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Page 2'
    })).toHaveAttribute('aria-current', 'page');
    await expect(firstColumn(canvasElement)[0]).toBe('Margaret Hamilton 1');
    await expect(canvas.getByText('Showing 6–10 of 23')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Name'
    }));
    await expect(canvas.getByRole('button', {
      name: 'Page 1'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...Z.parameters?.docs?.source},description:{story:"Client-side paging: sort the whole list with `sortRows`, slice out the current page and pair the\r\ntable with `Pagination` in button mode. The live `PaginationSummary` tells screen reader users\r\nthe rows changed, and sorting returns to page 1.",...Z.parameters?.docs?.description}}}})))()}$();export{z as Default,G as Empty,q as NarrowScroll,U as NumericColumns,W as RowHeaders,H as SortableControlled,B as SortableUncontrolled,K as StickyHeader,J as WithActions,Z as WithPagination,Q as __namedExportsOrder,R as default};