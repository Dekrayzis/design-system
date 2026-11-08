import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/axe';
import { Alert } from './Alert';

describe('Alert', () => {
  it('announces info and success politely', () => {
    render(<Alert tone="success" title="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('announces warnings and errors assertively', () => {
    render(<Alert tone="danger" title="Couldn't save" />);
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't save");
  });

  it('can opt out of being a live region', () => {
    render(<Alert tone="danger" title="Static" live="off" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders the body and actions', () => {
    render(
      <Alert title="Upload failed" actions={<button type="button">Retry</button>}>
        The file is too large.
      </Alert>,
    );
    expect(screen.getByText('The file is too large.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('only shows a dismiss button when onDismiss is provided', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert title="Hi" />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();

    rerender(<Alert title="Hi" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Alert tone="info" title="Info" onDismiss={() => {}}>Body</Alert>
        <Alert tone="danger" title="Error" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
