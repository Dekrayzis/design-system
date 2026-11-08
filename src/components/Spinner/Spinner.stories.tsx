import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { size: 'md', label: 'Loading' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An indeterminate loading indicator: an `aria-hidden` ring inside a `<span role="status">` that announces `label` to screen readers. Pass `label={null}` when it sits inside something that already communicates the busy state, as in a loading `Button`; then only the decorative ring renders. Use it when you can’t show real progress or a placeholder for the content that is coming.',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A medium spinner inside `role="status"`, with its `label` ("Loading") as visually hidden text so
 * screen readers announce it. The ring itself is `aria-hidden`.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading');
  },
};

/**
 * The three sizes, `sm`, `md` and `lg`, side by side. Match the size to the surrounding text or to
 * the area that is loading.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  ),
};
