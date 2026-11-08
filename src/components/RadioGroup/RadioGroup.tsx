import { createContext, useContext, useId, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useGroupValidation, type ValidationProps } from '../../utils/validation';
import type { ChoiceSize } from '../Checkbox/Checkbox';
import optionStyles from '../Checkbox/Checkbox.module.css';
import { FieldError } from '../Field/Field';
import styles from './RadioGroup.module.css';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  size: ChoiceSize | undefined;
  invalid: boolean;
  describedBy: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends ValidationProps<string | undefined> {
  /** Rendered as the fieldset's `<legend>`. */
  legend: ReactNode;
  /** Form field name. Generated when omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  /** Size for every radio in the group. A radio's own `size` wins. */
  size?: ChoiceSize;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children: ReactNode;
}

/** A set of mutually exclusive options, built on `<fieldset>` + native radios. */
export function RadioGroup({
  legend,
  name,
  value: controlledValue,
  defaultValue,
  onValueChange,
  hint,
  error,
  disabled = false,
  required = false,
  size,
  orientation = 'vertical',
  validate,
  validationMessages,
  validateOn,
  className,
  children,
}: RadioGroupProps) {
  const generated = useId();
  const groupName = name ?? `ds-radio-${generated}`;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  // `required` is native for radios; the group just turns its validity into an inline message.
  const validation = useGroupValidation(fieldsetRef, {
    selector: 'input[type="radio"]',
    value,
    validate,
    validationMessages,
    validateOn,
  });
  const shownError = error ?? validation.error;

  const hintId = hint ? `${groupName}-hint` : undefined;
  const errorId = shownError ? `${groupName}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) setUncontrolledValue(event.target.value);
    onValueChange?.(event.target.value);
  };

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
          <span className={styles.required} aria-hidden="true">
            {' *'}
          </span>
        )}
      </legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={cx(styles.options, styles[orientation])}>
        <RadioGroupContext.Provider value={{ name: groupName, value, disabled, required, size, invalid: !!shownError, describedBy, onChange }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
      <FieldError id={`${groupName}-error`} className={styles.error}>
        {shownError}
      </FieldError>
    </fieldset>
  );
}

export interface RadioProps {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  /** Defaults to the enclosing `RadioGroup`'s size, then `md`. */
  size?: ChoiceSize;
}

/** One option inside a `RadioGroup`. */
export function Radio({ value, label, hint, disabled, size }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const inputId = `ds-radio-option-${useId()}`;
  if (!group) throw new Error('<Radio> must be used inside <RadioGroup>.');

  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [hintId, group.describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(optionStyles.option, optionStyles[size ?? group.size ?? 'md'])}>
      <input
        id={inputId}
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        onChange={group.onChange}
        disabled={disabled}
        required={group.required}
        aria-describedby={describedBy}
        aria-invalid={group.invalid || undefined}
        className={optionStyles.radio}
      />
      <div className={optionStyles.text}>
        <label htmlFor={inputId} className={optionStyles.label}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className={optionStyles.hint}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
