import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BA5U10ay.js";import{i as n,r}from"./react-B-r0wvCk.js";import{l as i,s as a}from"./blocks-DqOaVw-C.js";import{n as o,t as s}from"./DocBanner-DKfOrOn6.js";var c;function l(){return(l=e((()=>{c=new URL(`banner-forms-BAar1xIQ.webp`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{title:`Guides/Forms and validation`}),`
`,(0,f.jsx)(s,{title:`Forms and validation`,eyebrow:`Guides`,src:c}),`
`,(0,f.jsxs)(t.p,{children:[`Every form control (`,(0,f.jsx)(t.code,{children:`TextField`}),`, `,(0,f.jsx)(t.code,{children:`TextArea`}),`, `,(0,f.jsx)(t.code,{children:`Select`}),`, `,(0,f.jsx)(t.code,{children:`Checkbox`}),`, `,(0,f.jsx)(t.code,{children:`CheckboxGroup`}),`, `,(0,f.jsx)(t.code,{children:`RadioGroup`}),`,\r
`,(0,f.jsx)(t.code,{children:`Switch`}),`) validates through the browser's `,(0,f.jsx)(t.strong,{children:`Constraint Validation API`}),`. You describe the rules;\r
the controls check them, show inline errors, and block submission. There is no form library and no\r
schema to wire up, though you can still use one.`]}),`
`,(0,f.jsxs)(t.p,{children:[`See it working in the `,(0,f.jsx)(t.a,{href:`?path=/story/examples-sign-up-form--shows-validation-errors`,children:`sign-up form example`}),`.`]}),`
`,(0,f.jsx)(t.h2,{id:`anatomy-of-a-field`,children:`Anatomy of a field`}),`
`,(0,f.jsxs)(t.p,{children:[`Each control renders, in order: a visible `,(0,f.jsx)(t.strong,{children:`label`}),`, an optional `,(0,f.jsx)(t.strong,{children:`hint`}),`, the `,(0,f.jsx)(t.strong,{children:`control`}),`, and an\r
`,(0,f.jsx)(t.strong,{children:`error`}),` slot. The hint and error are linked with `,(0,f.jsx)(t.code,{children:`aria-describedby`}),`; an error also sets\r
`,(0,f.jsx)(t.code,{children:`aria-invalid`}),`. Groups (`,(0,f.jsx)(t.code,{children:`CheckboxGroup`}),`, `,(0,f.jsx)(t.code,{children:`RadioGroup`}),`) use a `,(0,f.jsx)(t.code,{children:`<fieldset>`}),` whose `,(0,f.jsx)(t.code,{children:`<legend>`}),` is the\r
label.`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`<TextField\r
  label="Password"\r
  hint="At least 8 characters, including a number."\r
  type="password"\r
  autoComplete="new-password"\r
  required\r
  minLength={8}\r
/>
`})}),`
`,(0,f.jsx)(t.h2,{id:`describing-rules`,children:`Describing rules`}),`
`,(0,f.jsx)(t.h3,{id:`native-attributes`,children:`Native attributes`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`required`}),`, `,(0,f.jsx)(t.code,{children:`minLength`}),`, `,(0,f.jsx)(t.code,{children:`maxLength`}),`, `,(0,f.jsx)(t.code,{children:`min`}),`, `,(0,f.jsx)(t.code,{children:`max`}),`, `,(0,f.jsx)(t.code,{children:`step`}),`, `,(0,f.jsx)(t.code,{children:`pattern`}),` and input `,(0,f.jsx)(t.code,{children:`type`}),` all work as\r
in plain HTML.`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`<TextField label="Email" type="email" required />\r
<TextField label="Username" minLength={3} pattern="[a-z0-9_]+" />\r
<CheckboxGroup legend="Days" required>…</CheckboxGroup>   {/* at least one */}
`})}),`
`,(0,f.jsx)(t.h3,{id:`custom-rules`,children:`Custom rules`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`validate`}),` receives the current value and returns a message (invalid) or nothing (valid). Rules\r
are re-applied every render, so a rule that depends on another field stays current:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`<TextField\r
  label="Confirm password"\r
  type="password"\r
  validate={(value) => (value === password ? null : 'Passwords don’t match.')}\r
/>
`})}),`
`,(0,f.jsx)(t.h3,{id:`your-own-wording`,children:`Your own wording`}),`
`,(0,f.jsxs)(t.p,{children:[`Browser messages are generic and vary by browser and language. Replace them per constraint with\r
`,(0,f.jsx)(t.code,{children:`validationMessages`}),`:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`<TextField\r
  label="Username"\r
  required\r
  pattern="[a-z0-9_]+"\r
  validationMessages={{\r
    valueMissing: 'Enter a username.',\r
    patternMismatch: 'Use lowercase letters, numbers and underscores only.',\r
  }}\r
/>
`})}),`
`,(0,f.jsxs)(t.p,{children:[`Keys are the `,(0,f.jsx)(t.code,{children:`ValidityState`}),` names: `,(0,f.jsx)(t.code,{children:`valueMissing`}),`, `,(0,f.jsx)(t.code,{children:`typeMismatch`}),`, `,(0,f.jsx)(t.code,{children:`patternMismatch`}),`, `,(0,f.jsx)(t.code,{children:`tooShort`}),`,\r
`,(0,f.jsx)(t.code,{children:`tooLong`}),`, `,(0,f.jsx)(t.code,{children:`rangeUnderflow`}),`, `,(0,f.jsx)(t.code,{children:`rangeOverflow`}),`, `,(0,f.jsx)(t.code,{children:`stepMismatch`}),`, `,(0,f.jsx)(t.code,{children:`badInput`}),`.`]}),`
`,(0,f.jsx)(t.h3,{id:`server-errors`,children:`Server errors`}),`
`,(0,f.jsxs)(t.p,{children:[`An explicit `,(0,f.jsx)(t.code,{children:`error`}),` prop always wins over built-in validation. Use it for problems only the server\r
knows about:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`<TextField label="Email" type="email" error={serverErrors.email} />
`})}),`
`,(0,f.jsx)(t.h2,{id:`when-errors-appear`,children:`When errors appear`}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`Moment`}),(0,f.jsx)(t.th,{children:`What happens`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Typing, first time`}),(0,f.jsx)(t.td,{children:`Nothing. People aren't told off before they've finished.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Leaving the field`}),(0,f.jsxs)(t.td,{children:[`The field is checked and its error shown (`,(0,f.jsx)(t.code,{children:`validateOn="blur"`}),`, the default).`]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Typing, after an error`}),(0,f.jsx)(t.td,{children:`Re-checked on every change, so the error clears as soon as it's fixed.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Submitting`}),(0,f.jsx)(t.td,{children:`Every invalid field shows its error and focus moves to the first one. The submit event doesn't fire.`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`Resetting the form`}),(0,f.jsx)(t.td,{children:`All errors clear.`})]})]})]}),`
`,(0,f.jsxs)(t.p,{children:[`Change the first trigger with `,(0,f.jsx)(t.code,{children:`validateOn="change"`}),` (check while typing, good for a password\r
strength rule) or `,(0,f.jsx)(t.code,{children:`validateOn="submit"`}),` (stay quiet until submit, good for very short forms).`]}),`
`,(0,f.jsx)(t.h2,{id:`error-summary`,children:`Error summary`}),`
`,(0,f.jsxs)(t.p,{children:[`For forms with more than a few fields, add an `,(0,f.jsx)(t.code,{children:`ErrorSummary`}),` at the top. After a blocked submit it\r
lists every error, takes focus so screen reader users hear what went wrong, and links each item to\r
its field. `,(0,f.jsx)(t.code,{children:`useErrorSummary`}),` collects the errors the fields already report, so you don't duplicate\r
any rules:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import { useRef } from 'react';\r
import { ErrorSummary, useErrorSummary } from '@dekrayzis/design-system';\r
\r
function SignUp() {\r
  const formRef = useRef<HTMLFormElement>(null);\r
  const summary = useErrorSummary(formRef);\r
\r
  return (\r
    <form ref={formRef} onSubmit={save}>\r
      <ErrorSummary {...summary} />\r
      {/* fields */}\r
    </form>\r
  );\r
}
`})}),`
`,(0,f.jsx)(t.h2,{id:`submitting`,children:`Submitting`}),`
`,(0,f.jsxs)(t.p,{children:[`Because invalid controls block the native `,(0,f.jsx)(t.code,{children:`submit`}),` event, your `,(0,f.jsx)(t.code,{children:`onSubmit`}),` handler only runs when\r
everything is valid. Inside it, read values from the form (`,(0,f.jsx)(t.code,{children:`new FormData(event.currentTarget)`}),`) or\r
from controlled state, whichever you prefer: every control works either way, with `,(0,f.jsx)(t.code,{children:`value`}),` and\r
`,(0,f.jsx)(t.code,{children:`onChange`}),`, or `,(0,f.jsx)(t.code,{children:`defaultValue`}),` and a `,(0,f.jsx)(t.code,{children:`name`}),`.`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`async function save(event: FormEvent<HTMLFormElement>) {\r
  event.preventDefault();\r
  const data = new FormData(event.currentTarget);\r
  await api.createAccount(Object.fromEntries(data));\r
}
`})}),`
`,(0,f.jsxs)(t.p,{children:[`Show progress on the submit button with `,(0,f.jsx)(t.code,{children:`loading`}),`, which sets `,(0,f.jsx)(t.code,{children:`aria-busy`}),` and blocks double\r
submits, and confirm success with an `,(0,f.jsx)(t.code,{children:`Alert`}),` or a `,(0,f.jsx)(t.code,{children:`toast`}),`.`]}),`
`,(0,f.jsx)(t.h2,{id:`writing-good-form-copy`,children:`Writing good form copy`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Labels`}),` name the thing in a word or two: "Email", "Team size". No colons, no "Please enter".`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Hints`}),` say what's expected before it's wrong: formats, limits, why you're asking.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Errors`}),` say what to do, not what went wrong: "Enter your email address", not "Invalid input".\r
Use the field's name so the message makes sense in the summary too.`]}),`
`,(0,f.jsx)(t.li,{children:`Mark the optional fields, not the required ones, if most fields are required.`}),`
`,(0,f.jsx)(t.li,{children:`Don't disable the submit button to signal invalid input. Let people submit, then show what to\r
fix: a disabled button explains nothing.`}),`
`]}),`
`,(0,f.jsxs)(t.p,{children:[`More in `,(0,f.jsx)(t.a,{href:`?path=/docs/guides-writing-guidelines--docs`,children:`Writing guidelines`}),`.`]})]})}function d(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=t(),r(),i(),o(),l()})))()}p();export{d as default};