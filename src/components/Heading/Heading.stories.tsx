import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: { level: 2, children: 'Account settings' },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'inline-radio', options: [undefined, 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A section heading that renders a real `<h1>` to `<h6>`. Set `level` from the document outline and `size` only when the looks should differ from that level’s default, so the heading structure screen readers navigate by stays correct.',
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single heading. Choose `level` from where the section sits in the page outline; it renders the matching `<h1>` to `<h6>`. */
export const Default: Story = {};

/** Every level at its default size, from `<h1>` (`3xl`) down to `<h6>` (`sm`). Use it as a reference for the type scale. */
export const Scale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const level of [1, 2, 3, 4, 5, 6]) {
      await expect(canvas.getByRole('heading', { level })).toHaveTextContent(`Heading level ${level}`);
    }
  },
  render: () => (
    <Stack gap={3}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </Stack>
  ),
};

/** An `<h2>` rendered at `size="md"`. When a heading needs to look smaller or larger, change `size` and keep the `level` the outline needs, so screen reader users still get a correct heading structure. */
export const LevelIndependentOfSize: Story = {
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 2 });
    await expect(parseFloat(getComputedStyle(heading).fontSize)).toBe(16);
  },
  name: 'Level is independent of size',
  args: { level: 2, size: 'md', children: 'An h2 that looks small' },
};
