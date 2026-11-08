import { render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a column with token gap by default', () => {
    render(<Stack data-testid="stack">x</Stack>);
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('column');
    expect(stack.style.gap).toBe('var(--ds-space-4)');
  });

  it('supports row direction, alignment and wrapping', () => {
    render(
      <Stack data-testid="stack" direction="row" gap={2} align="center" justify="space-between" wrap>
        x
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveClass('row', 'wrap');
    expect(stack.style.alignItems).toBe('center');
    expect(stack.style.justifyContent).toBe('space-between');
  });

  it('renders a real list when asked', () => {
    render(
      <Stack as="ul">
        <li>One</li>
        <li>Two</li>
      </Stack>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('lets inline styles override the gap', () => {
    render(<Stack data-testid="stack" style={{ gap: '3px' }}>x</Stack>);
    expect(screen.getByTestId('stack').style.gap).toBe('3px');
  });

  it('has no accessibility violations as a list or a landmark', async () => {
    const { container } = render(
      <>
        <Stack as="nav" aria-label="Sections" direction="row">
          <a href="#one">One</a>
          <a href="#two">Two</a>
        </Stack>
        <Stack as="ul">
          <li>One</li>
          <li>Two</li>
        </Stack>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
