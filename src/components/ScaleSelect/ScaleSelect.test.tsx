import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { ScaleSelect, type ScaleSelectProps } from './ScaleSelect';

const budgets = [
  { value: 'lt5', label: 'Under £5k' },
  { value: '5-15', label: '£5–15k' },
  { value: '15-50', label: '£15–50k' },
  { value: 'gt50', label: '£50k+' },
];

function Budget(props: Partial<ScaleSelectProps>) {
  return <ScaleSelect label="Budget" name="budget" options={budgets} {...props} />;
}

const radio = (name: string) => screen.getByRole('radio', { name });

describe('ScaleSelect', () => {
  it('is a group of native radios named by its legend', () => {
    render(<Budget defaultValue="5-15" />);
    expect(screen.getByRole('group', { name: 'Budget' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(radio('£5–15k')).toBeChecked();
    for (const r of screen.getAllByRole('radio')) expect(r).toHaveAttribute('name', 'budget');
  });

  it('selects on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Budget onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('£15–50k'));
    expect(radio('£15–50k')).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('15-50');
  });

  it('moves focus and selection together with arrow keys (the original only moved selection)', async () => {
    const user = userEvent.setup();
    render(<Budget defaultValue="lt5" />);
    await user.tab();
    expect(radio('Under £5k')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(radio('£5–15k')).toHaveFocus();
    expect(radio('£5–15k')).toBeChecked();
  });

  it('stops at the ends instead of wrapping', async () => {
    const user = userEvent.setup();
    render(<Budget defaultValue="gt50" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(radio('£50k+')).toBeChecked();
    expect(radio('£50k+')).toHaveFocus();

    await user.click(radio('Under £5k'));
    await user.keyboard('{ArrowLeft}');
    expect(radio('Under £5k')).toBeChecked();
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('lt5');
      return (
        <>
          <Budget value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByText('£50k+'));
    expect(screen.getByRole('status')).toHaveTextContent('gt50');
  });

  it('submits its value and validates required', async () => {
    const onSubmit = vi.fn();
    render(
      <form
        aria-label="Brief"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget).get('budget'));
        }}
      >
        <Budget required validationMessages={{ valueMissing: 'Choose a budget.' }} />
        <button type="submit">Send</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(radio('Under £5k')).toHaveAccessibleDescription('Choose a budget.');
    expect(radio('Under £5k')).toHaveFocus();

    await userEvent.click(screen.getByText('£15–50k'));
    expect(radio('Under £5k')).not.toHaveAttribute('aria-invalid');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('15-50');
  });

  it('skips disabled options', async () => {
    const user = userEvent.setup();
    render(
      <ScaleSelect
        label="Timeline"
        defaultValue="a"
        options={[
          { value: 'a', label: 'ASAP' },
          { value: 'b', label: 'This month', disabled: true },
          { value: 'c', label: 'Later' },
        ]}
      />,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(radio('Later')).toBeChecked();
  });

  it('places the decorative thumb at the chosen step', async () => {
    const { container } = render(<Budget defaultValue="15-50" />);
    const thumb = container.querySelector('[data-set]') as HTMLElement;
    expect(thumb.style.left).toBe('62.5%');
    expect(thumb.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations, including with an error', async () => {
    const { container } = render(<Budget hint="Roughly is fine." error="Choose a budget." required />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
