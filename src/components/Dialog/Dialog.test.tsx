import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useState } from 'react';
import { axe } from '../../test/axe';
import { Dialog, type DialogProps } from './Dialog';

function Harness({ onClose = () => {}, ...props }: Partial<DialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        title="Rename project"
        description="Visible to your team."
        {...props}
        open={open}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
      />
    </>
  );
}

describe('Dialog', () => {
  it('is closed until opened', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a dialog named by its title and described by its description', async () => {
    render(<Harness>Body content</Harness>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = screen.getByRole('dialog', { name: 'Rename project' });
    expect(dialog).toHaveAccessibleDescription('Visible to your team.');
    expect(dialog).toHaveTextContent('Body content');
    expect(screen.getByRole('heading', { level: 2, name: 'Rename project' })).toBeInTheDocument();
  });

  it('has no description when none is given', async () => {
    render(<Harness description={undefined} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
  });

  it('moves focus into the dialog when it opens', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('closes with the close button and returns focus to the trigger', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Open' });

    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stays open for other keys, and for an Escape that content inside already handled', async () => {
    const onClose = vi.fn();
    render(
      <Harness onClose={onClose}>
        <input
          aria-label="Search"
          onKeyDown={(event) => {
            // e.g. a combobox closing its own list
            if (event.key === 'Escape') event.preventDefault();
          }}
        />
      </Harness>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('a');
    await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));
    await userEvent.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ignores backdrop clicks unless closeOnBackdropClick is set', async () => {
    const onClose = vi.fn();
    const { unmount } = render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    unmount();

    render(<Harness onClose={onClose} closeOnBackdropClick />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking content inside the panel', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} closeOnBackdropClick>Inner text</Harness>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByText('Inner text'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('can hide the close button and render a footer', async () => {
    render(<Harness hideCloseButton footer={<button type="button">Confirm</button>} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('reports closes the browser makes on its own, e.g. a form with method="dialog"', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose}>Body</Harness>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    (screen.getByRole('dialog') as HTMLDialogElement).close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not report closes the parent asked for', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Dialog open title="Rename project" onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(<Dialog open={false} title="Rename project" onClose={onClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('opens once under StrictMode, so focus still returns to where it was', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.append(trigger);
    trigger.focus();
    try {
      const { rerender } = render(
        <StrictMode>
          <Dialog open title="Rename project" onClose={() => {}} />
        </StrictMode>,
      );
      expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
      rerender(
        <StrictMode>
          <Dialog open={false} title="Rename project" onClose={() => {}} />
        </StrictMode>,
      );
      expect(trigger).toHaveFocus();
    } finally {
      trigger.remove();
    }
  });

  it('turns the native cancel event (e.g. Android back) into onClose, keeping state in charge', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const cancel = new Event('cancel', { cancelable: true });
    screen.getByRole('dialog').dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(<Harness footer={<button type="button">Save</button>}>Body</Harness>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
