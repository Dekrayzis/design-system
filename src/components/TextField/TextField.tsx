import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldValidation, type ValidationProps } from '../../utils/validation';
import { Field, useFieldIds, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';

export interface TextFieldProps
  extends FieldBaseProps,
    ValidationProps<string>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date';
  /** Decorative icon inside the start of the field. */
  startIcon?: ReactNode;
  /** Decorative icon inside the end of the field. */
  endIcon?: ReactNode;
  /** Class for the outer field wrapper. */
  className?: string;
}

/**
 * Single-line text input with a label, optional hint, icons and validation.
 * Native constraints (`required`, `minLength`, `pattern`, `type="email"`, ...) and `validate`
 * produce inline errors; an explicit `error` prop always wins.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hint,
    error,
    hideLabel,
    id,
    className,
    type = 'text',
    required,
    startIcon,
    endIcon,
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
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const validation = useFieldValidation(inputRef, {
    // Only read while mounted, so the input is there.
    getValue: () => inputRef.current!.value,
    validate,
    validationMessages,
    validateOn,
  });
  const shownError = error ?? validation.error;
  const { controlId, hintId, describedBy } = useFieldIds(id, hint, shownError);

  return (
    <Field
      label={label}
      hint={hint}
      error={shownError}
      hideLabel={hideLabel}
      controlId={controlId}
      hintId={hintId}
      required={required}
      className={className}
    >
      <div className={fieldStyles.iconWrap}>
        {startIcon && (
          <span className={cx(fieldStyles.icon, fieldStyles.iconStart)} aria-hidden="true">
            {startIcon}
          </span>
        )}
        <input
          ref={inputRef}
          id={controlId}
          type={type}
          required={required}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            fieldStyles.control,
            startIcon ? fieldStyles.hasStartIcon : undefined,
            endIcon ? fieldStyles.hasEndIcon : undefined,
          )}
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
        {endIcon && (
          <span className={cx(fieldStyles.icon, fieldStyles.iconEnd)} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </div>
    </Field>
  );
});
