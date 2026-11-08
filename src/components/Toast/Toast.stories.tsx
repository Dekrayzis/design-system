import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Toaster, clearToasts, toast, type ToasterPosition } from './Toast';

function Demo({ position }: { position?: ToasterPosition }) {
  useEffect(() => () => clearToasts(), []);
  return (
    <>
      <Stack direction="row" gap={2} wrap>
        <Button onClick={() => toast('Changes saved', { description: 'Your profile is up to date.' })}>Success</Button>
        <Button
          variant="secondary"
          onClick={() => toast('A new version is available', { tone: 'info', description: 'Reload to update.' })}
        >
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast('Storage almost full', { tone: 'warning', description: 'You’ve used 92% of 10 GB.' })}
        >
          Warning
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            toast('Couldn’t reach the server', { tone: 'error', description: 'Check your connection and try again.' })
          }
        >
          Error (stays)
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            toast('Project archived', {
              description: 'It’s hidden from your dashboard.',
              action: { label: 'Undo', onClick: () => toast('Project restored', { tone: 'info' }) },
            })
          }
        >
          With action
        </Button>
        <Button variant="ghost" onClick={() => toast('Link copied', { duration: 2000 })}>
          Short (2s)
        </Button>
      </Stack>
      <Toaster position={position} />
    </>
  );
}

const meta = {
  title: 'Components/Toast',
  component: Demo,
  args: { position: 'bottom-right' },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Call `toast(message, { tone, description, duration, action })` from anywhere; mount `<Toaster />` once. Timed toasts show a countdown and slide off towards the nearest screen edge when their `duration` runs out (dismissing by hand uses the same exit); the stack closes the gap smoothly. Timers pause on hover, keyboard focus and hidden tabs (WCAG 2.2.1); errors and toasts with an action stay until dismissed. Announced politely (success, info) or at once (warning, error); toasts never take focus. With motion reduced they appear and disappear without sliding.',
      },
      story: { inline: false, height: '420px' },
    },
  },
  decorators: [(Story) => <div style={{ padding: 24, minHeight: 400 }}><Story /></div>],
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A button for each tone, plus an action and a short duration. Success and info toasts go in a
 * polite `role="status"` region, warnings and errors in an assertive `role="alert"` region, and
 * the button you pressed keeps focus. Errors and toasts with an action stay until dismissed.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Success' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Changes saved');
    // The trigger keeps focus: toasts never steal it.
    await expect(canvas.getByRole('button', { name: 'Success' })).toHaveFocus();

    await userEvent.click(canvas.getByRole('button', { name: 'Error (stays)' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Couldn’t reach the server');

    await userEvent.click(canvas.getByRole('button', { name: 'With action' }));
    await userEvent.click(within(canvas.getByRole('status')).getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Project restored'));
  },
};

/**
 * A toast with `duration: 2000` shows a countdown bar, then slides off towards the nearest screen
 * edge and is removed. With reduced motion it simply disappears; hovering or focusing the stack
 * pauses the timer.
 */
export const SlidesOffWhenTimeIsUp: Story = {
  name: 'Timed toast slides off screen',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Keep the pointer away from the stack: hovering would (rightly) pause the timer.
    await userEvent.click(canvas.getByRole('button', { name: 'Short (2s)' }));
    await userEvent.unhover(canvas.getByRole('button', { name: 'Short (2s)' }));
    const card = canvas.getByText('Link copied').closest('[data-tone]') as HTMLElement;
    const startX = card.getBoundingClientRect().left;

    // With motion on, it leaves to the right before it's removed; with motion reduced, it just goes.
    const reduced =
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-motion') === 'paused';
    if (!reduced) {
      await waitFor(() => expect(card.closest('[data-leaving]')).not.toBeNull(), { timeout: 4000 });
      await waitFor(() => expect(card.getBoundingClientRect().left).toBeGreaterThan(startX + 40), { timeout: 1000 });
    }
    await waitFor(() => expect(canvas.queryByText('Link copied')).not.toBeInTheDocument(), { timeout: 4000 });
  },
};

/** The stack at `position="top-center"`. The newest toast sits nearest the screen edge. */
export const TopCenter: Story = {
  args: { position: 'top-center' },
};
