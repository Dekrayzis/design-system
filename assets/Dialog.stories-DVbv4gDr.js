import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,t as c}from"./TextField-Cpptxuig.js";import{n as l,t as u}from"./Dialog-DH6YBOAp.js";function d({triggerLabel:e,actions:t,...n}){let[r,a]=(0,f.useState)(!1),o=()=>{n.onClose(),a(!1)};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{onClick:()=>a(!0),children:e}),(0,p.jsx)(u,{...n,open:r,onClose:o,footer:t?.(o)})]})}var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{f=n(),r(),a(),s(),l(),p=t(),{expect:m,fn:h,userEvent:g,within:_}=__STORYBOOK_MODULE_TEST__,v={title:`Components/Dialog`,component:u,args:{open:!1,onClose:h(),title:`Rename project`,description:`Project names are visible to everyone in your workspace.`,size:`md`},argTypes:{open:{control:!1},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:'A modal built on the native `<dialog>` element opened with `showModal()`, which provides focus trapping, the top layer, an inert background and Escape handling. The parent owns `open`; `onClose` fires on Escape, the close button, a backdrop click (when enabled) or a `<form method="dialog">` submit, and focus returns to the trigger on close. Use it for tasks that need the user’s full attention; for messages that shouldn’t block the page, use `Alert` or `Toast`.'},story:{inline:!1,height:`420px`}}}},y={render:e=>(0,p.jsx)(d,{...e,triggerLabel:`Rename project`,actions:e=>(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{variant:`secondary`,onClick:e,children:`Cancel`}),(0,p.jsx)(i,{type:`submit`,form:`rename-form`,children:`Save`})]}),children:(0,p.jsx)(`form`,{id:`rename-form`,method:`dialog`,children:(0,p.jsx)(c,{label:`Project name`,defaultValue:`Atlas`,autoComplete:`off`})})}),play:async({canvasElement:e,args:t})=>{let n=_(e);await g.click(n.getByRole(`button`,{name:`Rename project`}));let r=_(e.ownerDocument.body).getByRole(`dialog`,{name:`Rename project`});await m(r).toHaveAttribute(`open`),await m(r).toContainElement(e.ownerDocument.activeElement),await g.keyboard(`{Escape}`),await m(t.onClose).toHaveBeenCalled()}},b={play:async({canvasElement:e,args:t})=>{let n=_(e),r=n.getByRole(`button`,{name:`Delete project`});await g.click(r);let i=n.getByRole(`dialog`,{name:`Delete “Atlas”?`});await m(_(i).queryByRole(`button`,{name:`Close`})).not.toBeInTheDocument(),await g.click(_(i).getByRole(`button`,{name:`Keep project`})),await m(t.onClose).toHaveBeenCalled(),await m(i).not.toHaveAttribute(`open`),await m(r).toHaveFocus()},args:{title:`Delete “Atlas”?`,description:`This permanently removes the project, its 14 files and all comments. You can’t undo this.`,size:`sm`,hideCloseButton:!0},render:e=>(0,p.jsx)(d,{...e,triggerLabel:`Delete project`,actions:e=>(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{variant:`secondary`,onClick:e,children:`Keep project`}),(0,p.jsx)(i,{variant:`danger`,onClick:e,children:`Delete project`})]})})},x={play:async({canvasElement:e,args:t})=>{let n=_(e);await g.click(n.getByRole(`button`,{name:`Read the terms`}));let r=n.getByRole(`dialog`,{name:`Terms of service`});await m(r.scrollHeight).toBeLessThanOrEqual(r.clientHeight);let i=_(r).getByText(/^Section 1\./).closest(`div`).parentElement;await m(i.scrollHeight).toBeGreaterThan(i.clientHeight);let a=_(r).getByRole(`button`,{name:`Done`});await m(a.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight),await g.click(r,{pointerEventsCheck:0}),await m(t.onClose).toHaveBeenCalled()},args:{title:`Terms of service`,description:void 0,size:`lg`,closeOnBackdropClick:!0},render:e=>(0,p.jsx)(d,{...e,triggerLabel:`Read the terms`,actions:e=>(0,p.jsx)(i,{onClick:e,children:`Done`}),children:(0,p.jsx)(o,{gap:3,children:Array.from({length:12},(e,t)=>(0,p.jsxs)(`p`,{style:{margin:0},children:[`Section `,t+1,`. The body scrolls while the header and footer stay put, so the actions are always reachable. Click the backdrop or press Escape to close this one.`]},t))})})},S=[`Default`,`Destructive`,`LongContent`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <DialogDemo {...args} triggerLabel="Rename project" actions={close => <>\r
          <Button variant="secondary" onClick={close}>Cancel</Button>\r
          <Button type="submit" form="rename-form">Save</Button>\r
        </>}>\r
      <form id="rename-form" method="dialog">\r
        <TextField label="Project name" defaultValue="Atlas" autoComplete="off" />\r
      </form>\r
    </DialogDemo>,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Rename project'
    }));

    // The dialog renders in the top layer, outside the story canvas.
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog', {
      name: 'Rename project'
    });
    // Assert behaviour, not paint: the entry animation can be paused in background tabs.
    await expect(dialog).toHaveAttribute('open');
    await expect(dialog).toContainElement(canvasElement.ownerDocument.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalled();
  }
}`,...y.parameters?.docs?.source},description:{story:'A form dialog. Save submits a `<form method="dialog">` linked through its `form` attribute, which\r\ncloses the dialog and reports through `onClose`. Focus moves into the dialog on open, Escape\r\ncloses it, and backdrop clicks are ignored by default so a stray click doesn’t lose typed input.',...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Delete project'
    });
    await userEvent.click(trigger);
    const dialog = canvas.getByRole('dialog', {
      name: 'Delete “Atlas”?'
    });
    await expect(within(dialog).queryByRole('button', {
      name: 'Close'
    })).not.toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', {
      name: 'Keep project'
    }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(dialog).not.toHaveAttribute('open');
    await expect(trigger).toHaveFocus();
  },
  args: {
    title: 'Delete “Atlas”?',
    description: 'This permanently removes the project, its 14 files and all comments. You can’t undo this.',
    size: 'sm',
    hideCloseButton: true
  },
  render: args => <DialogDemo {...args} triggerLabel="Delete project" actions={close => <>\r
          <Button variant="secondary" onClick={close}>Keep project</Button>\r
          <Button variant="danger" onClick={close}>Delete project</Button>\r
        </>} />
}`,...b.parameters?.docs?.source},description:{story:"A small confirmation for an irreversible action, using a `danger` button. `hideCloseButton`\r\nremoves the × because ‘Keep project’ already cancels, and focus returns to the trigger after\r\nclosing.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Read the terms'
    }));
    const dialog = canvas.getByRole('dialog', {
      name: 'Terms of service'
    });
    // Long content scrolls inside the body only: the dialog itself must never scroll (that gave
    // a second scrollbar), and the footer action stays on screen.
    await expect(dialog.scrollHeight).toBeLessThanOrEqual(dialog.clientHeight);
    const body = within(dialog).getByText(/^Section 1\\./).closest('div')!.parentElement!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    const done = within(dialog).getByRole('button', {
      name: 'Done'
    });
    await expect(done.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    // closeOnBackdropClick: a click on the dialog element itself (the backdrop) closes it.
    await userEvent.click(dialog, {
      pointerEventsCheck: 0
    });
    await expect(args.onClose).toHaveBeenCalled();
  },
  args: {
    title: 'Terms of service',
    description: undefined,
    size: 'lg',
    closeOnBackdropClick: true
  },
  render: args => <DialogDemo {...args} triggerLabel="Read the terms" actions={close => <Button onClick={close}>Done</Button>}>\r
      <Stack gap={3}>\r
        {Array.from({
        length: 12
      }, (_, i) => <p key={i} style={{
        margin: 0
      }}>\r
            Section {i + 1}. The body scrolls while the header and footer stay put, so the actions are always\r
            reachable. Click the backdrop or press Escape to close this one.\r
          </p>)}\r
      </Stack>\r
    </DialogDemo>
}`,...x.parameters?.docs?.source},description:{story:`Long content scrolls inside the body while the header and footer stay put, so the actions remain\r
reachable. \`closeOnBackdropClick\` is on here, which suits a read-only dialog with no input to\r
lose.`,...x.parameters?.docs?.description}}}})))()}C();export{y as Default,b as Destructive,x as LongContent,S as __namedExportsOrder,v as default};