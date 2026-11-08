import { act, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { cx } from './cx';
import { textFromNode } from './textFromNode';
import { useAnchorPosition } from './useAnchorPosition';
import { isFirstInvalid, validityMessage } from './validation';

describe('cx', () => {
  it('joins truthy class names and skips the rest', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
    expect(cx()).toBe('');
  });
});

describe('textFromNode', () => {
  it.each([
    ['plain text', 'plain text'],
    [42, '42'],
    [null, ''],
    [undefined, ''],
    [true, ''],
    [['a', 'b', 3], 'ab3'],
  ])('%j → %j', (node, text) => {
    expect(textFromNode(node as never)).toBe(text);
  });

  it('reads through nested elements and fragments', () => {
    expect(
      textFromNode(
        <>
          London <small>GMT+1</small>
          {[' · ', <strong key="x">now</strong>]}
        </>,
      ),
    ).toBe('London GMT+1 · now');
  });

  it('ignores non-text, non-element values', () => {
    expect(textFromNode({} as never)).toBe('');
  });
});

describe('validityMessage', () => {
  /** jsdom gives no `validationMessage`, so these exercise the built-in English fallbacks. */
  const invalid = (html: string, prepare?: (el: HTMLInputElement) => void) => {
    const host = document.createElement('div');
    host.innerHTML = html;
    const el = host.firstElementChild as HTMLInputElement;
    prepare?.(el);
    return el;
  };

  it('returns null for valid elements', () => {
    expect(validityMessage(invalid('<input value="ok" required>'))).toBeNull();
  });

  it.each([
    ['<input required>', 'This field is required.'],
    ['<input type="checkbox" required>', 'Check this box to continue.'],
    ['<input type="radio" name="r" required>', 'Select an option.'],
    ['<select required><option value="">-</option></select>', 'Select an option.'],
    ['<input type="email" value="nope">', 'Enter a valid email address.'],
    ['<input type="url" value="nope">', 'Enter a valid URL.'],
    ['<input pattern="[0-9]+" value="abc">', 'Match the requested format.'],
    ['<input type="number" min="5" value="2">', 'Enter 5 or more.'],
    ['<input type="number" max="5" value="9">', 'Enter 5 or less.'],
  ])('%s → %s', (html, message) => {
    expect(validityMessage(invalid(html))).toBe(message);
  });

  it('prefers a custom message map over fallbacks', () => {
    expect(validityMessage(invalid('<input required>'), { valueMissing: 'Enter your name.' })).toBe('Enter your name.');
  });

  it('shows the custom validity message for customError', () => {
    const el = invalid('<input>', (input) => input.setCustomValidity('Taken.'));
    expect(validityMessage(el)).toBe('Taken.');
  });

  it('falls back for constraint types without their own wording', () => {
    const el = invalid('<input>');
    // Simulate a validity state jsdom can't produce (tooShort only follows user edits).
    Object.defineProperty(el, 'validity', {
      value: { valid: false, tooShort: true, customError: false, valueMissing: false } as unknown as ValidityState,
    });
    el.minLength = 8;
    expect(validityMessage(el)).toBe('Use at least 8 characters.');
  });
});

describe('isFirstInvalid', () => {
  it('is true for a control outside any form', () => {
    expect(isFirstInvalid(document.createElement('input'))).toBe(true);
  });

  it('picks the first invalid control in document order, skipping valid ones', () => {
    const form = document.createElement('form');
    form.innerHTML = '<input value="ok" required><input id="a" required><input id="b" required>';
    document.body.appendChild(form);
    expect(isFirstInvalid(form.querySelector('#a') as HTMLInputElement)).toBe(true);
    expect(isFirstInvalid(form.querySelector('#b') as HTMLInputElement)).toBe(false);
    form.remove();
  });
});

describe('useAnchorPosition', () => {
  const rect = (r: Partial<DOMRect>) => () => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() {}, ...r }) as DOMRect;

  function Harness({ open, top }: { open: boolean; top: number }) {
    const anchor = useRef<HTMLButtonElement>(null);
    const floating = useRef<HTMLDivElement>(null);
    useAnchorPosition(open, anchor, floating, { offset: 4, margin: 8, maxHeight: 300 });
    return (
      <>
        <button
          type="button"
          ref={(el) => {
            anchor.current = el;
            if (el) el.getBoundingClientRect = rect({ top, bottom: top + 40, left: 100, width: 200, height: 40 });
          }}
        >
          Anchor
        </button>
        <div
          data-testid="floating"
          ref={(el) => {
            floating.current = el;
            if (el) Object.defineProperty(el, 'scrollHeight', { value: 250, configurable: true });
          }}
        />
      </>
    );
  }

  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  it('places the floating element below the anchor when there is room', () => {
    const { getByTestId } = render(<Harness open top={100} />);
    const floating = getByTestId('floating');
    expect(floating.dataset.side).toBe('bottom');
    expect(floating.style.top).toBe('144px');
    expect(floating.style.minWidth).toBe('200px');
    expect(floating.style.maxHeight).toBe('300px');
  });

  it('flips above when there is more room above', () => {
    const { getByTestId } = render(<Harness open top={700} />);
    const floating = getByTestId('floating');
    expect(floating.dataset.side).toBe('top');
    expect(floating.style.bottom).toBe('104px');
    expect(floating.style.top).toBe('auto');
  });

  it('does nothing while closed', () => {
    const { getByTestId } = render(<Harness open={false} top={100} />);
    expect(getByTestId('floating').dataset.side).toBeUndefined();
  });

  const nextFrame = () => act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

  it('follows the anchor on resize and on scroll in any ancestor', async () => {
    const { getByTestId, rerender } = render(<Harness open top={100} />);
    const floating = getByTestId('floating');

    // The anchor moves (e.g. the page scrolled); nothing changes until an event reports it.
    rerender(<Harness open top={700} />);
    expect(floating.dataset.side).toBe('bottom');
    fireEvent(window, new Event('resize'));
    await nextFrame();
    expect(floating.dataset.side).toBe('top');

    rerender(<Harness open top={100} />);
    fireEvent.scroll(document.body);
    await nextFrame();
    expect(floating.dataset.side).toBe('bottom');
    expect(floating.style.top).toBe('144px');
  });

  it('follows size changes of either element, and stops observing when closed', async () => {
    let notify: ResizeObserverCallback = () => {};
    const observed: Element[] = [];
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          notify = callback;
        }
        observe(target: Element) {
          observed.push(target);
        }
        unobserve() {}
        disconnect = disconnect;
      },
    );
    try {
      const { getByRole, getByTestId, rerender } = render(<Harness open top={100} />);
      const floating = getByTestId('floating');
      expect(observed).toEqual([getByRole('button'), floating]);

      rerender(<Harness open top={700} />);
      notify([], {} as ResizeObserver);
      await nextFrame();
      expect(floating.dataset.side).toBe('top');

      rerender(<Harness open={false} top={700} />);
      expect(disconnect).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
