import { render, screen } from '@testing-library/react';
import { axe } from '../../test/axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its text', () => {
    render(<Badge tone="success">Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('applies a tone class and merges custom classes', () => {
    render(<Badge tone="danger" className="custom">Failed</Badge>);
    const badge = screen.getByText('Failed');
    expect(badge).toHaveClass('danger');
    expect(badge).toHaveClass('custom');
  });

  it('is not interactive', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge tone="warning">Pending</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
