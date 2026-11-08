import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from '../Spinner/Spinner';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Decorative icon before the label. */
  startIcon?: ReactNode;
  /** Decorative icon after the label. */
  endIcon?: ReactNode;
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: ButtonStyleProps & { className?: string }) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);
}

function Content({ startIcon, endIcon, children }: { startIcon?: ReactNode; endIcon?: ReactNode; children: ReactNode }) {
  return (
    <>
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </>
  );
}

export interface ButtonProps extends ButtonStyleProps, ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Shows a spinner, blocks clicks while keeping the button focusable, and announces
   * `loadingLabel` to screen readers. Pass a boolean from the start (`loading={isSaving}`, not only
   * when true) so the announcement region exists before the state changes.
   */
  loading?: boolean;
  /** Announced while loading. Defaults to the button's text when it's a string, else "Loading". */
  loadingLabel?: string;
}

/** An action on the current page. For navigation use `LinkButton`. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    fullWidth,
    startIcon,
    endIcon,
    loading,
    loadingLabel,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const announcement = loadingLabel ?? (typeof children === 'string' ? children : 'Loading');

  const button = (
    <button
      ref={ref}
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" label={null} className={styles.spinner} />
          <span className={styles.label}>{children}</span>
        </>
      ) : (
        <Content startIcon={startIcon} endIcon={endIcon}>
          {children}
        </Content>
      )}
    </button>
  );

  // aria-busy alone is rarely announced, and live content inside a <button> is ignored (its
  // children are presentational), so announce from a sibling status region instead.
  if (loading === undefined) return button;
  return (
    <>
      {button}
      <VisuallyHidden role="status">{loading ? announcement : ''}</VisuallyHidden>
    </>
  );
});

export interface LinkButtonProps extends ButtonStyleProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/** Navigation styled as a button. Renders a real link so open-in-new-tab, history and crawling work. */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { variant, size, fullWidth, startIcon, endIcon, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={buttonClassName({ variant, size, fullWidth, className })} {...rest}>
      <Content startIcon={startIcon} endIcon={endIcon}>
        {children}
      </Content>
    </a>
  );
});
