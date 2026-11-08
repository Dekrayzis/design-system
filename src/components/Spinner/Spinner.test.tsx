import { render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces a loading status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Fetching invoices" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching invoices');
  });

  it('renders silently when label is null', () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
