import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from '../../test/axe';
import { ButtonGroup, type ButtonGroupProps } from './ButtonGroup';

const options = [
  { value: 'game', label: 'Game' },
  { value: 'web', label: 'Web' },
  { value: 'locked', label: 'Locked', disabled: true },
  { value: '3d', label: '3D' },
];

function Kinds(props: Partial<ButtonGroupProps>) {
  return <ButtonGroup label="Kind of work" options={options} {...props} />;
}

const radio = (name: string) => screen.getByRole('radio', { name });

describe('ButtonGroup', () => {
  it('is a labelled radio group of buttons', () => {
    render(<Kinds defaultValue="web" />);
    expect(screen.getByRole('radiogroup', { name: 'Kind of work' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(radio('Web')).toBeChecked();
    expect(radio('Game')).not.toBeChecked();
    for (const button of screen.getAllByRole('radio')) expect(button).toHaveAttribute('type', 'button');
  });

  it('selects on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Kinds defaultValue="game" onValueChange={onValueChange} />);
    await userEvent.click(radio('3D'));
    expect(radio('3D')).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('3d');
  });

  it('does not report a change when the chosen option is clicked again', async () => {
    const onValueChange = vi.fn();
    render(<Kinds defaultValue="game" onValueChange={onValueChange} />);
    await userEvent.click(radio('Game'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('is one tab stop on the chosen option (roving tabindex)', async () => {
    const user = userEvent.setup();
    render(<Kinds defaultValue="web" />);
    await user.tab();
    expect(radio('Web')).toHaveFocus();
    expect(radio('Game')).toHaveAttribute('tabindex', '-1');
  });

  it('makes the first enabled option the tab stop when nothing is chosen', async () => {
    const user = userEvent.setup();
    render(<Kinds />);
    await user.tab();
    expect(radio('Game')).toHaveFocus();
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('data-has-value');
  });

  it('moves and selects with arrow keys, skipping disabled options and wrapping', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Kinds defaultValue="web" onValueChange={onValueChange} />);
    await user.tab();

    await user.keyboard('{ArrowRight}');
    expect(radio('3D')).toHaveFocus();
    expect(radio('3D')).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('3d');

    await user.keyboard('{ArrowDown}');
    expect(radio('Game')).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(radio('3D')).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(radio('Game')).toHaveFocus();
  });

  it('jumps with Home and End', async () => {
    const user = userEvent.setup();
    render(<Kinds defaultValue="web" />);
    await user.tab();
    await user.keyboard('{End}');
    expect(radio('3D')).toBeChecked();
    await user.keyboard('{Home}');
    expect(radio('Game')).toBeChecked();
  });

  it('cannot select disabled options or a disabled group', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Kinds defaultValue="game" onValueChange={onValueChange} />);
    expect(radio('Locked')).toBeDisabled();
    await userEvent.click(radio('Locked'));
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(<Kinds defaultValue="game" onValueChange={onValueChange} disabled />);
    for (const button of screen.getAllByRole('radio')) expect(button).toBeDisabled();
  });

  it('leaves other keys alone, so Tab moves out of the group', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Kinds defaultValue="web" />
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    await user.keyboard('x');
    expect(radio('Web')).toHaveFocus();
    expect(radio('Web')).toBeChecked();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('game');
      return (
        <>
          <Kinds value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(radio('Web'));
    expect(screen.getByRole('status')).toHaveTextContent('web');
    expect(radio('Web')).toBeChecked();
  });

  it('positions the thumb from the option count and chosen index', async () => {
    render(<Kinds defaultValue="web" />);
    const group = screen.getByRole('radiogroup');
    expect(group.style.getPropertyValue('--segments')).toBe('4');
    expect(group.style.getPropertyValue('--selected')).toBe('1');
    await userEvent.click(radio('3D'));
    expect(group.style.getPropertyValue('--selected')).toBe('3');
  });

  it('can stretch to the width of its container', () => {
    render(<Kinds fullWidth />);
    expect(screen.getByRole('radiogroup')).toHaveClass('fullWidth');
  });

  it('submits nothing when no option is chosen', () => {
    render(
      <form aria-label="prefs">
        <Kinds name="kind" />
      </form>,
    );
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('kind')).toBe('');
  });

  it('submits its value with a form', async () => {
    render(
      <form aria-label="prefs">
        <Kinds name="kind" defaultValue="game" />
      </form>,
    );
    await userEvent.click(radio('Web'));
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('kind')).toBe('web');
  });

  it('keeps an accessible name for icon-only options', () => {
    render(
      <ButtonGroup
        label="View"
        defaultValue="grid"
        options={[
          { value: 'grid', label: 'Grid view', icon: <svg data-testid="grid" />, iconOnly: true },
          { value: 'list', label: 'List view', icon: <svg />, iconOnly: true },
        ]}
      />,
    );
    expect(radio('Grid view')).toBeChecked();
    expect(screen.getByTestId('grid').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    render(<Kinds size={size} />);
    expect(screen.getByRole('radiogroup')).toHaveClass(size);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Kinds defaultValue="web" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
