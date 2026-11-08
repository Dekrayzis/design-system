import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{i as r,t as i}from"./Button-CksBOm96.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,t as c}from"./Alert-Cx_Iv1Jn.js";var l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{l=n(),r(),a(),s(),u=t(),{expect:d,fn:f,userEvent:p,within:m}=__STORYBOOK_MODULE_TEST__,h={title:`Components/Alert`,component:c,args:{tone:`info`,title:`A new version is available`,children:`Reload the page to get the latest features and fixes.`,live:`off`},argTypes:{tone:{control:`inline-radio`,options:[`info`,`success`,`warning`,`danger`]},live:{control:`inline-radio`,options:[`polite`,`assertive`,`off`]}},decorators:[e=>(0,u.jsx)(`div`,{style:{maxWidth:560},children:(0,u.jsx)(e,{})})],parameters:{docs:{description:{component:'An inline message about the state of the page or a task, rendered as a `<div>` with a tone icon, an optional title, actions and a dismiss button. Info and success alerts are polite live regions (`role="status"`) and warning and danger alerts assertive ones (`role="alert"`); set `live="off"` for alerts already present when the page loads. Use it for messages tied to a place on the page; for brief confirmations that float above the page, use `Toast`.'}}}},g={},_={render:()=>(0,u.jsxs)(o,{gap:3,children:[(0,u.jsx)(c,{live:`off`,tone:`info`,title:`Heads up`,children:`Maintenance is scheduled for Sunday at 02:00 UTC.`}),(0,u.jsx)(c,{live:`off`,tone:`success`,title:`Payment received`,children:`Your invoice has been emailed to you.`}),(0,u.jsx)(c,{live:`off`,tone:`warning`,title:`Storage almost full`,children:`You’ve used 92% of your 10 GB.`}),(0,u.jsx)(c,{live:`off`,tone:`danger`,title:`Couldn’t save changes`,children:`Check your connection and try again.`})]})},v={play:async({canvasElement:e})=>{let t=m(e);await d(t.getByText(`Upload failed`)).toBeVisible(),await d(t.getByRole(`button`,{name:`Choose another file`})).toBeVisible()},args:{tone:`danger`,title:`Upload failed`,children:`report-q3.pdf exceeds the 25 MB limit.`,actions:(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{size:`sm`,variant:`secondary`,children:`Choose another file`}),(0,u.jsx)(i,{size:`sm`,variant:`ghost`,children:`Learn more`})]})}},y={play:async({canvasElement:e,args:t})=>{let n=m(e);await p.click(n.getByRole(`button`,{name:`Dismiss`})),await d(t.onDismiss).toHaveBeenCalledTimes(1),await d(n.queryByText(`A new version is available`)).not.toBeInTheDocument(),await p.click(n.getByRole(`button`,{name:`Show alert again`})),await d(n.getByText(`A new version is available`)).toBeVisible()},args:{onDismiss:f()},render:function(e){let[t,n]=(0,l.useState)(!0);return t?(0,u.jsx)(c,{...e,onDismiss:()=>{e.onDismiss?.(),n(!1)}}):(0,u.jsx)(i,{variant:`secondary`,onClick:()=>n(!0),children:`Show alert again`})}},b={args:{tone:`success`,title:`Settings saved`,children:void 0}},x=[`Default`,`Tones`,`WithActions`,`Dismissible`,`TitleOnly`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source},description:{story:'An info alert with a title and body. These stories set `live="off"` because the alert is on the\r\npage from the start; leave `live` unset for alerts that appear in response to something, so they\r\nare announced.',...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap={3}>\r
      <Alert live="off" tone="info" title="Heads up">Maintenance is scheduled for Sunday at 02:00 UTC.</Alert>\r
      <Alert live="off" tone="success" title="Payment received">Your invoice has been emailed to you.</Alert>\r
      <Alert live="off" tone="warning" title="Storage almost full">You’ve used 92% of your 10 GB.</Alert>\r
      <Alert live="off" tone="danger" title="Couldn’t save changes">Check your connection and try again.</Alert>\r
    </Stack>
}`,..._.parameters?.docs?.source},description:{story:"The four tones, each with its own colour and icon. The icon is decorative (`aria-hidden`), so the\r\ntitle and text must carry the meaning on their own.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Upload failed')).toBeVisible();
    await expect(canvas.getByRole('button', {
      name: 'Choose another file'
    })).toBeVisible();
  },
  args: {
    tone: 'danger',
    title: 'Upload failed',
    children: 'report-q3.pdf exceeds the 25 MB limit.',
    actions: <>\r
        <Button size="sm" variant="secondary">Choose another file</Button>\r
        <Button size="sm" variant="ghost">Learn more</Button>\r
      </>
  }
}`,...v.parameters?.docs?.source},description:{story:"Pass buttons through `actions` to offer a next step, such as choosing another file. They render\r\nunder the message, inside the alert.",...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Dismiss'
    }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    await expect(canvas.queryByText('A new version is available')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Show alert again'
    }));
    await expect(canvas.getByText('A new version is available')).toBeVisible();
  },
  args: {
    onDismiss: fn()
  },
  render: function Render(args) {
    const [visible, setVisible] = useState(true);
    if (!visible) return <Button variant="secondary" onClick={() => setVisible(true)}>Show alert again</Button>;
    return <Alert {...args} onDismiss={() => {
      args.onDismiss?.();
      setVisible(false);
    }} />;
  }
}`,...y.parameters?.docs?.source},description:{story:"Providing `onDismiss` adds a ‘Dismiss’ icon button. The alert doesn’t hide itself: the parent\r\nowns its visibility, as this story does with local state.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'success',
    title: 'Settings saved',
    children: undefined
  }
}`,...b.parameters?.docs?.source},description:{story:"A short confirmation with only a `title` and no body text.",...b.parameters?.docs?.description}}}})))()}S();export{g as Default,y as Dismissible,b as TitleOnly,_ as Tones,v as WithActions,x as __namedExportsOrder,h as default};