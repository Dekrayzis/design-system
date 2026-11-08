import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

// jsdom hides [popover] elements but has no showPopover(). Components only call the Popover API
// when it exists and toggle `hidden` themselves, so let un-hidden popovers display as in a browser.
const popoverStyle = document.createElement('style');
popoverStyle.textContent = '[popover]:not([hidden]) { display: block; }';
document.head.appendChild(popoverStyle);

// jsdom does not implement the modal parts of <dialog>. This mirrors the browser closely enough
// for component tests: showModal/close toggle the attribute, move focus in and fire 'close'.
// Escape is handled by the Dialog component itself, so it isn't simulated here.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
    const firstFocusable = this.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
