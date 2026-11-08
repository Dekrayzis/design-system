import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ComponentProps } from 'react';
import { axe } from '../../test/axe';
import { Checkbox, CheckboxGroup, type CheckedState } from './Checkbox';

describe('Checkbox', () => {
  it('is a real, labelled checkbox input', () => {
    render(<Checkbox label="Subscribe" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' });
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles when its label is clicked and with Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);
    const checkbox = screen.getByRole('checkbox');

    await user.click(screen.getByText('Subscribe'));
    expect(checkbox).toBeChecked();

    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
  });

  it('reports the new state through onCheckedChange and still calls onChange', async () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports an uncontrolled default, including indeterminate', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="All" defaultChecked="indeterminate" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBePartiallyChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(checkbox).not.toBePartiallyChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is fully controlled by `checked`', async () => {
    function Controlled() {
      const [checked, setChecked] = useState<CheckedState>('indeterminate');
      return (
        <>
          <Checkbox label="All" checked={checked} onCheckedChange={setChecked} />
          <button type="button" onClick={() => setChecked('indeterminate')}>Mix</button>
        </>
      );
    }
    render(<Controlled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBePartiallyChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(screen.getByRole('button', { name: 'Mix' }));
    expect(checkbox).toBePartiallyChecked();
  });

  it('ignores clicks when controlled and the parent does not update', async () => {
    render(<Checkbox label="Locked" checked={false} onCheckedChange={() => {}} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('submits its value with the form', () => {
    render(
      <form aria-label="prefs">
        <Checkbox label="Newsletter" name="newsletter" value="yes" defaultChecked />
      </form>,
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('newsletter')).toBe('yes');
  });

  it('participates in native required validation', () => {
    render(
      <form aria-label="terms">
        <Checkbox label="Accept" name="accept" required />
      </form>,
    );
    expect(screen.getByRole('checkbox')).toBeRequired();
    expect((screen.getByRole('form') as HTMLFormElement).checkValidity()).toBe(false);
  });

  it('returns to its default when the form is reset', async () => {
    render(
      <form aria-label="prefs">
        <Checkbox label="Newsletter" defaultChecked="indeterminate" />
        <button type="reset">Reset</button>
      </form>,
    );
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(checkbox).toBePartiallyChecked();
  });

  it('describes itself with the hint and error', () => {
    render(<Checkbox label="Terms" hint="Read them first." error="You must accept." />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleDescription('Read them first. You must accept.');
    expect(checkbox).toBeInvalid();
  });

  it('forwards refs to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Subscribe" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('runs a custom validate rule against its checked state', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form aria-label="login" onSubmit={onSubmit}>
        <Checkbox label="Remember me" defaultChecked validate={(on) => (on ? 'Not on a shared computer.' : null)} />
        <button type="submit">Sign in</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    const checkbox = screen.getByRole('checkbox');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(checkbox).toHaveAccessibleDescription('Not on a shared computer.');

    await userEvent.click(checkbox);
    expect(checkbox).not.toHaveAttribute('aria-invalid');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    const { container } = render(<Checkbox label="Sized" size={size} />);
    expect(container.firstElementChild).toHaveClass('option', size);
  });

  it('defaults to md', () => {
    const { container } = render(<Checkbox label="Default" />);
    expect(container.firstElementChild).toHaveClass('md');
  });

  it('cannot be toggled when disabled', async () => {
    render(<Checkbox label="Locked" disabled />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Checkbox label="Subscribe" hint="Monthly." />
        <Checkbox label="Mixed" defaultChecked="indeterminate" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CheckboxGroup', () => {
  function Days(props: Partial<ComponentProps<typeof CheckboxGroup>>) {
    return (
      <CheckboxGroup legend="Days" name="days" {...props}>
        <Checkbox value="mon" label="Monday" />
        <Checkbox value="tue" label="Tuesday" />
        <Checkbox value="wed" label="Wednesday" disabled />
      </CheckboxGroup>
    );
  }

  it('is a group named by its legend', () => {
    render(<Days />);
    expect(screen.getByRole('group', { name: 'Days' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('reflects and updates an array value', async () => {
    const onValueChange = vi.fn();
    render(<Days defaultValue={['mon']} onValueChange={onValueChange} />);
    expect(screen.getByRole('checkbox', { name: 'Monday' })).toBeChecked();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Tuesday' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['mon', 'tue']);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Monday' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['tue']);
    expect(screen.getByRole('checkbox', { name: 'Monday' })).not.toBeChecked();
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <>
          <Days value={value} onValueChange={setValue} />
          <output>{value.join(',')}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByText('Tuesday'));
    await userEvent.click(screen.getByText('Monday'));
    expect(screen.getByRole('status')).toHaveTextContent('tue,mon');
  });

  it('submits every checked value under the shared name', () => {
    render(
      <form aria-label="schedule">
        <Days defaultValue={['mon', 'tue']} />
      </form>,
    );
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).getAll('days')).toEqual(['mon', 'tue']);
  });

  it('describes every checkbox with the group error, and disables all when disabled', () => {
    const { rerender } = render(<Days error="Pick a day." />);
    expect(screen.getByRole('checkbox', { name: 'Monday' })).toHaveAccessibleDescription('Pick a day.');

    rerender(<Days disabled />);
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeDisabled();
  });

  it('passes its size to every checkbox, which can override it', () => {
    render(
      <CheckboxGroup legend="Sizes" size="sm">
        <Checkbox value="a" label="Inherited" />
        <Checkbox value="b" label="Overridden" size="lg" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole('checkbox', { name: 'Inherited' }).closest('.option')).toHaveClass('sm');
    expect(screen.getByRole('checkbox', { name: 'Overridden' }).closest('.option')).toHaveClass('lg');
  });

  it('resets with its form', async () => {
    render(
      <form aria-label="schedule">
        <Days defaultValue={['mon']} />
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.click(screen.getByText('Tuesday'));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('checkbox', { name: 'Monday' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Tuesday' })).not.toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Days defaultValue={['mon']} hint="Weekdays only." error="Required." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
