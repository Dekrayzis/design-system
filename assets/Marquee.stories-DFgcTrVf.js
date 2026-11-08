import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{n,t as r}from"./Badge-Rh9PSFv9.js";import{_ as i,a,c as o,i as s,m as c,o as l,s as u}from"./icons-C9TAZLL5.js";import{n as d,t as f}from"./Marquee-D-qJlTz8.js";var p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{i(),n(),d(),p=t(),{expect:m,userEvent:h,waitFor:g,within:_}=__STORYBOOK_MODULE_TEST__,v=[{label:`Unreal Engine`,icon:(0,p.jsx)(l,{})},{label:`React`,icon:(0,p.jsx)(c,{})},{label:`TypeScript`,icon:(0,p.jsx)(o,{})},{label:`Blender`,icon:(0,p.jsx)(s,{})},{label:`Next.js`,icon:(0,p.jsx)(a,{})},{label:`Figma`,icon:(0,p.jsx)(u,{})}],y=({label:e,icon:t})=>(0,p.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8,fontWeight:600,color:`var(--ds-color-text-muted)`},children:[t,e]}),b={title:`Components/Marquee`,component:f,args:{label:`Tools I use`,repeat:2,children:v.map(e=>(0,p.jsx)(y,{...e},e.label))},argTypes:{children:{control:!1},duration:{control:{type:`range`,min:5,max:80}},fade:{control:{type:`range`,min:0,max:40}}},parameters:{docs:{description:{component:"An endless strip that pauses on hover and focus, has its own pause button (WCAG 2.2.2), announces its list once, and becomes a static, keyboard-scrollable strip when motion is reduced, by the system setting or a `MotionToggle`."}}}},x={play:async({canvasElement:e})=>{let t=_(e);await m(t.getAllByRole(`list`)).toHaveLength(1);let n=t.getByRole(`button`,{name:`Pause Tools I use`});await h.click(n);let r=e.querySelector(`ul`).parentElement;await g(()=>m(getComputedStyle(r).animationPlayState).toBe(`paused`))}},S={args:{reverse:!0,label:`Tools, reversed`}},C={args:{label:`Topics`,duration:25,repeat:3,gap:`var(--ds-space-3)`,children:[`Accessibility`,`Design tokens`,`Testing`,`Motion`,`Theming`,`Forms`].map(e=>(0,p.jsx)(r,{tone:`accent`,children:e},e))}},w={args:{fade:0,label:`Tools, hard edges`}},T=[`Default`,`Reverse`,`Badges`,`HardEdges`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('list')).toHaveLength(1);
    const pause = canvas.getByRole('button', {
      name: 'Pause Tools I use'
    });
    await userEvent.click(pause);
    const track = canvasElement.querySelector('ul')!.parentElement!;
    await waitFor(() => expect(getComputedStyle(track).animationPlayState).toBe('paused'));
  }
}`,...x.parameters?.docs?.source},description:{story:"A strip of tools scrolling left. It pauses on hover and focus, and the pause button (an `IconButton` with `aria-pressed`) lets touch and screen reader users stop it too. The list is announced once, because the duplicate copy and repeats are `aria-hidden`.",...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    reverse: true,
    label: 'Tools, reversed'
  }
}`,...S.parameters?.docs?.source},description:{story:"`reverse` makes the strip travel left to right, for example to run against a neighbouring marquee.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Topics',
    duration: 25,
    repeat: 3,
    gap: 'var(--ds-space-3)',
    children: ['Accessibility', 'Design tokens', 'Testing', 'Motion', 'Theming', 'Forms'].map(topic => <Badge key={topic} tone="accent">{topic}</Badge>)
  }
}`,...C.parameters?.docs?.source},description:{story:"Any content works as an item: here `Badge`s with a tighter `gap` and a shorter `duration`. A short list needs a higher `repeat` so each copy is wider than the strip and no gap opens at the seam.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    fade: 0,
    label: 'Tools, hard edges'
  }
}`,...w.parameters?.docs?.source},description:{story:"`fade={0}` removes the edge fade, for strips inside a bordered container or on a background the fade can’t blend into.",...w.parameters?.docs?.description}}}})))()}E();export{C as Badges,x as Default,w as HardEdges,S as Reverse,T as __namedExportsOrder,b as default};