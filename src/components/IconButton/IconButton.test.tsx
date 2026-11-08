import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { IconButton } from './IconButton';

const Icon = () => <svg data-testid="icon" />;

describe('IconButton', () => {
  it('uses the label as its accessible name, without a title attribute', () => {
    render(<IconButton label="Delete item" icon={<Icon />} />);
    const button = screen.getByRole('button', { name: 'Delete item' });
    expect(button).not.toHaveAttribute('title');
    // The visual tooltip repeats the name, so it is hidden from assistive tech.
    expect(button).not.toHaveAttribute('aria-describedby');
  });

  it('shows its label in a tooltip on keyboard focus, and Escape hides it', async () => {
    const user = userEvent.setup();
    render(<IconButton label="Delete item" icon={<Icon />} />);
    await user.tab();
    expect(screen.getByText('Delete item')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Delete item')).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete item' })).toHaveFocus();
  });

  it('can turn the tooltip off', () => {
    render(<IconButton label="Delete item" icon={<Icon />} tooltip={false} />);
    expect(screen.queryByText('Delete item')).not.toBeInTheDocument();
  });

  it('hides the icon from assistive tech', () => {
    render(<IconButton label="Delete" icon={<Icon />} />);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports toggle state with aria-pressed', async () => {
    const onClick = vi.fn();
    render(<IconButton label="Favourite" icon={<Icon />} aria-pressed={false} onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Favourite', pressed: false });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IconButton label="Settings" icon={<Icon />} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
