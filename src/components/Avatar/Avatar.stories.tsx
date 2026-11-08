import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Avatar } from './Avatar';

const portrait =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8187fb"/><stop offset="1" stop-color="#4ade80"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#fff" fill-opacity=".85"/><ellipse cx="40" cy="74" rx="26" ry="20" fill="#fff" fill-opacity=".85"/></svg>`,
  );

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Alex Morgan', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A picture of a person, rendered as an `<img>` when `src` loads, otherwise as their initials in a `role="img"` span named after them. Initials get a stable colour derived from the name. Set `decorative` when the name is already visible beside it, and use `AvatarGroup` to show several people together.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * With no `src`, the avatar shows the first and last initials on a colour derived from the name, so
 * the same person always gets the same colour. It is a `role="img"` named after the person, so
 * screen readers hear the full name rather than the letters.
 */
export const Initials: Story = {};

/** With `src`, it renders an `<img>` whose `alt` is the person’s `name`. */
export const WithImage: Story = {
  args: { src: portrait },
};

/**
 * If the image fails to load, the avatar switches to initials and keeps the person’s name as its
 * accessible name, so a broken URL never leaves an empty or unnamed box.
 */
export const BrokenImageFallsBack: Story = {
  play: async ({ canvasElement }) => {
    // The image fails to load; the initials take over, still named for screen readers.
    const canvas = within(canvasElement);
    const avatar = await canvas.findByText('AM', {}, { timeout: 8000 });
    await expect(avatar.closest('[role="img"]')).toHaveAccessibleName('Alex Morgan');
  },
  args: { src: 'https://invalid.example/missing.png' },
};

/** The four sizes, `sm` to `xl`, with both initials and images. */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} align="center">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" src={portrait} />
      <Avatar {...args} size="xl" src={portrait} />
    </Stack>
  ),
};

/**
 * When the name is already shown beside the avatar, set `decorative` so screen readers don’t hear
 * it twice: an image gets an empty `alt`, and initials are hidden from the accessibility tree.
 */
export const WithName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
    await expect(canvas.getByText('Alex Morgan')).toBeVisible();
  },
  name: 'Decorative (name shown beside it)',
  render: (args) => (
    <Stack direction="row" gap={2} align="center">
      <Avatar {...args} decorative />
      <span>{args.name}</span>
    </Stack>
  ),
};
