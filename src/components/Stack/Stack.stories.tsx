import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from './Stack';

const Box = ({ children }: { children: string }) => (
  <div
    style={{
      padding: '12px 16px',
      borderRadius: 8,
      background: 'var(--ds-color-accent-subtle)',
      color: 'var(--ds-color-accent-text)',
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  args: {
    direction: 'column',
    gap: 4,
    children: (
      <>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </>
    ),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A flexbox layout primitive that spaces its children in a column or a row using the spacing tokens. It renders a `<div>` by default; set `as` to `ul`, `ol`, `section`, `nav`, `header` or `footer` when the group has that meaning. Use it for one-dimensional layout instead of ad hoc margins.',
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default: children stacked vertically, spaced by `gap` from the spacing tokens
 * (`--ds-space-*`).
 */
export const Column: Story = {};

/**
 * With `direction="row"` the children sit side by side. Add `wrap` to let them flow onto further
 * lines when space runs out.
 */
export const Row: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Laid out horizontally: same top edge, the second to the right of the first.
    const a = canvas.getByText('One').getBoundingClientRect();
    const b = canvas.getByText('Two').getBoundingClientRect();
    await expect(Math.round(a.top)).toBe(Math.round(b.top));
    await expect(b.left).toBeGreaterThan(a.right);
  },
  args: { direction: 'row', gap: 2 },
};

/**
 * With `as="ul"` the stack renders a real list, so screen readers announce it as a list and count
 * its items. Use it whenever the children are a set of like things; each child must then be an
 * `<li>`.
 */
export const AsList: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list');
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
  name: 'As a list (ul)',
  args: {
    as: 'ul',
    gap: 2,
    children: (
      <>
        <li><Box>First item</Box></li>
        <li><Box>Second item</Box></li>
        <li><Box>Third item</Box></li>
      </>
    ),
  },
};
