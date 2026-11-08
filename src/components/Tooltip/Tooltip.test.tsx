import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { Dialog } from '../Dialog/Dialog';
import { Tooltip } from './Tooltip';

function Save(props: Partial<React.ComponentProps<typeof Tooltip>>) {
  return (
    <Tooltip content="Saves a draft" {...props}>
      <button type="button">Save</button>
    </Tooltip>
  );
}

const tip = () => screen.getByText('Saves a draft');

/**
 * jsdom has no Popover API. This stands in for it: showPopover/hidePopover toggle an open flag
 * that `matches(':popover-open')` reports, as in a browser. Call `restore()` when done.
 */
function mockPopoverApi() {
  const openElements = new WeakSet<Element>();
  const originalMatches = Element.prototype.matches;
  const show = vi.fn(function (this: HTMLElement) {
    openElements.add(this);
  });
  const hide = vi.fn(function (this: HTMLElement) {
    openElements.delete(this);
  });
  HTMLElement.prototype.showPopover = show;
  HTMLElement.prototype.hidePopover = hide;
  Element.prototype.matches = function matches(this: Element, selector: string) {
    return selector === ':popover-open' ? openElements.has(this) : originalMatches.call(this, selector);
  };
  return {
    show,
    hide,
    isOpen: (element: Element) => openElements.has(element),
    restore() {
      Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
      Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover');
      Element.prototype.matches = originalMatches;
    },
  };
}

describe('Tooltip', () => {
  it('describes its trigger (description mode)', () => {
    render(<Save />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAccessibleDescription('Saves a draft');
    expect(tip()).toHaveAttribute('role', 'tooltip');
    expect(tip()).not.toBeVisible();
  });

  it('keeps an existing description alongside its own', () => {
    render(
      <>
        <p id="hint">Ctrl+S</p>
        <Tooltip content="Saves a draft">
          <button type="button" aria-describedby="hint">Save</button>
        </Tooltip>
      </>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Ctrl+S Saves a draft');
  });

  it('is hidden from assistive tech in label mode', () => {
    render(
      <Tooltip content="Settings" kind="label">
        <button type="button" aria-label="Settings">⚙</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows immediately on keyboard focus and hides on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Save />
        <button type="button">Next</button>
      </>,
    );
    await user.tab();
    expect(tip()).toBeVisible();
    await user.tab();
    expect(tip()).not.toBeVisible();
  });

  it('shows after a delay on hover', () => {
    vi.useFakeTimers();
    // Step past the "another tooltip just closed, skip the delay" window left by earlier tests.
    vi.setSystemTime(Date.now() + 5000);
    render(<Save delay={300} />);
    fireEvent.pointerEnter(screen.getByRole('button').parentElement!);
    expect(tip()).not.toBeVisible();
    act(() => vi.advanceTimersByTime(300));
    expect(tip()).toBeVisible();
    vi.useRealTimers();
  });

  it('stays open while the pointer moves onto the tooltip (WCAG 1.4.13 hoverable)', () => {
    vi.useFakeTimers();
    render(<Save delay={0} />);
    const anchor = screen.getByRole('button').parentElement!;
    fireEvent.pointerEnter(anchor);
    act(() => vi.advanceTimersByTime(0));
    fireEvent.pointerLeave(anchor);
    fireEvent.pointerEnter(tip());
    act(() => vi.advanceTimersByTime(500));
    expect(tip()).toBeVisible();

    fireEvent.pointerLeave(tip());
    act(() => vi.advanceTimersByTime(500));
    expect(tip()).not.toBeVisible();
    vi.useRealTimers();
  });

  it('is dismissed with Escape without moving focus (WCAG 1.4.13 dismissable)', async () => {
    const user = userEvent.setup();
    render(<Save />);
    await user.tab();
    await user.keyboard('{Escape}');
    expect(tip()).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  });

  it('closes only itself on Escape inside a dialog', async () => {
    const onClose = vi.fn();
    function InDialog() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open</button>
          <Dialog open={open} onClose={onClose} title="Edit" hideCloseButton>
            <Save />
          </Dialog>
        </>
      );
    }
    const user = userEvent.setup();
    render(<InDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    // Focus lands on the Save button inside the dialog; show its tooltip from the keyboard.
    await user.tab();
    await user.tab({ shift: true });
    expect(tip()).toBeVisible();
    await user.keyboard('{Escape}');
    expect(tip()).not.toBeVisible();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('still shows on keyboard focus where :focus-visible is unsupported', async () => {
    const user = userEvent.setup();
    const originalMatches = Element.prototype.matches;
    const matches = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
      if (selector === ':focus-visible') throw new SyntaxError(`'${selector}' is not a valid selector`);
      return originalMatches.call(this, selector);
    });
    try {
      render(<Save />);
      await user.tab();
      expect(tip()).toBeVisible();
    } finally {
      matches.mockRestore();
    }
  });

  describe('top layer', () => {
    let popover: ReturnType<typeof mockPopoverApi>;
    beforeEach(() => {
      popover = mockPopoverApi();
    });
    afterEach(() => popover.restore());

    it('shows the tooltip as a popover while open and hides it when closed', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Save />
          <button type="button">Next</button>
        </>,
      );
      const element = tip();
      expect(popover.show).not.toHaveBeenCalled();
      expect(popover.hide).not.toHaveBeenCalled();

      await user.tab();
      expect(popover.show).toHaveBeenCalledTimes(1);
      expect(popover.show.mock.contexts[0]).toBe(element);
      expect(popover.isOpen(element)).toBe(true);

      await user.tab();
      expect(popover.hide).toHaveBeenCalledTimes(1);
      expect(popover.hide.mock.contexts[0]).toBe(element);
      expect(popover.isOpen(element)).toBe(false);
      expect(popover.show).toHaveBeenCalledTimes(1);
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Save />);
    await userEvent.tab();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('lets Escape through when its trigger has opened a popup, so one press closes both', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    render(
      <div onKeyDown={(event) => event.key === 'Escape' && onEscape()}>
        <Tooltip content="Saves a draft">
          <button type="button" aria-expanded="true">
            Save
          </button>
        </Tooltip>
      </div>,
    );
    await user.tab();
    expect(tip()).toBeVisible();
    await user.keyboard('{Escape}');
    expect(tip()).not.toBeVisible();
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('keeps Escape to itself when its trigger has nothing open', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    render(
      <div onKeyDown={(event) => event.key === 'Escape' && onEscape()}>
        <Save />
      </div>,
    );
    await user.tab();
    await user.keyboard('{Escape}');
    expect(onEscape).not.toHaveBeenCalled();
  });
});
