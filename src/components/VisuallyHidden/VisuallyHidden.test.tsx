import { render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps content in the accessibility tree', () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close menu</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('uses the visually-hidden class rather than display:none', () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const el = screen.getByText('Hidden');
    expect(el).toHaveClass('visuallyHidden');
    expect(el).not.toHaveStyle({ display: 'none' });
  });

  it('gives an icon-only button a name axe accepts', async () => {
    const { container } = render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close menu</VisuallyHidden>
      </button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
