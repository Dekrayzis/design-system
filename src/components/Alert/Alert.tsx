import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  tone?: AlertTone;
  title?: ReactNode;
  /** Extra controls, e.g. a "Retry" button. */
  actions?: ReactNode;
  /** Renders a dismiss button when provided. */
  onDismiss?: () => void;
  /**
   * How the alert is announced when it appears.
   * - `polite` (role="status"): waits for the user to be idle. Default for info/success.
   * - `assertive` (role="alert"): interrupts. Default for warning/danger.
   * - `off`: not a live region, for alerts present on page load.
   */
  live?: 'polite' | 'assertive' | 'off';
}

const icons: Record<AlertTone, ReactNode> = {
  info: <path d="M10 9v5M10 6.5v.01M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
  success: <path d="m6.5 10.5 2.5 2.5 4.5-5M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
  warning: <path d="M10 7.5v4M10 14.5v.01M8.6 3.2 1.9 15a1.6 1.6 0 0 0 1.4 2.4h13.4a1.6 1.6 0 0 0 1.4-2.4L11.4 3.2a1.6 1.6 0 0 0-2.8 0Z" />,
  danger: <path d="m7.5 7.5 5 5m0-5-5 5M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
};

/** An inline message about the state of the page or a task. */
export function Alert({ tone = 'info', title, actions, onDismiss, live, className, children, ...rest }: AlertProps) {
  const mode = live ?? (tone === 'warning' || tone === 'danger' ? 'assertive' : 'polite');
  const role = mode === 'assertive' ? 'alert' : mode === 'polite' ? 'status' : undefined;

  // Screen readers often ignore a live region that arrives already filled. Mount the empty region
  // first and add the content a tick later so it is announced. (Alerts present on page load should
  // use live="off"; they render immediately.)
  const [ready, setReady] = useState(mode === 'off');
  useEffect(() => setReady(true), []);

  return (
    <div role={role} className={cx(styles.alert, styles[tone], className)} {...rest}>
      {ready && (
        <>
          <svg
            className={styles.icon}
            viewBox="0 0 20 20"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icons[tone]}
          </svg>
          <div className={styles.body}>
            {title && <p className={styles.title}>{title}</p>}
            {children && <div className={styles.content}>{children}</div>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
          {onDismiss && (
            <IconButton
              className={styles.dismiss}
              size="sm"
              label="Dismiss"
              onClick={onDismiss}
              icon={
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="m4 4 8 8m0-8-8 8" />
                </svg>
              }
            />
          )}
        </>
      )}
    </div>
  );
}
