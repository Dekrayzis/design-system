import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { Dialog } from './Dialog';

type DialogArgs = ComponentProps<typeof Dialog>;

/**
 * Stories own the open state, as a real app would. `actions` receives `close`, so footer buttons
 * actually close the dialog (and still report through the `onClose` action).
 */
function DialogDemo({
  triggerLabel,
  actions,
  ...args
}: Omit<DialogArgs, 'footer'> & { triggerLabel: string; actions?: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    args.onClose();
    setOpen(false);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Dialog {...args} open={open} onClose={close} footer={actions?.(close)} />
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    open: false,
    onClose: fn(),
    title: 'Rename project',
    description: 'Project names are visible to everyone in your workspace.',
    size: 'md',
  },
  argTypes: {
    open: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A modal built on the native `<dialog>` element opened with `showModal()`, which provides focus trapping, the top layer, an inert background and Escape handling. The parent owns `open`; `onClose` fires on Escape, the close button, a backdrop click (when enabled) or a `<form method="dialog">` submit, and focus returns to the trigger on close. Use it for tasks that need the user’s full attention; for messages that shouldn’t block the page, use `Alert` or `Toast`.',
      },
      story: { inline: false, height: '420px' },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A form dialog. Save submits a `<form method="dialog">` linked through its `form` attribute, which
 * closes the dialog and reports through `onClose`. Focus moves into the dialog on open, Escape
 * closes it, and backdrop clicks are ignored by default so a stray click doesn’t lose typed input.
 */
export const Default: Story = {
  render: (args) => (
    <DialogDemo
      {...args}
      triggerLabel="Rename project"
      actions={(close) => (
        <>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button type="submit" form="rename-form">Save</Button>
        </>
      )}
    >
      <form id="rename-form" method="dialog">
        <TextField label="Project name" defaultValue="Atlas" autoComplete="off" />
      </form>
    </DialogDemo>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rename project' }));

    // The dialog renders in the top layer, outside the story canvas.
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog', { name: 'Rename project' });
    // Assert behaviour, not paint: the entry animation can be paused in background tabs.
    await expect(dialog).toHaveAttribute('open');
    await expect(dialog).toContainElement(canvasElement.ownerDocument.activeElement as HTMLElement);

    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalled();
  },
};

/**
 * A small confirmation for an irreversible action, using a `danger` button. `hideCloseButton`
 * removes the × because ‘Keep project’ already cancels, and focus returns to the trigger after
 * closing.
 */
export const Destructive: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    const dialog = canvas.getByRole('dialog', { name: 'Delete “Atlas”?' });
    await expect(within(dialog).queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep project' }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(dialog).not.toHaveAttribute('open');
    await expect(trigger).toHaveFocus();
  },
  args: {
    title: 'Delete “Atlas”?',
    description: 'This permanently removes the project, its 14 files and all comments. You can’t undo this.',
    size: 'sm',
    hideCloseButton: true,
  },
  render: (args) => (
    <DialogDemo
      {...args}
      triggerLabel="Delete project"
      actions={(close) => (
        <>
          <Button variant="secondary" onClick={close}>Keep project</Button>
          <Button variant="danger" onClick={close}>Delete project</Button>
        </>
      )}
    />
  ),
};

/**
 * Long content scrolls inside the body while the header and footer stay put, so the actions remain
 * reachable. `closeOnBackdropClick` is on here, which suits a read-only dialog with no input to
 * lose.
 */
export const LongContent: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Read the terms' }));
    const dialog = canvas.getByRole('dialog', { name: 'Terms of service' });
    // Long content scrolls inside the body only: the dialog itself must never scroll (that gave
    // a second scrollbar), and the footer action stays on screen.
    await expect(dialog.scrollHeight).toBeLessThanOrEqual(dialog.clientHeight);
    const body = within(dialog).getByText(/^Section 1\./).closest('div')!.parentElement!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    const done = within(dialog).getByRole('button', { name: 'Done' });
    await expect(done.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    // closeOnBackdropClick: a click on the dialog element itself (the backdrop) closes it.
    await userEvent.click(dialog, { pointerEventsCheck: 0 });
    await expect(args.onClose).toHaveBeenCalled();
  },
  args: {
    title: 'Terms of service',
    description: undefined,
    size: 'lg',
    closeOnBackdropClick: true,
  },
  render: (args) => (
    <DialogDemo {...args} triggerLabel="Read the terms" actions={(close) => <Button onClick={close}>Done</Button>}>
      <Stack gap={3}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>
            Section {i + 1}. The body scrolls while the header and footer stay put, so the actions are always
            reachable. Click the backdrop or press Escape to close this one.
          </p>
        ))}
      </Stack>
    </DialogDemo>
  ),
};
