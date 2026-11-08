import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useGroupValidation, type ValidationProps } from '../../utils/validation';
import { FieldError } from '../Field/Field';
import styles from './ScaleSelect.module.css';

export interface ScaleOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ScaleSelectProps extends ValidationProps<string | undefined> {
  /** Rendered as the fieldset's legend. */
  label: ReactNode;
  /** Ordered from low to high (cheap to expensive, soon to later). */
  options: ScaleOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name. Generated when omitted. */
  name?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * One choice along an ordered range, drawn as a continuous bar: budgets, timelines, team sizes.
 * Use RadioGroup or Select when the options have no order; the bar implies one.
 *
 * Built on native radio inputs inside a fieldset, so it submits with forms, supports `required`
 * and validation, resets with the form, and screen readers announce "radio, 3 of 6". Arrow keys
 * move and select, and stop at the ends rather than wrapping (stepping past the top of a budget
 * scale shouldn't land on the cheapest option). The rail underneath is decoration only. When the
 * component's own container is narrow, the bar becomes a two-column grid and the rail is dropped.
 *
 * Adapted from Portfolio2k26's ScaleSelect.
 */
export function ScaleSelect({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  name,
  hint,
  error,
  required = false,
  disabled = false,
  validate,
  validationMessages,
  validateOn,
  className,
}: ScaleSelectProps) {
  const generated = useId();
  const groupName = name ?? `ds-scale-${generated}`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

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

  const choose = (next: string) => {
    if (controlledValue === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  const enabled = options.map((option, index) => (option.disabled ? -1 : index)).filter((i) => i >= 0);
  const firstEnabled = enabled[0];
  const lastEnabled = enabled[enabled.length - 1];

  // Native radios wrap at the ends; on a scale that's a surprise, so stop at the first and last.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if ((forward && index === lastEnabled) || (backward && index === firstEnabled)) event.preventDefault();
  };

  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <fieldset
      ref={fieldsetRef}
      className={cx(styles.fieldset, className)}
      disabled={disabled}
      onBlur={validation.onBlur}
    >
      <legend className={styles.legend}>
        {label}
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
      <div className={styles.scale}>
        <div className={styles.row} style={{ '--scale-n': options.length } as CSSProperties}>
          {options.map((option, index) => (
            <label key={option.value} className={styles.segment}>
              <input
                type="radio"
                className={styles.input}
                name={groupName}
                value={option.value}
                checked={value === option.value}
                onChange={() => choose(option.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
                disabled={option.disabled}
                required={required}
                aria-describedby={describedBy}
                aria-invalid={shownError ? true : undefined}
              />
              <span className={styles.text}>{option.label}</span>
            </label>
          ))}
        </div>
        <div className={styles.rail} aria-hidden="true">
          <span
            className={styles.thumb}
            data-set={selectedIndex >= 0 || undefined}
            style={{ left: `${((Math.max(0, selectedIndex) + 0.5) / options.length) * 100}%` }}
          />
        </div>
      </div>
      <FieldError id={`${groupName}-error`} className={styles.error}>
        {shownError}
      </FieldError>
    </fieldset>
  );
}
