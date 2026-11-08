import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { HeartIcon, SettingsIcon, TrashIcon } from '../../docs/icons';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Stack } from '../Stack/Stack';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: 'Saves a draft you can come back to',
    children: <Button variant="secondary">Save draft</Button>,
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['description', 'label'] },
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
    children: { control: false },
  },
  // Centred so the tooltip has room to centre on its trigger.
  decorators: [(Story) => <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Shows on hover (after `delay`) and immediately on keyboard focus. Meets WCAG 1.4.13: you can move the pointer onto it, Escape dismisses it without moving focus (and without closing an enclosing Dialog), and it stays until hover or focus leaves. `IconButton` uses one automatically.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default `kind="description"`: the tooltip has `role="tooltip"` and is added to the trigger’s
 * `aria-describedby`. It opens at once on keyboard focus, above and centred on the trigger, and
 * Escape closes it while focus stays on the button.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save draft' });
    await expect(button).toHaveAccessibleDescription('Saves a draft you can come back to');

    await userEvent.tab();
    const tip = canvas.getByRole('tooltip', { hidden: true });
    await waitFor(() => expect(tip).toBeVisible());
    // It renders above the button, centred on it.
    const t = tip.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    await expect(t.bottom).toBeLessThanOrEqual(b.top);
    await expect(Math.abs(t.left + t.width / 2 - (b.left + b.width / 2))).toBeLessThan(2);

    await userEvent.keyboard('{Escape}');
    await expect(tip).not.toBeVisible();
    await expect(button).toHaveFocus();
  },
};

/**
 * `IconButton` adds a `kind="label"` tooltip showing its `label`, hidden from screen readers
 * because the button is already named. When one tooltip has just closed the next opens without the
 * hover delay, so moving along a toolbar swaps them at once.
 */
export const IconToolbar: Story = {
  name: 'Icon buttons (built in)',
  render: () => (
    <Stack direction="row" gap={1} role="toolbar" aria-label="Post actions">
      <IconButton label="Like" icon={<HeartIcon />} />
      <IconButton label="Settings" icon={<SettingsIcon />} />
      <IconButton label="Delete" icon={<TrashIcon />} variant="danger" />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('Like')).toBeVisible());
    await userEvent.tab();
    // Moving along the toolbar swaps tooltips straight away.
    await waitFor(() => expect(canvas.getByText('Settings')).toBeVisible());
    await expect(canvas.getByText('Like')).not.toBeVisible();
  },
};

/**
 * `placement="bottom"` shows the tooltip below the trigger, for example when the trigger is near
 * the top of the screen.
 */
export const Bottom: Story = {
  args: { placement: 'bottom', content: 'Opens in a new tab' },
};

/**
 * A long tooltip on a trigger near the left edge is shifted to stay inside the viewport rather
 * than centred off screen.
 */
export const NearTheEdge: Story = {
  name: 'Kept inside the viewport',
  decorators: [(Story) => <div style={{ paddingTop: 48 }}><Story /></div>],
  args: { content: 'A long description that would overflow the left edge if it were centred' },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const tip = within(canvasElement).getByRole('tooltip', { hidden: true });
    await waitFor(() => expect(tip).toBeVisible());
    await expect(tip.getBoundingClientRect().left).toBeGreaterThanOrEqual(8);
  },
};
