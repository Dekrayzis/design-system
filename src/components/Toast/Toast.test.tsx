import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { axe } from '../../test/axe';
import { setMotionPaused } from '../../utils/motion';
import { Toaster, clearToasts, dismissToast, toast } from './Toast';

afterEach(() => {
  act(() => clearToasts());
  act(() => setMotionPaused(false));
  vi.useRealTimers();
});

/** Dismissed toasts slide out for 320ms before they're removed. */
const EXIT_MS = 320;
const leaving = () => document.querySelectorAll('[data-leaving]');

const polite = () => screen.getByRole('status');
const assertive = () => screen.getByRole('alert');

describe('Toast', () => {
  it('keeps both live regions in the page before any toast, inside a labelled landmark', () => {
    render(<Toaster />);
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(polite()).toBeEmptyDOMElement();
    expect(assertive()).toBeEmptyDOMElement();
  });

  it('announces success and info politely, warnings and errors assertively', () => {
    render(<Toaster />);
    act(() => {
      toast('Saved');
      toast('Heads up', { tone: 'info' });
      toast('Almost full', { tone: 'warning' });
      toast('Could not save', { tone: 'error' });
    });
    expect(polite()).toHaveTextContent('SavedHeads up');
    expect(assertive()).toHaveTextContent('Almost fullCould not save');
  });

  it('can be raised before the Toaster mounts (e.g. just before navigating)', () => {
    act(() => {
      toast('Project saved');
    });
    render(<Toaster />);
    expect(polite()).toHaveTextContent('Project saved');
  });

  it('closes itself after its duration', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    act(() => vi.advanceTimersByTime(2999));
    expect(polite()).toHaveTextContent('Saved');
    act(() => vi.advanceTimersByTime(1));
    // Time's up: it slides off screen, then is removed.
    expect(leaving()).toHaveLength(1);
    expect(polite()).toHaveTextContent('Saved');
    act(() => vi.advanceTimersByTime(EXIT_MS));
    expect(polite()).toBeEmptyDOMElement();
  });

  it('keeps errors and toasts with actions until dismissed', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Failed', { tone: 'error' });
      toast('Archived', { action: { label: 'Undo', onClick: () => {} } });
    });
    act(() => vi.advanceTimersByTime(60_000));
    expect(assertive()).toHaveTextContent('Failed');
    expect(polite()).toHaveTextContent('Archived');
  });

  it('pauses while hovered (WCAG 2.2.1) and resumes with time to read', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.pointerEnter(region);
    act(() => vi.advanceTimersByTime(10_000));
    expect(polite()).toHaveTextContent('Saved');
    fireEvent.pointerLeave(region);
    act(() => vi.advanceTimersByTime(1999));
    expect(leaving()).toHaveLength(0);
    act(() => vi.advanceTimersByTime(1 + EXIT_MS));
    expect(polite()).toBeEmptyDOMElement();
  });

  it('pauses while keyboard focus is inside', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    act(() => vi.advanceTimersByTime(10_000));
    expect(polite()).toHaveTextContent('Saved');
  });

  it('resumes once keyboard focus leaves the stack', () => {
    vi.useFakeTimers();
    render(
      <>
        <button type="button">Elsewhere</button>
        <Toaster />
      </>,
    );
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    const dismiss = screen.getByRole('button', { name: 'Dismiss' });
    act(() => dismiss.focus());
    act(() => vi.advanceTimersByTime(10_000));
    expect(leaving()).toHaveLength(0);

    // Moving between controls inside the stack keeps it held; leaving it releases.
    act(() => screen.getByRole('button', { name: 'Elsewhere' }).focus());
    act(() => vi.advanceTimersByTime(3000));
    expect(leaving()).toHaveLength(1);
  });

  it('keeps a toast raised while held until the hold ends', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    const region = screen.getByRole('region', { name: 'Notifications' });
    fireEvent.pointerEnter(region);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    act(() => vi.advanceTimersByTime(10_000));
    expect(leaving()).toHaveLength(0);
    fireEvent.pointerLeave(region);
    act(() => vi.advanceTimersByTime(2999));
    expect(leaving()).toHaveLength(0);
    act(() => vi.advanceTimersByTime(1));
    expect(leaving()).toHaveLength(1);
  });

  it('counts a repeated pointerenter as one hover', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    fireEvent.pointerEnter(region);
    fireEvent.pointerEnter(region);
    fireEvent.pointerLeave(region);
    expect(region).not.toHaveAttribute('data-held');
    act(() => vi.advanceTimersByTime(3000));
    expect(leaving()).toHaveLength(1);
  });

  it('stays held while focus moves between toasts', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('One', { duration: 3000 });
      toast('Two', { duration: 3000 });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    const [first, second] = within(polite()).getAllByRole('button', { name: 'Dismiss' });
    act(() => first!.focus());
    // Focus leaving the first toast for the second is still inside the stack.
    fireEvent.focusOut(first!, { relatedTarget: second });
    expect(region).toHaveAttribute('data-held');
    act(() => second!.focus());
    act(() => vi.advanceTimersByTime(10_000));
    expect(leaving()).toHaveLength(0);
  });

  it('renders an empty, unheld stack on the server', () => {
    render(<Toaster />);
    act(() => {
      toast('Saved');
    });
    // Hold the client stack, so only the server snapshot can report "not held".
    fireEvent.pointerEnter(screen.getByRole('region', { name: 'Notifications' }));
    const html = renderToString(<Toaster />);
    expect(html).toContain('aria-label="Notifications"');
    expect(html).not.toContain('Saved');
    expect(html).not.toContain('data-held');
  });

  it('stays paused until both hover and focus have ended', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 3000 });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    fireEvent.pointerEnter(region);
    act(() => screen.getByRole('button', { name: 'Dismiss' }).focus());
    fireEvent.pointerLeave(region);
    act(() => vi.advanceTimersByTime(10_000));
    expect(leaving()).toHaveLength(0);
    expect(region).toHaveAttribute('data-held');
  });

  it('pauses while the tab is hidden, so nobody misses a toast (WCAG 2.2.1)', () => {
    vi.useFakeTimers();
    let hidden = false;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    try {
      render(<Toaster />);
      act(() => {
        toast('Saved', { duration: 3000 });
      });
      act(() => vi.advanceTimersByTime(1000));
      hidden = true;
      act(() => document.dispatchEvent(new Event('visibilitychange')));
      act(() => vi.advanceTimersByTime(60_000));
      expect(polite()).toHaveTextContent('Saved');
      expect(leaving()).toHaveLength(0);

      // Back in view, it picks up where it left off: 2s of its 3s remain.
      hidden = false;
      act(() => document.dispatchEvent(new Event('visibilitychange')));
      act(() => vi.advanceTimersByTime(1999));
      expect(leaving()).toHaveLength(0);
      act(() => vi.advanceTimersByTime(1));
      expect(leaving()).toHaveLength(1);
    } finally {
      // @ts-expect-error drop the instance override so jsdom's own getter applies again
      delete document.hidden;
    }
  });

  it('starts paused when it mounts in a tab that is already hidden', () => {
    vi.useFakeTimers();
    let hidden = true;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    try {
      act(() => {
        toast('Saved', { duration: 3000 });
      });
      const { unmount } = render(<Toaster />);
      act(() => vi.advanceTimersByTime(60_000));
      expect(leaving()).toHaveLength(0);
      // Unmounting while hidden hands the hold back, so timers can run again later.
      unmount();
      hidden = false;
      render(<Toaster />);
      act(() => vi.advanceTimersByTime(3000));
      expect(leaving()).toHaveLength(1);
    } finally {
      // @ts-expect-error drop the instance override so jsdom's own getter applies again
      delete document.hidden;
    }
  });

  it('ignores a second dismiss of the same toast, or an unknown id', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    let id = 0;
    act(() => {
      id = toast('Saved');
    });
    act(() => dismissToast(id));
    act(() => dismissToast(id));
    act(() => dismissToast(9999));
    expect(leaving()).toHaveLength(1);
    act(() => vi.advanceTimersByTime(EXIT_MS));
    expect(polite()).toBeEmptyDOMElement();
  });

  it('runs and dismisses with its action', async () => {
    const onUndo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast('Archived', { action: { label: 'Undo', onClick: onUndo } });
    });
    await userEvent.click(within(polite()).getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(polite()).toBeEmptyDOMElement());
  });

  it('can be dismissed with its button or by id', async () => {
    render(<Toaster />);
    let id = 0;
    act(() => {
      toast('One');
      id = toast('Two');
    });
    await userEvent.click(within(polite()).getAllByRole('button', { name: 'Dismiss' })[0]!);
    await waitFor(() => expect(polite()).not.toHaveTextContent('One'));
    expect(polite()).toHaveTextContent('Two');
    act(() => dismissToast(id));
    await waitFor(() => expect(polite()).toBeEmptyDOMElement());
  });

  it('removes instantly, without the slide, when motion is reduced', () => {
    render(<Toaster />);
    act(() => setMotionPaused(true));
    let id = 0;
    act(() => {
      id = toast('Saved');
    });
    act(() => dismissToast(id));
    expect(polite()).toBeEmptyDOMElement();
  });

  it('shows a description under the message', () => {
    render(<Toaster />);
    act(() => {
      toast('Invite sent', { description: 'They’ll get an email in a minute.' });
    });
    expect(polite()).toHaveTextContent('Invite sentThey’ll get an email in a minute.');
  });

  it('shows a countdown only for timed toasts, frozen while held', () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast('Timed', { duration: 4000 });
      toast('Sticky', { tone: 'error' });
    });
    const timed = screen.getByText('Timed').closest('[data-tone]') as HTMLElement;
    const sticky = screen.getByText('Sticky').closest('[data-tone]') as HTMLElement;
    expect(timed.style.getPropertyValue('--toast-duration')).toBe('4000ms');
    expect(timed.querySelector('[aria-hidden="true"]:last-child')).not.toBeNull();
    expect(sticky.style.getPropertyValue('--toast-duration')).toBe('');

    const toaster = container.querySelector('section') as HTMLElement;
    fireEvent.pointerEnter(toaster);
    expect(toaster).toHaveAttribute('data-held');
    fireEvent.pointerLeave(toaster);
    expect(toaster).not.toHaveAttribute('data-held');
  });

  it('orders toasts by time across both regions, newest nearest the edge', () => {
    const { rerender } = render(<Toaster />);
    act(() => {
      toast('First');
      toast('Second', { tone: 'error' });
      toast('Third');
    });
    const order = (text: string) => Number((screen.getByText(text).closest('[style*="order"]') as HTMLElement).style.order);
    expect(order('First')).toBeLessThan(order('Second'));
    expect(order('Second')).toBeLessThan(order('Third'));

    rerender(<Toaster position="top-right" />);
    // At the top, the newest comes first.
    expect(order('Third')).toBeLessThan(order('First'));
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveAttribute('data-position', 'top-right');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast('Saved');
      toast('Failed', { tone: 'error', action: { label: 'Retry', onClick: () => {} } });
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
