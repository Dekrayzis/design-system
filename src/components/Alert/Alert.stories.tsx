import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: 'A new version is available',
    children: 'Reload the page to get the latest features and fixes.',
    live: 'off',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    live: { control: 'inline-radio', options: ['polite', 'assertive', 'off'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'An inline message about the state of the page or a task, rendered as a `<div>` with a tone icon, an optional title, actions and a dismiss button. Info and success alerts are polite live regions (`role="status"`) and warning and danger alerts assertive ones (`role="alert"`); set `live="off"` for alerts already present when the page loads. Use it for messages tied to a place on the page; for brief confirmations that float above the page, use `Toast`.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An info alert with a title and body. These stories set `live="off"` because the alert is on the
 * page from the start; leave `live` unset for alerts that appear in response to something, so they
 * are announced.
 */
export const Default: Story = {};

/**
 * The four tones, each with its own colour and icon. The icon is decorative (`aria-hidden`), so the
 * title and text must carry the meaning on their own.
 */
export const Tones: Story = {
  render: () => (
    <Stack gap={3}>
      <Alert live="off" tone="info" title="Heads up">Maintenance is scheduled for Sunday at 02:00 UTC.</Alert>
      <Alert live="off" tone="success" title="Payment received">Your invoice has been emailed to you.</Alert>
      <Alert live="off" tone="warning" title="Storage almost full">You’ve used 92% of your 10 GB.</Alert>
      <Alert live="off" tone="danger" title="Couldn’t save changes">Check your connection and try again.</Alert>
    </Stack>
  ),
};

/**
 * Pass buttons through `actions` to offer a next step, such as choosing another file. They render
 * under the message, inside the alert.
 */
export const WithActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Upload failed')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Choose another file' })).toBeVisible();
  },
  args: {
    tone: 'danger',
    title: 'Upload failed',
    children: 'report-q3.pdf exceeds the 25 MB limit.',
    actions: (
      <>
        <Button size="sm" variant="secondary">Choose another file</Button>
        <Button size="sm" variant="ghost">Learn more</Button>
      </>
    ),
  },
};

/**
 * Providing `onDismiss` adds a ‘Dismiss’ icon button. The alert doesn’t hide itself: the parent
 * owns its visibility, as this story does with local state.
 */
export const Dismissible: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    await expect(canvas.queryByText('A new version is available')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show alert again' }));
    await expect(canvas.getByText('A new version is available')).toBeVisible();
  },
  args: { onDismiss: fn() },
  render: function Render(args) {
    const [visible, setVisible] = useState(true);
    if (!visible) return <Button variant="secondary" onClick={() => setVisible(true)}>Show alert again</Button>;
    return (
      <Alert
        {...args}
        onDismiss={() => {
          args.onDismiss?.();
          setVisible(false);
        }}
      />
    );
  },
};

/** A short confirmation with only a `title` and no body text. */
export const TitleOnly: Story = {
  args: { tone: 'success', title: 'Settings saved', children: undefined },
};
