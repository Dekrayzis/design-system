import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { axe } from '../../test/axe';
import { Radio, RadioGroup } from './RadioGroup';

function Plans(props: Partial<ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup legend="Plan" {...props}>
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" hint="£8 a month" />
      <Radio value="team" label="Team" disabled />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('is a group named by its legend', () => {
    render(<Plans />);
    expect(screen.getByRole('group', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('shares one name so the browser treats the radios as one group', () => {
    render(<Plans name="plan" />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('name', 'plan');
  });

  it('selects the default value', () => {
    render(<Plans defaultValue="pro" />);
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  });

  it('selects one option at a time when uncontrolled', async () => {
    const onValueChange = vi.fn();
    render(<Plans defaultValue="free" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('free');
      return (
        <>
          <Plans value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByText('Pro'));
    expect(screen.getByRole('status')).toHaveTextContent('pro');
  });

  it('describes options with their own hint', () => {
    render(<Plans />);
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAccessibleDescription('£8 a month');
  });

  it('describes every option with the group error', () => {
    render(<Plans error="Choose a plan." />);
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('Choose a plan.');
    expect(screen.getByText('Choose a plan.')).toBeVisible();
  });

  it('disables individual options and the whole group', () => {
    const { rerender } = render(<Plans />);
    expect(screen.getByRole('radio', { name: 'Team' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeEnabled();

    rerender(<Plans disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('sizes radios from the group, defaulting to md, with per-radio overrides', () => {
    const { rerender } = render(<Plans />);
    expect(screen.getByRole('radio', { name: 'Free' }).closest('.option')).toHaveClass('md');

    rerender(
      <RadioGroup legend="Plan" size="lg">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" size="sm" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Free' }).closest('.option')).toHaveClass('lg');
    expect(screen.getByRole('radio', { name: 'Pro' }).closest('.option')).toHaveClass('sm');
  });

  it('throws a helpful error when Radio is used on its own', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Radio value="x" label="X" />)).toThrow('<Radio> must be used inside <RadioGroup>.');
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Plans defaultValue="free" hint="You can change this later." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
