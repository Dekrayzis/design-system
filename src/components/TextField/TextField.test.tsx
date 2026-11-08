import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axe } from '../../test/axe';
import { TextField } from './TextField';

describe('TextField', () => {
  it('is labelled by its visible label', () => {
    render(<TextField label="Full name" />);
    expect(screen.getByRole('textbox', { name: 'Full name' })).toBeInTheDocument();
  });

  it('keeps the accessible name when the label is visually hidden', () => {
    render(<TextField label="Search" hideLabel type="search" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('describes the input with its hint', () => {
    render(<TextField label="Username" hint="Letters and numbers only." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Letters and numbers only.');
  });

  it('marks the input invalid and announces the error alongside the hint', () => {
    render(<TextField label="Email" type="email" hint="Work email." error="Enter a valid email." />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Work email. Enter a valid email.');
  });

  it('is not invalid without an error', () => {
    render(<TextField label="Email" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('marks required fields for assistive tech', () => {
    render(<TextField label="Email" required />);
    expect(screen.getByRole('textbox', { name: /email/i })).toBeRequired();
  });

  it('accepts typing as an uncontrolled input', async () => {
    render(<TextField label="City" />);
    const input = screen.getByRole('textbox', { name: 'City' });
    await userEvent.type(input, 'Leeds');
    expect(input).toHaveValue('Leeds');
  });

  it('works as a controlled input', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <>
          <TextField label="Name" value={value} onChange={(e) => setValue(e.target.value.toUpperCase())} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole('textbox'), 'ada');
    expect(screen.getByRole('textbox')).toHaveValue('ADA');
    expect(screen.getByRole('status')).toHaveTextContent('ADA');
  });

  it('respects a caller-provided id', () => {
    render(<TextField label="Phone" id="phone" type="tel" />);
    expect(screen.getByLabelText('Phone')).toHaveAttribute('id', 'phone');
  });

  it('forwards refs to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders decorative start and end icons and pads the input for them', () => {
    render(<TextField label="Email" startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />} />);
    expect(screen.getByTestId('start').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('end').parentElement).toHaveAttribute('aria-hidden', 'true');
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveClass('hasStartIcon', 'hasEndIcon');
  });

  it('has no accessibility violations, including in the error state', async () => {
    const { container } = render(
      <>
        <TextField label="Name" hint="As on your passport." />
        <TextField label="Email" type="email" error="Required." required />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
