import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { TextArea } from './TextArea';

const meter = (container: HTMLElement) => container.querySelector('[data-state]') as HTMLElement;
const fill = (container: HTMLElement) =>
  (meter(container).querySelector('[aria-hidden="true"] > span') as HTMLElement).style.getPropertyValue('--fill');

describe('TextArea character count', () => {
  it('is off by default', () => {
    const { container } = render(<TextArea label="Brief" maxLength={100} />);
    expect(meter(container)).toBeNull();
    expect(screen.queryByText('0 / 100')).not.toBeInTheDocument();
  });

  it('shows a bar and "n / max", hidden from assistive tech, with the limit as a description', async () => {
    const { container } = render(<TextArea label="Brief" maxLength={100} showCount />);
    const textarea = screen.getByRole('textbox', { name: 'Brief' });
    expect(textarea).toHaveAccessibleDescription('Up to 100 characters.');
    // The changing number never becomes part of the name or description.
    expect(screen.getByText('0 / 100').closest('[aria-hidden="true"]')).not.toBeNull();

    await userEvent.type(textarea, 'Hello');
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
    expect(fill(container)).toBe('5%');
  });

  it('moves through short, good, near and full', async () => {
    const { container } = render(<TextArea label="Brief" minLength={5} maxLength={10} showCount />);
    const textarea = screen.getByRole('textbox');
    expect(meter(container)).toHaveAttribute('data-state', 'empty');
    await userEvent.type(textarea, 'abc');
    expect(meter(container)).toHaveAttribute('data-state', 'short');
    await userEvent.type(textarea, 'de');
    expect(meter(container)).toHaveAttribute('data-state', 'good');
    await userEvent.type(textarea, 'fghi');
    expect(meter(container)).toHaveAttribute('data-state', 'near');
    await userEvent.type(textarea, 'jklm');
    // Native maxLength stops at 10.
    expect(textarea).toHaveValue('abcdefghij');
    expect(meter(container)).toHaveAttribute('data-state', 'full');
    expect(fill(container)).toBe('100%');
  });

  it('shows optional status words per state', async () => {
    render(
      <TextArea
        label="Brief"
        minLength={3}
        maxLength={50}
        showCount
        countStatus={{ empty: 'Over to you', short: 'Keep going', good: 'Good to send' }}
      />,
    );
    expect(screen.getByText('Over to you')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), 'ab');
    expect(screen.getByText('Keep going')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), 'c');
    expect(screen.getByText('Good to send')).toBeInTheDocument();
  });

  it('counts without a bar when there is no maxLength', () => {
    const { container } = render(<TextArea label="Notes" defaultValue="Hi there" showCount />);
    expect(screen.getByText('8 characters')).toBeInTheDocument();
    expect(meter(container).querySelector('[aria-hidden="true"] > span[style]')).toBeNull();
    expect(screen.getByRole('textbox')).not.toHaveAccessibleDescription();
  });

  it('tells screen readers what is left once typing pauses near the limit', () => {
    vi.useFakeTimers();
    function Near() {
      const [value, setValue] = useState('x'.repeat(70));
      return (
        <>
          <TextArea label="Brief" maxLength={100} showCount value={value} onChange={(e) => setValue(e.target.value)} />
          <button type="button" onClick={() => setValue('x'.repeat(95))}>
            Nearly
          </button>
          <button type="button" onClick={() => setValue('x'.repeat(100))}>
            Full
          </button>
        </>
      );
    }
    const { container } = render(<Near />);
    const live = container.querySelector('[aria-live="polite"]:not([id$="-error"])') as HTMLElement;
    act(() => vi.advanceTimersByTime(1000));
    // 70% used: nothing to say yet.
    expect(live).toBeEmptyDOMElement();

    act(() => screen.getByRole('button', { name: 'Nearly' }).click());
    expect(live).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(750));
    expect(live).toHaveTextContent('5 characters left.');

    act(() => screen.getByRole('button', { name: 'Full' }).click());
    act(() => vi.advanceTimersByTime(750));
    expect(live).toHaveTextContent('Character limit reached.');
    vi.useRealTimers();
  });

  it('says "1 character left" in the singular', () => {
    vi.useFakeTimers();
    const { container } = render(<TextArea label="Brief" maxLength={10} showCount defaultValue="123456789" />);
    const live = container.querySelector('[aria-live="polite"]:not([id$="-error"])') as HTMLElement;
    act(() => vi.advanceTimersByTime(750));
    expect(live).toHaveTextContent('1 character left.');
    vi.useRealTimers();
  });

  it('counts the controlled value as the user types', async () => {
    function Trimmed() {
      const [value, setValue] = useState('');
      return <TextArea label="Brief" maxLength={20} showCount value={value} onChange={(e) => setValue(e.target.value.trim())} />;
    }
    render(<Trimmed />);
    await userEvent.type(screen.getByRole('textbox'), 'ab ');
    expect(screen.getByText('2 / 20')).toBeInTheDocument();
  });

  it('counts a null value (e.g. from a form library) as empty', () => {
    // React warns that `value` should not be null; that warning is not what's under test.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<TextArea label="Brief" maxLength={20} showCount value={null as unknown as string} onChange={() => {}} />);
      expect(screen.getByText('0 / 20')).toBeInTheDocument();
    } finally {
      error.mockRestore();
    }
  });

  it('copes with being removed straight after a form reset', () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <form aria-label="f">
        <TextArea label="Brief" maxLength={100} showCount defaultValue="Hi" />
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    unmount();
    expect(() => act(() => vi.runAllTimers())).not.toThrow();
    vi.useRealTimers();
  });

  it('follows the field back to its default on form reset', async () => {
    render(
      <form aria-label="f">
        <TextArea label="Brief" maxLength={100} showCount defaultValue="Hi" />
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.type(screen.getByRole('textbox'), ' there');
    expect(screen.getByText('8 / 100')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(await screen.findByText('2 / 100')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TextArea label="Brief" maxLength={100} minLength={10} showCount defaultValue="Hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
