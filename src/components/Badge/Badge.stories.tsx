import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Draft' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A short, non-interactive status label rendered as a `<span>`. Colour reinforces the tone but must not carry the meaning alone: the text says what the status is. For something clickable use `Button`; for a message about the page use `Alert`.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default `neutral` tone, for labels such as a draft state that need no emphasis. */
export const Default: Story = {};

/**
 * The six tones. Pick the tone that matches the words, for example `success` for ‘Published’ and
 * `danger` for ‘Failed’, so colour and text agree.
 */
export const Tones: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const text of ['Draft', 'New', 'Published', 'Pending review', 'Failed', 'Beta']) {
      await expect(canvas.getByText(text)).toBeVisible();
    }
  },
  render: () => (
    <Stack direction="row" gap={2} wrap>
      <Badge tone="neutral">Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">Pending review</Badge>
      <Badge tone="danger">Failed</Badge>
      <Badge tone="info">Beta</Badge>
    </Stack>
  ),
};
