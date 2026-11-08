import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { HeartIcon, SettingsIcon, TrashIcon } from '../../docs/icons';
import { Stack } from '../Stack/Stack';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    label: 'Settings',
    icon: <SettingsIcon />,
    onClick: fn(),
  },
  argTypes: {
    icon: { control: false },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'A button with only an icon. `label` is required and becomes the accessible name and tooltip.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A ghost icon button. `label` becomes the button’s `aria-label` and, by default, a tooltip on hover and keyboard focus; the icon itself is hidden from assistive tech. */
export const Default: Story = {};

/** The same `variant` options as `Button`: `ghost` (the default) for toolbars and dense UI, `secondary` and `primary` for more emphasis, `danger` for destructive actions. */
export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap={3}>
      <IconButton {...args} variant="ghost" />
      <IconButton {...args} variant="secondary" label="Like" icon={<HeartIcon />} />
      <IconButton {...args} variant="primary" label="Like" icon={<HeartIcon />} />
      <IconButton {...args} variant="danger" label="Delete" icon={<TrashIcon />} />
    </Stack>
  ),
};

/** An on/off control made by passing `aria-pressed`. The accessible name stays “Favourite” while `aria-pressed` carries the state, so screen readers announce it as a toggle button; Space and Enter work because it is a native `<button>`. */
export const Toggle: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Favourite' });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  },
  name: 'As a toggle (aria-pressed)',
  args: { label: 'Favourite', icon: <HeartIcon /> },
  render: function Render(args) {
    const [pressed, setPressed] = useState(false);
    return (
      <IconButton
        {...args}
        variant={pressed ? 'primary' : 'secondary'}
        aria-pressed={pressed}
        onClick={() => setPressed((p) => !p)}
      />
    );
  },
};
