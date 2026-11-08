import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,p as n}from"./iframe-BA5U10ay.js";import{t as r}from"./cx-MB73G3OO.js";import{n as i,t as a}from"./Stack-CCsQXNDC.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{o=`ds-LazyImage-module__wrapper--I8TDf`,s=`ds-LazyImage-module__fill--cxCJj`,c=`ds-LazyImage-module__img--QJIHX`,l=`ds-LazyImage-module__waiting---8WQu`,u=`ds-LazyImage-module__revealed--jMp-K`,d=`ds-LazyImage-module__loading--e9-0Q`,f=`ds-LazyImage-module__bare--yscHS`,p=`ds-LazyImage-module__fallback---C5JN`,m={wrapper:o,fill:s,img:c,waiting:l,revealed:u,"image-in":`ds-LazyImage-module__image-in--Pgdr6`,loading:d,bare:f,"skeleton-show":`ds-LazyImage-module__skeleton-show--oeXLw`,"skeleton-shimmer":`ds-LazyImage-module__skeleton-shimmer--FxbtX`,fallback:p}})))()}function g({src:e,alt:t,className:n,imageClassName:i,fallback:a=`Image not available`,skeleton:o=!0,fill:s=!1,loading:c=`lazy`,decoding:l=`async`,fadeIn:u=c!==`eager`,width:d,height:f,...p}){let[h,g]=(0,_.useState)({src:e,value:`loading`}),y=e?h.src===e?h.value:`loading`:`failed`,b=(0,_.useRef)(null),[x,S]=(0,_.useState)(``);(0,_.useEffect)(()=>{let t=b.current;if(!t||!e)return;let n=()=>g({src:e,value:t.naturalWidth>0?`loaded`:`failed`});if(t.complete){n();return}u&&S(e);let r=()=>g({src:e,value:`failed`});return t.addEventListener(`load`,n),t.addEventListener(`error`,r),()=>{t.removeEventListener(`load`,n),t.removeEventListener(`error`,r)}},[e,u]);let C=x===e,w=Number(d)||0,T=Number(f)||0,E=!s&&w&&T?{width:`${w}px`,aspectRatio:`${w} / ${T}`}:void 0;return(0,v.jsx)(`span`,{className:r(m.wrapper,s&&m.fill,!o&&m.bare,m[y],C&&y===`loading`&&m.waiting,C&&y===`loaded`&&m.revealed,n),"data-status":y,children:y===`failed`?(0,v.jsx)(`span`,{className:m.fallback,style:E,...t?{role:`img`,"aria-label":t}:{"aria-hidden":!0},children:a}):(0,v.jsx)(`img`,{ref:b,...p,src:e,alt:t,width:d,height:f,loading:c,decoding:l,className:r(m.img,i)},e)})}var _,v;function y(){return(y=e((()=>{_=n(),h(),v=t();try{g.displayName=`LazyImage`,g.__docgenInfo={description:`An image that loads lazily, with a skeleton behind it while it loads and a fallback if it fails.

- Native lazy loading and async decoding; pass \`width\`/\`height\` (or \`fill\`) so nothing shifts.
- Server-rendered, the image paints over the skeleton as it arrives, so it works without
  JavaScript. Once interactive, an image still loading is hidden and faded in; one already
  loaded or cached is never hidden, so it can't flicker.
- The skeleton only appears if loading takes over 150ms (a CSS delay, no timers), so cached and
  fast images never flash one.
- Status is tracked per \`src\`, and the <img> is keyed by it, so a late event from an old src
  can't land on a new one.
- \`alt=""\` is decorative and its fallback is hidden too; otherwise the fallback is announced as
  an image with the same alt.

Adapted from Portfolio2k26's LazyImage (there built on next/image).`,displayName:`LazyImage`,filePath:`C:/Users/vince/design-system/src/components/LazyImage/LazyImage.tsx`,methods:[],props:{src:{defaultValue:null,declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:`Empty shows the fallback straight away.`,name:`src`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!0,tags:{},type:{name:`string`}},alt:{defaultValue:null,declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:'Required: describe the image, or `""` when it\'s purely decorative.',name:`alt`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!0,tags:{},type:{name:`string`}},className:{defaultValue:null,declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:`On the wrapper, which sizes the image: put layout here.`,name:`className`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`string`}},imageClassName:{defaultValue:null,declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:`On the <img> itself, e.g. for object-position.`,name:`imageClassName`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`string`}},fallback:{defaultValue:{value:`Image not available`},declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:`Shown in the image's place when it can't be loaded.`,name:`fallback`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`ReactNode`}},skeleton:{defaultValue:{value:`true`},declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:`The shimmer behind a loading image. Turn off for cut-outs, where a box would show round them.`,name:`skeleton`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`boolean`}},fadeIn:{defaultValue:{value:`loading !== 'eager'`},declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:'Hide an image still loading once the page is interactive, and fade it in when it arrives.\nOff by default for `loading="eager"` images: hiding the largest image on screen would delay LCP.',name:`fadeIn`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`boolean`}},fill:{defaultValue:{value:`false`},declarations:[{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`}],description:"Fill a sized, positioned parent (like `object-fit: cover`) instead of using intrinsic size.",name:`fill`,parent:{fileName:`design-system/src/components/LazyImage/LazyImage.tsx`,name:`LazyImageProps`},required:!1,tags:{},type:{name:`boolean`}}},tags:{}}}catch{}})))()}var b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{i(),y(),b=t(),{expect:x,within:S}=__STORYBOOK_MODULE_TEST__,C=e=>`data:image/svg+xml;utf8,`+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${e} 70% 60%)"/><stop offset="1" stop-color="hsl(${e+60} 70% 45%)"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><circle cx="300" cy="80" r="36" fill="#fff" fill-opacity=".8"/><path d="M0 220 120 120l90 80 60-50 130 110H0Z" fill="#000" fill-opacity=".25"/></svg>`),w={title:`Components/LazyImage`,component:g,args:{src:C(220),alt:`Mountains at dusk`,width:400,height:260},argTypes:{loading:{control:`inline-radio`,options:[`lazy`,`eager`]}},parameters:{docs:{description:{component:`Lazy-loads with a skeleton that only appears after 150ms, fades in only images still loading after hydration (never the LCP image), keeps its shape and is announced by its alt text if it fails.`}}}},T={play:async({canvasElement:e})=>{let t=S(e).getByRole(`img`,{name:`Mountains at dusk`});await x(t).toHaveAttribute(`loading`,`lazy`)}},E={name:`Failed load (fallback)`,args:{src:`https://invalid.example/missing.jpg`,alt:`Team photo`},play:async({canvasElement:e})=>{let t=await S(e).findByText(`Image not available`,{},{timeout:8e3});await x(t).toHaveAccessibleName(`Team photo`),await x(Math.round(t.getBoundingClientRect().width)).toBe(400)}},D={name:`Skeleton (never loads)`,render:e=>(0,b.jsx)(`div`,{style:{width:400,height:260,position:`relative`,borderRadius:12,overflow:`hidden`},children:(0,b.jsx)(g,{...e,src:`https://httpstat.us/200?sleep=60000`,fill:!0})})},O={name:`Fill a sized box`,render:e=>(0,b.jsx)(a,{direction:`row`,gap:4,children:[220,20,140].map(t=>(0,b.jsx)(`div`,{style:{position:`relative`,width:180,aspectRatio:`1`,borderRadius:16,overflow:`hidden`},children:(0,b.jsx)(g,{...e,src:C(t),alt:`Landscape ${t}`,fill:!0})},t))})},k=[`Default`,`Failed`,`Skeleton`,`Fill`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const img = within(canvasElement).getByRole('img', {
      name: 'Mountains at dusk'
    });
    await expect(img).toHaveAttribute('loading', 'lazy');
  }
}`,...T.parameters?.docs?.source},description:{story:'A lazily loaded image (`loading="lazy"`, `decoding="async"`) with `width` and `height` set so the layout doesn’t shift while it loads. Use `loading="eager"` for the largest image above the fold, which also turns off the fade-in so LCP isn’t delayed.',...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Failed load (fallback)',
  args: {
    src: 'https://invalid.example/missing.jpg',
    alt: 'Team photo'
  },
  play: async ({
    canvasElement
  }) => {
    // The fallback keeps the image's name and its 400×260 shape.
    const fallback = await within(canvasElement).findByText('Image not available', {}, {
      timeout: 8000
    });
    await expect(fallback).toHaveAccessibleName('Team photo');
    await expect(Math.round(fallback.getBoundingClientRect().width)).toBe(400);
  }
}`,...E.parameters?.docs?.source},description:{story:'When the image can’t load, the fallback takes its place at the same 400×260 shape, so the layout doesn’t collapse. It is exposed as `role="img"` named by the `alt` text; with `alt=""` it would be hidden from assistive tech instead.',...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'Skeleton (never loads)',
  // A data URL that never resolves is impossible, so show the loading state with an empty-but-pending image.
  render: args => <div style={{
    width: 400,
    height: 260,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden'
  }}>\r
      <LazyImage {...args} src="https://httpstat.us/200?sleep=60000" fill />\r
    </div>
}`,...D.parameters?.docs?.source},description:{story:"An image that never finishes loading, so the shimmer stays visible. The skeleton only appears after 150ms, so cached and fast images never flash it; pass `skeleton={false}` for cut-outs where a box would show round the edges.",...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Fill a sized box',
  render: args => <Stack direction="row" gap={4}>\r
      {[220, 20, 140].map(hue => <div key={hue} style={{
      position: 'relative',
      width: 180,
      aspectRatio: '1',
      borderRadius: 16,
      overflow: 'hidden'
    }}>\r
          <LazyImage {...args} src={photo(hue)} alt={\`Landscape \${hue}\`} fill />\r
        </div>)}\r
    </Stack>
}`,...O.parameters?.docs?.source},description:{story:"With `fill`, the image covers a sized, positioned parent (like `object-fit: cover`) instead of using its intrinsic size. Use it for cards, avatars and grids where the container sets the shape.",...O.parameters?.docs?.description}}}})))()}A();export{T as Default,E as Failed,O as Fill,D as Skeleton,k as __namedExportsOrder,w as default};