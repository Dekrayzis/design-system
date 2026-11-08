import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{n as r,t as i}from"./Spinner-DSlmNbGE.js";import{n as a,t as o}from"./Stack-CCsQXNDC.js";import{n as s,t as c}from"./ButtonGroup-mb_ulNBQ.js";import{r as l,t as u}from"./motion-C7bdWeal.js";import{n as d,t as f}from"./Marquee-D-qJlTz8.js";import{n as p,t as m}from"./MotionToggle-B5wcBu3F.js";function h({variant:e}){return(0,g.useEffect)(()=>()=>l(!1),[]),(0,_.jsxs)(o,{gap:5,style:{maxWidth:520},children:[(0,_.jsx)(m,{variant:e}),(0,_.jsxs)(o,{direction:`row`,gap:4,align:`center`,children:[(0,_.jsx)(i,{label:`Working`}),(0,_.jsx)(c,{label:`View`,defaultValue:`a`,options:[{value:`a`,label:`Grid`},{value:`b`,label:`List`},{value:`c`,label:`Board`}]})]}),(0,_.jsx)(f,{label:`Topics`,controls:!1,repeat:3,children:[`Accessibility`,`Design tokens`,`Testing`,`Motion`].map(e=>(0,_.jsx)(`span`,{children:e},e))})]})}var g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{g=n(),u(),s(),d(),r(),a(),p(),_=t(),{expect:v,userEvent:y,waitFor:b,within:x}=__STORYBOOK_MODULE_TEST__,S={title:`Foundations/Motion`,component:h,args:{variant:`labelled`},argTypes:{variant:{control:`inline-radio`,options:[`icon`,`labelled`]}},parameters:{docs:{description:{component:'`MotionToggle` pauses every animation on the site (WCAG 2.2.2) and remembers the choice. It sets `data-motion="paused"` on `<html>`, which the tokens treat exactly like the system "reduce motion" setting; use `useLessMotion()` for script-driven motion. Inline `motionPauseScript` in `<head>` to apply a saved choice before first paint.'}}}},C={play:async({canvasElement:e})=>{let t=x(e),n=t.getByRole(`button`,{name:`Pause animations`});n.getAttribute(`aria-disabled`)!==`true`&&(await y.click(n),await v(n).toHaveAttribute(`aria-pressed`,`true`),await v(document.documentElement).toHaveAttribute(`data-motion`,`paused`),await v(getComputedStyle(document.documentElement).getPropertyValue(`--ds-duration-slow`).trim()).toBe(`0ms`),await b(()=>v(t.getByRole(`region`,{name:`Topics`})).toBeInTheDocument()),await y.click(n),await v(document.documentElement).not.toHaveAttribute(`data-motion`))}},w={args:{variant:`icon`}},T=[`Default`,`IconOnly`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', {
      name: 'Pause animations'
    });
    // In the reduced-motion test run the system already pauses everything.
    if (toggle.getAttribute('aria-disabled') === 'true') return;
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(document.documentElement).toHaveAttribute('data-motion', 'paused');
    // Transitions collapse and the marquee becomes a static, focusable strip.
    await expect(getComputedStyle(document.documentElement).getPropertyValue('--ds-duration-slow').trim()).toBe('0ms');
    await waitFor(() => expect(canvas.getByRole('region', {
      name: 'Topics'
    })).toBeInTheDocument());
    await userEvent.click(toggle);
    await expect(document.documentElement).not.toHaveAttribute('data-motion');
  }
}`,...C.parameters?.docs?.source},description:{story:'The `labelled` variant (icon and text) next to things that move: a spinner, a button group and a marquee. Pressing it sets `aria-pressed` and `data-motion="paused"` on `<html>`, transitions collapse and the marquee becomes a static, keyboard-scrollable region. When the system already reduces motion it shows as pressed and `aria-disabled`, with a tooltip explaining why.',...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'icon'
  }
}`,...w.parameters?.docs?.source},description:{story:"The compact `icon` variant for headers and toolbars. Its accessible name is still “Pause animations” and it shows that label as a tooltip on hover and focus.",...w.parameters?.docs?.description}}}})))()}E();export{C as Default,w as IconOnly,T as __namedExportsOrder,S as default};