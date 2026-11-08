import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Field.module.css';

export interface FieldBaseProps {
  /** Visible label. Required: placeholders are not labels. */
  label: ReactNode;
  /** Supporting text shown under the label. */
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Hide the label visually while keeping it for assistive tech. */
  hideLabel?: boolean;
}

/**
 * An error message that screen readers announce when it appears.
 *
 * The element is always rendered (empty when there's no error) because live regions are only
 * announced reliably when they exist before their content changes. Empty, it's visually hidden but
 * stays in the accessibility tree. Point `aria-describedby` at it only while there is an error.
 */
export function FieldError({ id, className, children }: { id: string; className?: string; children?: ReactNode }) {
  return (
    <p id={id} className={cx(styles.liveError, className)} aria-live="polite">
      {children}
    </p>
  );
}

/** Ids that tie a control to its label, hint and error. */
export function useFieldIds(id: string | undefined, hint: ReactNode, error: ReactNode) {
  const generated = useId();
  const controlId = id ?? `ds-field-${generated}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return { controlId, hintId, errorId, describedBy };
}

interface FieldProps extends FieldBaseProps {
  controlId: string;
  hintId?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Internal layout shared by text-like controls: label, hint, control, error. */
export function Field({
  label,
  hint,
  error,
  hideLabel,
  controlId,
  hintId,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={controlId} className={cx(styles.label, hideLabel && styles.hiddenLabel)}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children}
      <FieldError id={`${controlId}-error`} className={styles.error}>
        {error}
      </FieldError>
    </div>
  );
}
