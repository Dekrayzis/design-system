import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from '../../test/axe';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a labelled multi-line textbox', () => {
    render(<TextArea label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('accepts multi-line input', async () => {
    render(<TextArea label="Message" />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Line one{Enter}Line two');
    expect(textarea).toHaveValue('Line one\nLine two');
  });

  it('wires up the error', () => {
    render(<TextArea label="Message" error="Too short." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInvalid();
    expect(textarea).toHaveAccessibleDescription('Too short.');
  });

  it('pins icons to the first line', () => {
    render(<TextArea label="Notes" startIcon={<svg data-testid="icon" />} />);
    const icon = screen.getByTestId('icon').parentElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('iconTop');
    expect(screen.getByRole('textbox')).toHaveClass('hasStartIcon');
  });

  it('pins an end icon to the first line too', () => {
    render(<TextArea label="Notes" endIcon={<svg data-testid="icon" />} />);
    const icon = screen.getByTestId('icon').parentElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('iconTop', 'iconEnd');
    expect(screen.getByRole('textbox')).toHaveClass('hasEndIcon');
    expect(screen.getByRole('textbox')).not.toHaveClass('hasStartIcon');
  });

  it('forwards refs to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea label="Notes" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it("keeps the caller's blur, change and invalid handlers", async () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    const onInvalid = vi.fn();
    render(
      <form aria-label="f">
        <TextArea label="Notes" required onBlur={onBlur} onChange={onChange} onInvalid={onInvalid} />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.type(screen.getByRole('textbox'), 'a');
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('This field is required.');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TextArea label="Bio" hint="Optional." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
