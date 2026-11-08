import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldValidation, useGroupValidation, type ValidationProps } from '../../utils/validation';
import { FieldError } from '../Field/Field';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Checkbox.module.css';

export type CheckedState = boolean | 'indeterminate';

/** Shared by Checkbox and Radio: scales the box, its mark, the label, hint and spacing. */
export type ChoiceSize = 'sm' | 'md' | 'lg';

/* -------------------------------------------------------------------------------------------------
 * CheckboxGroup
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxGroupContextValue {
  name: string;
  value: string[];
  disabled: boolean;
  size: ChoiceSize | undefined;
  invalid: boolean;
  describedBy: string | undefined;
  toggle: (value: string, checked: boolean) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps extends ValidationProps<string[]> {
  /** Rendered as the fieldset's `<legend>`. */
  legend: ReactNode;
  /** Form field name shared by every checkbox. Each checked box submits its `value`. */
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  hint?: ReactNode;
  error?: ReactNode;
  /** Require at least one checkbox to be checked. Blocks form submission like a native `required`. */
  required?: boolean;
  disabled?: boolean;
  /** Size for every checkbox in the group. A checkbox's own `size` wins. */
  size?: ChoiceSize;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children: ReactNode;
}

/** A set of checkboxes sharing one array value, built on `<fieldset>` + `<legend>`. */
export function CheckboxGroup({
  legend,
  name,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  hint,
  error,
  required = false,
  disabled = false,
  size,
  orientation = 'vertical',
  validate,
  validationMessages,
  validateOn,
  className,
  children,
}: CheckboxGroupProps) {
  const generated = useId();
  const groupName = name ?? `ds-checkbox-group-${generated}`;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  // "At least one" has no native equivalent for checkboxes, so it's a group rule.
  const validation = useGroupValidation(fieldsetRef, {
    selector: 'input[type="checkbox"]:not(:disabled)',
    value,
    groupRule: (current) =>
      required && current.length === 0 ? (validationMessages?.valueMissing ?? 'Select at least one option.') : null,
    validate,
    validationMessages,
    validateOn,
  });
  const shownError = error ?? validation.error;

  const hintId = hint ? `${groupName}-hint` : undefined;
  const errorId = shownError ? `${groupName}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const toggle = (item: string, checked: boolean) => {
    const next = checked ? [...value.filter((v) => v !== item), item] : value.filter((v) => v !== item);
    if (controlledValue === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  // Restore the default selection when the surrounding form is reset.
  const defaultRef = useRef(defaultValue);
  useEffect(() => {
    const form = fieldsetRef.current?.form;
    if (!form || controlledValue !== undefined) return;
    const onReset = () => setUncontrolledValue(defaultRef.current);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [controlledValue]);

  return (
    <fieldset
      ref={fieldsetRef}
      className={cx(styles.fieldset, className)}
      disabled={disabled}
      onBlur={validation.onBlur}
    >
      <legend className={styles.legend}>
        {legend}
        {required && (
          <>
            <span className={styles.required} aria-hidden="true">
              {' *'}
            </span>
            {/* A fieldset can't carry aria-required, so name the requirement in the legend. */}
            {' '}
            <VisuallyHidden>(required)</VisuallyHidden>
          </>
        )}
      </legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={cx(styles.options, styles[orientation])}>
        <CheckboxGroupContext.Provider value={{ name: groupName, value, disabled, size, invalid: !!shownError, describedBy, toggle }}>
          {children}
        </CheckboxGroupContext.Provider>
      </div>
      <FieldError id={`${groupName}-error`} className={styles.error}>
        {shownError}
      </FieldError>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

export interface CheckboxProps
  extends ValidationProps<boolean>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'value' | 'size' | 'children'> {
  label: ReactNode;
  /** Supporting text under the label. */
  hint?: ReactNode;
  /** Error message, e.g. for a required consent box. Marks the checkbox invalid. */
  error?: ReactNode;
  /** Controlled state. `'indeterminate'` shows the mixed state, e.g. a partial "select all". */
  checked?: CheckedState;
  /** Initial state when uncontrolled. */
  defaultChecked?: CheckedState;
  /** Called with the new state. A click on an indeterminate checkbox reports `true`. */
  onCheckedChange?: (checked: boolean) => void;
  /** Submitted with the form when checked; identifies the box inside a `CheckboxGroup`. */
  value?: string;
  /** Defaults to the enclosing `CheckboxGroup`'s size, then `md`. */
  size?: ChoiceSize;
}

/**
 * A checkbox with its label. Same API shape as Radix (`checked`, `onCheckedChange`,
 * `'indeterminate'`), but built on a real `<input type="checkbox">`, so forms, validation,
 * autofill, reset and the browser's mixed-state semantics work without a hidden "bubble" input.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    hint,
    error,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    value = 'on',
    size: sizeProp,
    id,
    name,
    disabled,
    validate,
    validationMessages,
    validateOn,
    onBlur,
    onInvalid,
    className,
    ...inputProps
  },
  ref,
) {
  const group = useContext(CheckboxGroupContext);
  const size = sizeProp ?? group?.size ?? 'md';
  const generated = useId();
  const inputId = id ?? `ds-checkbox-${generated}`;

  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  // Inside a CheckboxGroup the group validates; a lone checkbox validates itself.
  const validation = useFieldValidation(innerRef, {
    // Only read while mounted, so the input is there.
    getValue: () => innerRef.current!.checked,
    validate,
    validationMessages,
    validateOn,
    enabled: !group,
  });
  const shownError = error ?? validation.error;

  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = shownError ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId, group?.describedBy].filter(Boolean).join(' ') || undefined;

  const [uncontrolled, setUncontrolled] = useState<CheckedState>(defaultChecked);
  const state: CheckedState = group
    ? group.value.includes(value)
    : checkedProp !== undefined
      ? checkedProp
      : uncontrolled;

  // `indeterminate` is a DOM property only; there is no HTML attribute for it.
  useEffect(() => {
    innerRef.current!.indeterminate = state === 'indeterminate';
  }, [state]);

  // Native inputs restore themselves on form reset; mirror that for our state.
  const defaultRef = useRef(defaultChecked);
  useEffect(() => {
    const form = innerRef.current?.form;
    if (!form || group || checkedProp !== undefined) return;
    const onReset = () => setUncontrolled(defaultRef.current);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [group, checkedProp]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    if (group) group.toggle(value, next);
    else if (checkedProp === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
    onChange?.(event);
    validation.onValueChange();
  };

  return (
    <div className={cx(styles.option, styles[size], className)}>
      <span className={styles.control}>
        <input
          ref={innerRef}
          id={inputId}
          type="checkbox"
          name={group?.name ?? name}
          value={value}
          checked={state === true}
          onChange={handleChange}
          disabled={disabled || group?.disabled}
          className={styles.checkbox}
          aria-describedby={describedBy}
          aria-invalid={shownError || group?.invalid ? true : undefined}
          onBlur={(event: FocusEvent<HTMLInputElement>) => {
            validation.onBlur();
            onBlur?.(event);
          }}
          onInvalid={(event) => {
            validation.onInvalid(event);
            onInvalid?.(event);
          }}
          data-state={state === 'indeterminate' ? 'indeterminate' : state ? 'checked' : 'unchecked'}
          {...inputProps}
        />
        {/* Both marks are always present; CSS draws whichever matches the input's state. */}
        <svg className={styles.indicator} viewBox="0 0 16 16" aria-hidden="true">
          <path className={styles.check} d="m3.5 8.5 3 3 6-7" pathLength={1} />
          <path className={styles.dash} d="M4 8h8" pathLength={1} />
        </svg>
      </span>
      <div className={styles.text}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        {/* Inside a group, the group shows (and announces) the error. */}
        {!group && (
          <FieldError id={`${inputId}-error`} className={styles.error}>
            {shownError}
          </FieldError>
        )}
      </div>
    </div>
  );
});
