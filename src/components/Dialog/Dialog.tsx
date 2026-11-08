import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  /** Called on Escape, the close button, a backdrop click (if enabled) or `<form method="dialog">` submit. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons, usually right-aligned. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Close when the backdrop is clicked. Off by default for dialogs with forms. */
  closeOnBackdropClick?: boolean;
  /** Hide the × button, e.g. when the footer already has a Cancel action. */
  hideCloseButton?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * A modal built on the native `<dialog>` element, which gives focus trapping, the top layer,
 * inert background content and Escape handling for free. Focus returns to the trigger on close.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnBackdropClick = false,
  hideCloseButton = false,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    // The <dialog> always renders, so the ref is set by the time effects run.
    const dialog = ref.current!;

    if (open) {
      if (!dialog.open) {
        returnFocusTo.current = document.activeElement as HTMLElement | null;
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) dialog.close();
    // Restore focus here rather than in the 'close' event, so it also happens when the dialog
    // was already closed natively (form[method=dialog]) before the parent flipped `open`.
    if (returnFocusTo.current) {
      returnFocusTo.current.focus?.();
      returnFocusTo.current = null;
    }
  }, [open]);

  // The native 'close' event fires for form[method=dialog] submits and dialog.close().
  useEffect(() => {
    // The <dialog> always renders, so the ref is set by the time effects run.
    const dialog = ref.current!;

    const handleClose = () => {
      // Only report closes the parent didn't ask for.
      if (openRef.current) onClose();
    };
    // Fallback for closes that arrive without a keydown, e.g. the Android back gesture.
    const handleCancel = (event: Event) => {
      // Let React state drive the close so `open` stays the source of truth.
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    // Clicks on the ::backdrop target the dialog element itself.
    if (closeOnBackdropClick && event.target === event.currentTarget) onClose();
  };

  // Handle Escape ourselves instead of relying on the native 'cancel' event, which Chrome skips
  // for repeated presses without user activation. Preventing the keydown suppresses 'cancel',
  // so onClose fires once.
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, styles[size], className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headings}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          {!hideCloseButton && (
            <IconButton
              label="Close"
              size="sm"
              onClick={onClose}
              icon={
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="m4 4 8 8m0-8-8 8" />
                </svg>
              }
            />
          )}
        </div>
        {children && <div className={styles.body}>{children}</div>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}
