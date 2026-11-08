import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColumnsIcon, GridIcon, ListIcon } from '../../docs/icons';
import { Stack } from '../Stack/Stack';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  args: {
    label: 'Kind of work',
    defaultValue: 'game',
    options: [
      { value: 'game', label: 'Game' },
      { value: 'web', label: 'Web' },
      { value: '3d', label: '3D' },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A segmented control (after the Portfolio2k26 `services-tabs`): an accent pill slides under the chosen option, and its label changes colour as the pill arrives. It is a radio group: Tab lands on the chosen option, the arrow keys move and select, wrapping at the ends, and Home and End jump to the first and last. The pill is positioned purely in CSS from the option count and the chosen index. Use `Tabs` when the choice switches between panels of content.',
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An uncontrolled group starting from `defaultValue`. Selection follows focus: the arrow keys move
 * to and select the next option, wrapping at the ends, and `onValueChange` reports each new value.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const game = canvas.getByRole('radio', { name: 'Game' });
    await userEvent.click(game);
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Web' })).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('web');
    await userEvent.keyboard('{End}{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Game' })).toBeChecked();
  },
};

/** The three sizes: `sm`, `md` (the default) and `lg`. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap={4} align="flex-start">
      <ButtonGroup {...args} size="sm" label="Small" />
      <ButtonGroup {...args} size="md" label="Medium" />
      <ButtonGroup {...args} size="lg" label="Large" />
    </Stack>
  ),
};

/** Each option can take a decorative `icon`, shown before its label. */
export const WithIcons: Story = {
  args: {
    label: 'View',
    defaultValue: 'grid',
    options: [
      { value: 'grid', label: 'Grid', icon: <GridIcon /> },
      { value: 'list', label: 'List', icon: <ListIcon /> },
      { value: 'board', label: 'Board', icon: <ColumnsIcon /> },
    ],
  },
};

/**
 * With `iconOnly`, only the icon is shown. A string `label` becomes the segment’s accessible name
 * and appears in a tooltip on hover and keyboard focus, so every icon-only option still needs a
 * meaningful label.
 */
export const IconOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'List view' })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Grid view' }));
    await expect(canvas.getByRole('radio', { name: 'Grid view' })).toBeChecked();
  },
  args: {
    label: 'View',
    defaultValue: 'list',
    options: [
      { value: 'grid', label: 'Grid view', icon: <GridIcon />, iconOnly: true },
      { value: 'list', label: 'List view', icon: <ListIcon />, iconOnly: true },
      { value: 'board', label: 'Board view', icon: <ColumnsIcon />, iconOnly: true },
    ],
  },
};

/** `fullWidth` stretches the control to its container; the segments always share one width. */
export const FullWidth: Story = {
  args: {
    label: 'Billing period',
    fullWidth: true,
    defaultValue: 'monthly',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly (save 20%)' },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};

/**
 * A `disabled` option can’t be chosen, and the arrow keys skip it, wrapping past it to the next
 * enabled option.
 */
export const WithDisabledOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Staging' }));
    await userEvent.keyboard('{ArrowRight}');
    // Production is disabled, so the arrow wraps to Dev.
    await expect(canvas.getByRole('radio', { name: 'Dev' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Production' })).toBeDisabled();
  },
  args: {
    label: 'Environment',
    defaultValue: 'staging',
    options: [
      { value: 'dev', label: 'Dev' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Production', disabled: true },
    ],
  },
};

/**
 * With no value, no option is checked and the pill stays hidden until one is chosen. The first
 * enabled option is the tab stop.
 */
export const NoInitialValue: Story = {
  args: { defaultValue: undefined },
};

/**
 * Pass `value` and `onValueChange` to own the state, shown here in the paragraph below. The pill
 * slides to sit exactly under the chosen segment.
 */
export const Controlled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '3D' }));
    await expect(canvas.getByText('3d')).toBeVisible();
    // After the slide, the pill sits exactly under the chosen segment.
    const chosen = canvas.getByRole('radio', { name: '3D' });
    const thumb = chosen.parentElement!.querySelector('span[aria-hidden]') as HTMLElement;
    await waitFor(() => expect(Math.round(thumb.getBoundingClientRect().left)).toBe(Math.round(chosen.getBoundingClientRect().left)), { timeout: 2000 });
  },
  render: function Render(args) {
    const [value, setValue] = useState('web');
    return (
      <Stack gap={3} align="flex-start">
        <ButtonGroup {...args} value={value} onValueChange={setValue} />
        <p style={{ margin: 0 }}>
          Showing <strong>{value}</strong> work.
        </p>
      </Stack>
    );
  },
};
