import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { axe } from '../../test/axe';
import { Button, LinkButton } from './Button';

describe('Button', () => {
  it('renders a button named by its text', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('submits its form when type="submit"', async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent as SubmitEvent)}>
        <Button type="submit">Send</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when clicked and when activated from the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks itself busy and blocks clicks while loading, but stays focusable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Saving</Button>);
    const button = screen.getByRole('button', { name: 'Saving' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeEnabled();

    await user.tab();
    expect(button).toHaveFocus();

    await user.click(button);
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps its status region silent until loading starts', () => {
    const { rerender } = render(<Button loading={false}>Save</Button>);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    rerender(<Button loading>Save</Button>);
    expect(screen.getByRole('status')).toHaveTextContent('Save');
  });

  it('hides decorative icons from assistive tech', () => {
    render(<Button startIcon={<svg data-testid="icon" />}>Add</Button>);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Add');
  });

  it('hides an end icon from assistive tech too', () => {
    render(<Button endIcon={<svg data-testid="end-icon" />}>Next</Button>);
    expect(screen.getByTestId('end-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Next');
  });

  it('announces "Loading" while loading when its content is not plain text', () => {
    render(
      <Button loading>
        <strong>Save</strong>
      </Button>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('can stretch to the width of its container', () => {
    render(<Button fullWidth>Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  it('forwards refs to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="danger" loading>Deleting</Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LinkButton', () => {
  it('renders a real link with an href', () => {
    render(<LinkButton href="/docs">Docs</LinkButton>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('passes through link attributes', () => {
    render(
      <LinkButton href="https://example.com" target="_blank" rel="noreferrer">
        External
      </LinkButton>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });
});
