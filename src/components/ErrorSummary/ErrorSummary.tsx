import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from 'react';
import { cx } from '../../utils/cx';
import styles from './ErrorSummary.module.css';

export interface ErrorSummaryItem {
  /** Id of the control to focus when the item is chosen. */
  id: string;
  message: string;
}

/**
 * Collects a form's errors each time a submit is blocked, for `ErrorSummary`.
 *
 * It reads what the fields already show: every control marked `aria-invalid` and the error message
 * it is described by. So it works with any mix of components and custom messages without wiring.
 * Radio and checkbox groups are listed once. The list clears on a successful submit or reset.
 */
export function useErrorSummary(formRef: RefObject<HTMLFormElement | null>) {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  // Bumped on every blocked submit, so the summary takes focus again on each attempt.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let scheduled = false;

    const scan = () => {
      scheduled = false;
      const seenGroups = new Set<string>();
      const items: ErrorSummaryItem[] = [];
      for (const control of form.querySelectorAll<HTMLElement>('[aria-invalid="true"]')) {
        const input = control as HTMLInputElement;
        if ((input.type === 'radio' || input.type === 'checkbox') && input.name) {
          if (seenGroups.has(input.name)) continue;
          seenGroups.add(input.name);
        }
        const errorElement = (control.getAttribute('aria-describedby') ?? '')
          .split(/\s+/)
          .map((id) => (id ? document.getElementById(id) : null))
          .find((element) => element?.id.endsWith('-error'));
        const message = errorElement?.textContent?.trim();
        if (control.id && message) items.push({ id: control.id, message });
      }
      setErrors(items);
      setAttempt((n) => n + 1);
    };

    // `invalid` doesn't bubble: listen in the capture phase. Scan once the fields have rendered
    // their messages, i.e. after this event loop turn.
    const onInvalid = () => {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(scan, 0);
    };
    const clear = () => setErrors([]);

    form.addEventListener('invalid', onInvalid, true);
    form.addEventListener('submit', clear);
    form.addEventListener('reset', clear);
    return () => {
      form.removeEventListener('invalid', onInvalid, true);
      form.removeEventListener('submit', clear);
      form.removeEventListener('reset', clear);
    };
  }, [formRef]);

  return { errors, attempt };
}

export interface ErrorSummaryProps {
  errors: ErrorSummaryItem[];
  /** From `useErrorSummary`; the summary takes focus whenever it changes. */
  attempt?: number;
  title?: ReactNode;
  className?: string;
}

/**
 * A list of a form's errors, shown above the form after a blocked submit (the GOV.UK pattern).
 * It takes focus so screen reader users hear what went wrong, and each item links to its field.
 */
export function ErrorSummary({ errors, attempt = 0, title = 'There is a problem', className }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const hasErrors = errors.length > 0;

  useEffect(() => {
    if (hasErrors) ref.current?.focus();
  }, [hasErrors, attempt]);

  if (!hasErrors) return null;

  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView?.({ block: 'center' });
  };

  return (
    <div ref={ref} tabIndex={-1} aria-labelledby={titleId} className={cx(styles.summary, className)}>
      <div role="alert">
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <ul className={styles.list}>
          {errors.map((error) => (
            <li key={error.id}>
              <a href={`#${error.id}`} className={styles.link} onClick={(event) => goTo(event, error.id)}>
                {error.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
