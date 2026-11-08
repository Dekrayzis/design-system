import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { buttonClassName, type ButtonSize, type ButtonVariant } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  /** The icon. It is hidden from assistive tech; `label` names the button. */
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Show `label` in a tooltip on hover and keyboard focus (default), so sighted mouse and keyboard
   * users can see what the icon means. Screen readers already get it as the button's name.
   */
  tooltip?: boolean;
}

/** A button whose only content is an icon. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', type = 'button', tooltip = true, className, ...rest },
  ref,
) {
  const button = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={buttonClassName({ variant, size, className: cx(styles.iconButton, styles[size], className) })}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );

  return tooltip ? (
    <Tooltip content={label} kind="label">
      {button}
    </Tooltip>
  ) : (
    button
  );
});
