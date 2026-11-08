import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldValidation, type ValidationProps } from '../../utils/validation';
import type { ChoiceSize } from '../Checkbox/Checkbox';
import { FieldError } from '../Field/Field';
import styles from './Switch.module.css';

export interface SwitchProps
  extends ValidationProps<boolean>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'size' | 'children'> {
  label: ReactNode;
  hint?: ReactNode;
  /** Error message. Native `required` and `validate` failures show here automatically. */
  error?: ReactNode;
  /** Scales the track, thumb, label and hint. */
  size?: ChoiceSize;
}

/**
 * An on/off setting that takes effect immediately. Built on a native checkbox with
 * role="switch", so it submits with forms, validates and toggles with Space.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    hint,
    error,
    size = 'md',
    id,
    className,
    validate,
    validationMessages,
    validateOn,
    onBlur,
    onChange,
    onInvalid,
    ...inputProps
  },
  ref,
) {
  const generated = useId();
  const inputId = id ?? `ds-switch-${generated}`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const validation = useFieldValidation(inputRef, {
    // Only read while mounted, so the input is there.
    getValue: () => inputRef.current!.checked,
    validate,
    validationMessages: { valueMissing: 'Turn this on to continue.', ...validationMessages },
    validateOn,
  });
  const shownError = error ?? validation.error;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = shownError ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.root, styles[size], className)}>
      <div className={styles.text}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        <FieldError id={`${inputId}-error`} className={styles.error}>
          {shownError}
        </FieldError>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        role="switch"
        aria-describedby={describedBy}
        aria-invalid={shownError ? true : undefined}
        className={styles.switch}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          validation.onBlur();
          onBlur?.(event);
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange?.(event);
          validation.onValueChange();
        }}
        onInvalid={(event) => {
          validation.onInvalid(event);
          onInvalid?.(event);
        }}
        {...inputProps}
      />
    </div>
  );
});
