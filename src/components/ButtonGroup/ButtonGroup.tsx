import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from '../../styles/segmented.module.css';
import { Tooltip } from '../Tooltip/Tooltip';

export interface ButtonGroupOption {
  value: string;
  label: ReactNode;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Show only the icon; `label` is kept as the accessible name. */
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface ButtonGroupProps {
  /** Accessible name of the group, e.g. "View mode". */
  label: string;
  options: ButtonGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submits the chosen value with the surrounding form under this name. */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * A segmented control: one choice from a few options, with an accent pill that slides under the
 * chosen one. Exposed as a radio group (roving focus, arrows wrap, Home/End, selection follows
 * focus). Segments share one width, so the thumb is positioned purely in CSS from the option
 * count and chosen index; nothing is measured and it never lags a resize or font load.
 *
 * Use it to pick a value or mode. To switch between panels of content, use `Tabs`.
 */
export function ButtonGroup({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  name,
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
}: ButtonGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const firstEnabled = options.findIndex((option) => !option.disabled);
  // The tab stop is the selected option, or the first enabled one when nothing is selected.
  const tabStop = selectedIndex !== -1 && !options[selectedIndex]?.disabled ? selectedIndex : firstEnabled;

  const choose = (index: number) => {
    const option = options[index];
    // Defensive: clicks and keys never reach a disabled segment, and arrows only land on enabled ones.
    /* v8 ignore next */
    if (!option || option.disabled || disabled) return;
    if (controlledValue === undefined) setUncontrolledValue(option.value);
    if (option.value !== value) onValueChange?.(option.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = options.map((option, i) => (option.disabled ? -1 : i)).filter((i) => i !== -1);
    const position = enabled.indexOf(index);
    let next: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = enabled[(position + 1) % enabled.length];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = enabled[(position - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    // Defensive: the focused segment is enabled, so `enabled` is never empty and `next` is set.
    /* v8 ignore next */
    if (next === undefined) return;
    choose(next);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx(styles.group, styles[size], fullWidth && styles.fullWidth, className)}
      style={{ '--segments': options.length, '--selected': Math.max(selectedIndex, 0) } as CSSProperties}
      data-has-value={selectedIndex !== -1 || undefined}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((option, index) => {
        const checked = index === selectedIndex;
        const segment = (
          <button
            key={option.value}
            ref={(el) => {
              buttons.current[index] = el;
            }}
            id={`${baseId}-${index}`}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.iconOnly && typeof option.label === 'string' ? option.label : undefined}
            tabIndex={index === tabStop ? 0 : -1}
            disabled={disabled || option.disabled}
            className={styles.segment}
            onClick={() => choose(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {option.icon && (
              <span className={styles.icon} aria-hidden="true">
                {option.icon}
              </span>
            )}
            {!option.iconOnly && <span className={styles.label}>{option.label}</span>}
          </button>
        );
        // Icon-only segments show their label on hover and keyboard focus.
        return option.iconOnly ? (
          <Tooltip key={option.value} content={option.label} kind="label" className={styles.tooltipAnchor}>
            {segment}
          </Tooltip>
        ) : (
          segment
        );
      })}
      {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
    </div>
  );
}
