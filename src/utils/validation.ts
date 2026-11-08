import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/**
 * Validation for form controls, built on the browser's Constraint Validation API.
 *
 * Native attributes (`required`, `minLength`, `pattern`, `type="email"`, ...) and a custom
 * `validate` rule both feed the element's validity, so an invalid field also blocks native form
 * submission. Errors are rendered inline instead of as browser bubbles:
 *
 * - shown on blur (or on change / only on submit, via `validateOn`),
 * - once shown, re-checked as the value changes so they clear as soon as the input is fixed,
 * - shown for every invalid field when the form is submitted, focusing the first one,
 * - cleared when the form is reset.
 */

export type ValidityKey = Exclude<keyof ValidityState, 'valid'>;
export type ValidationMessages = Partial<Record<ValidityKey, string>>;
export type ValidateOn = 'blur' | 'change' | 'submit';

export interface ValidationProps<V> {
  /** Custom rule. Return a message to mark the value invalid (this also blocks form submission). */
  validate?: (value: V) => string | null | undefined | false;
  /** Replace the message for a failed constraint, e.g. `{ valueMissing: 'Enter your name.' }`. */
  validationMessages?: ValidationMessages;
  /**
   * When an error first appears. Defaults to `'blur'`. Once an error is showing it always updates
   * as the value changes, so it disappears as soon as the problem is fixed.
   */
  validateOn?: ValidateOn;
}

type Validatable = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const ORDER: ValidityKey[] = [
  'customError',
  'valueMissing',
  'badInput',
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
];

/** English fallbacks for environments that provide no `validationMessage` (e.g. jsdom). */
function fallbackMessage(el: Validatable, key: ValidityKey): string {
  const isInput = el instanceof HTMLInputElement;
  switch (key) {
    case 'valueMissing':
      if (isInput && el.type === 'checkbox') return 'Check this box to continue.';
      if ((isInput && el.type === 'radio') || el instanceof HTMLSelectElement) return 'Select an option.';
      return 'This field is required.';
    case 'typeMismatch':
      // Only email and url inputs can suffer a type mismatch.
      return (el as HTMLInputElement).type === 'email' ? 'Enter a valid email address.' : 'Enter a valid URL.';
    case 'patternMismatch':
      return 'Match the requested format.';
    case 'tooShort':
      return `Use at least ${(el as HTMLInputElement).minLength} characters.`;
    case 'tooLong':
      return `Use no more than ${(el as HTMLInputElement).maxLength} characters.`;
    case 'rangeUnderflow':
      return `Enter ${(el as HTMLInputElement).min} or more.`;
    case 'rangeOverflow':
      return `Enter ${(el as HTMLInputElement).max} or less.`;
    default:
      return 'Enter a valid value.';
  }
}

/**
 * jsdom (and so most component tests) reports this for every failed constraint. It tells the user
 * nothing, so treat it as "no browser message" and use the specific fallback instead.
 */
const GENERIC_MESSAGE = /^constraints not satisfied\.?$/i;

function browserMessage(el: Validatable): string {
  return GENERIC_MESSAGE.test(el.validationMessage) ? '' : el.validationMessage;
}

/** The message to show for an element's current validity, or `null` when it's valid. */
export function validityMessage(el: Validatable, messages: ValidationMessages = {}): string | null {
  if (el.validity.valid) return null;
  // An invalid element always has at least one of these flags set.
  const key = ORDER.find((k) => el.validity[k]) as ValidityKey;
  if (key === 'customError') return el.validationMessage || messages.customError || 'Enter a valid value.';
  return messages[key] ?? (browserMessage(el) || fallbackMessage(el, key));
}

/** Whether `el` is the first invalid control of its form (the one that should receive focus). */
export function isFirstInvalid(el: Validatable): boolean {
  const form = el.form;
  if (!form) return true;
  const first = Array.from(form.elements).find(
    (control): control is Validatable =>
      (control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement) &&
      control.willValidate &&
      !control.validity.valid,
  );
  return first === el;
}

function useFormReset(getForm: () => HTMLFormElement | null | undefined, onReset: () => void) {
  const latest = useRef(onReset);
  latest.current = onReset;
  useEffect(() => {
    const form = getForm();
    if (!form) return;
    const handler = () => latest.current();
    form.addEventListener('reset', handler);
    return () => form.removeEventListener('reset', handler);
  });
}

/* -------------------------------------------------------------------------------------------------
 * Single control (input, textarea, select, checkbox, switch)
 * -----------------------------------------------------------------------------------------------*/

interface FieldValidationOptions<V> extends ValidationProps<V> {
  /** Reads the current value from the element. */
  getValue: () => V;
  /** Element to focus when this is the first invalid field on submit. Defaults to the control. */
  focusTarget?: () => HTMLElement | null;
  /** Turn validation off entirely (e.g. a checkbox whose group validates instead). */
  enabled?: boolean;
}

export function useFieldValidation<V>(
  ref: RefObject<Validatable | null>,
  { getValue, validate, validationMessages, validateOn = 'blur', focusTarget, enabled = true }: FieldValidationOptions<V>,
) {
  const [error, setError] = useState<string | null>(null);
  const latest = useRef({ getValue, validate, validationMessages, focusTarget });
  latest.current = { getValue, validate, validationMessages, focusTarget };

  const applyCustomRule = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const { validate: rule, getValue: read } = latest.current;
    el.setCustomValidity((rule && rule(read())) || '');
  }, [ref, enabled]);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled) return null;
    applyCustomRule();
    const message = validityMessage(el, latest.current.validationMessages);
    setError(message);
    return message;
  }, [ref, enabled, applyCustomRule]);

  // Keep the custom rule applied every render, so submission is blocked even before the field
  // has been touched and rules depending on other fields (e.g. "confirm password") stay current.
  useLayoutEffect(applyCustomRule);

  useFormReset(() => ref.current?.form, () => setError(null));

  return {
    error: enabled ? error : null,
    check,
    /** Call from the control's blur handler. */
    onBlur: () => {
      if (validateOn !== 'submit') check();
    },
    /** Call after the control's value changed (the DOM must already hold the new value). */
    onValueChange: () => {
      if (validateOn === 'change' || error !== null) check();
      else applyCustomRule();
    },
    /** Attach as the control's `onInvalid` handler. */
    onInvalid: (event: { preventDefault: () => void }) => {
      const el = ref.current;
      if (!el || !enabled) return;
      // Show our inline message instead of the browser bubble.
      event.preventDefault();
      setError(validityMessage(el, latest.current.validationMessages));
      if (isFirstInvalid(el)) (latest.current.focusTarget?.() ?? el).focus();
    },
  };
}

/* -------------------------------------------------------------------------------------------------
 * Groups (CheckboxGroup, RadioGroup)
 * -----------------------------------------------------------------------------------------------*/

interface GroupValidationOptions<V> extends ValidationProps<V> {
  /** Selects the group's inputs inside the fieldset. The first one carries the group's validity. */
  selector: string;
  value: V;
  /** A rule the browser can't express natively, e.g. "at least one checkbox". */
  groupRule?: (value: V) => string | null;
}

export function useGroupValidation<V>(
  fieldsetRef: RefObject<HTMLFieldSetElement | null>,
  { selector, value, groupRule, validate, validationMessages, validateOn = 'blur' }: GroupValidationOptions<V>,
) {
  const [error, setError] = useState<string | null>(null);
  const latest = useRef({ value, groupRule, validate, validationMessages });
  latest.current = { value, groupRule, validate, validationMessages };

  const inputs = useCallback(
    // Only called while mounted (layout effects and event handlers), so the fieldset is there.
    () => Array.from(fieldsetRef.current!.querySelectorAll<HTMLInputElement>(selector)),
    [fieldsetRef, selector],
  );

  const applyRules = useCallback(() => {
    const { value: current, groupRule: base, validate: rule } = latest.current;
    const message = base?.(current) || (rule && rule(current)) || '';
    inputs().forEach((input, index) => input.setCustomValidity(index === 0 ? message : ''));
  }, [inputs]);

  const check = useCallback(() => {
    applyRules();
    const first = inputs()[0];
    const message = first ? validityMessage(first, latest.current.validationMessages) : null;
    setError(message);
    return message;
  }, [applyRules, inputs]);

  useLayoutEffect(applyRules);

  // Once an error shows (or in 'change' mode), re-check whenever the value changes.
  const valueKey = JSON.stringify(value);
  const mounted = useRef(false);
  const errorRef = useRef(error);
  errorRef.current = error;
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (validateOn === 'change' || errorRef.current !== null) check();
  }, [valueKey]);

  // `invalid` doesn't bubble, so listen in the capture phase on the fieldset.
  useEffect(() => {
    const fieldset = fieldsetRef.current!;
    const onInvalid = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.matches(selector)) return;
      event.preventDefault();
      setError(validityMessage(target, latest.current.validationMessages));
      if (isFirstInvalid(target)) target.focus();
    };
    fieldset.addEventListener('invalid', onInvalid, true);
    return () => fieldset.removeEventListener('invalid', onInvalid, true);
  }, [fieldsetRef, selector]);

  useFormReset(() => fieldsetRef.current?.form, () => setError(null));

  return {
    error,
    check,
    /** Attach to the fieldset's onBlur; validates when focus leaves the whole group. */
    onBlur: (event: { relatedTarget: EventTarget | null }) => {
      if (validateOn === 'submit') return;
      const next = event.relatedTarget as Node | null;
      if (next && fieldsetRef.current?.contains(next)) return;
      check();
    },
  };
}
