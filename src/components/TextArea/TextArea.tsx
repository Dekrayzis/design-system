import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldValidation, type ValidationProps } from '../../utils/validation';
import { Field, useFieldIds, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './TextArea.module.css';

export interface TextAreaProps
  extends FieldBaseProps,
    ValidationProps<string>,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Decorative icon pinned to the first line, at the start. */
  startIcon?: ReactNode;
  /** Decorative icon pinned to the first line, at the end. */
  endIcon?: ReactNode;
  /**
   * Show a character count under the field (off by default). With `maxLength` it's a bar that
   * fills towards the limit plus "120 / 500"; with `minLength` the bar shows when there's enough.
   * Screen readers hear the limit as a description and, once typing pauses near the limit, how
   * many characters are left.
   */
  showCount?: boolean;
  /** Optional words beside the count for each state, e.g. `{ short: 'Keep going' }`. */
  countStatus?: Partial<Record<CountState, ReactNode>>;
  className?: string;
}

export type CountState = 'empty' | 'short' | 'good' | 'near' | 'full';

/** Share of the limit at which the bar warns, and from which screen readers hear what's left. */
const NEAR = 0.9;
const ANNOUNCE_FROM = 0.8;
const ANNOUNCE_DELAY_MS = 750;

function countState(length: number, min: number | undefined, max: number | undefined): CountState {
  if (length === 0) return 'empty';
  if (max && length >= max) return 'full';
  if (min && length < min) return 'short';
  if (max && length >= max * NEAR) return 'near';
  return 'good';
}

/** Multi-line text input with a label, optional hint, icons, validation and an optional character count. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    hint,
    error,
    hideLabel,
    id,
    className,
    required,
    rows = 4,
    startIcon,
    endIcon,
    showCount = false,
    countStatus,
    validate,
    validationMessages,
    validateOn,
    onBlur,
    onChange,
    onInvalid,
    ...textareaProps
  },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const validation = useFieldValidation(textareaRef, {
    // Only read while mounted, so the textarea is there.
    getValue: () => textareaRef.current!.value,
    validate,
    validationMessages,
    validateOn,
  });
  const shownError = error ?? validation.error;
  const { controlId, hintId, describedBy } = useFieldIds(id, hint, shownError);

  /* ---- Optional character count ---- */
  const { maxLength: max, minLength: min, value, defaultValue } = textareaProps;
  const isControlled = value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? '').length);
  const length = isControlled ? String(value ?? '').length : uncontrolledLength;
  const state = countState(length, min, max);
  const limitId = `${controlId}-limit`;

  // Uncontrolled fields go back to their default on form reset; follow them.
  useEffect(() => {
    const form = textareaRef.current?.form;
    if (!showCount || isControlled || !form) return;
    const onReset = () =>
      window.setTimeout(() => setUncontrolledLength(textareaRef.current?.value.length ?? 0), 0);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [showCount, isControlled]);

  // Near the limit, tell screen reader users what's left once typing pauses. The visible number
  // is hidden from them: announcing it on every key would drown out what they type.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (!showCount || !max) return;
    const timer = window.setTimeout(() => {
      const left = max - length;
      if (left <= 0) setAnnouncement('Character limit reached.');
      else if (length >= max * ANNOUNCE_FROM)
        setAnnouncement(`${left.toLocaleString()} ${left === 1 ? 'character' : 'characters'} left.`);
      else setAnnouncement('');
    }, ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [showCount, max, length]);

  const fieldDescribedBy =
    [describedBy, showCount && max ? limitId : undefined].filter(Boolean).join(' ') || undefined;

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
          <span className={cx(fieldStyles.icon, fieldStyles.iconStart, fieldStyles.iconTop)} aria-hidden="true">
            {startIcon}
          </span>
        )}
        <textarea
          ref={textareaRef}
          id={controlId}
          rows={rows}
          required={required}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={fieldDescribedBy}
          className={cx(
            fieldStyles.control,
            styles.textarea,
            startIcon ? fieldStyles.hasStartIcon : undefined,
            endIcon ? fieldStyles.hasEndIcon : undefined,
          )}
          onBlur={(event: FocusEvent<HTMLTextAreaElement>) => {
            validation.onBlur();
            onBlur?.(event);
          }}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            // Unused while controlled (the count reads `value`), so it's safe to track either way.
            setUncontrolledLength(event.target.value.length);
            onChange?.(event);
            validation.onValueChange();
          }}
          onInvalid={(event) => {
            validation.onInvalid(event);
            onInvalid?.(event);
          }}
          {...textareaProps}
        />
        {endIcon && (
          <span className={cx(fieldStyles.icon, fieldStyles.iconEnd, fieldStyles.iconTop)} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </div>
      {showCount && (
        <div className={styles.count} data-state={state}>
          {max ? (
            <span className={styles.meter} aria-hidden="true">
              <span
                className={styles.fill}
                style={{ '--fill': `${Math.min(length / max, 1) * 100}%` } as CSSProperties}
              />
            </span>
          ) : null}
          {/* Hidden from assistive tech: a number that changes on every key would be noise. */}
          <span className={styles.foot} aria-hidden="true">
            <span>{countStatus?.[state]}</span>
            <span className={styles.number}>
              {max ? `${length.toLocaleString()} / ${max.toLocaleString()}` : `${length.toLocaleString()} characters`}
            </span>
          </span>
          {max ? <VisuallyHidden id={limitId}>Up to {max.toLocaleString()} characters.</VisuallyHidden> : null}
          <VisuallyHidden aria-live="polite">{announcement}</VisuallyHidden>
        </div>
      )}
    </Field>
  );
});
