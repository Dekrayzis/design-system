import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ArrowRightIcon, PlusIcon, TrashIcon } from '../../docs/icons';
import { Stack } from '../Stack/Stack';
import { Button, LinkButton } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `<button>` for actions on the current page. Use `LinkButton` when the control navigates somewhere: it renders a real `<a href>`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default `primary` button for the main action in a view. It renders `type="button"` unless
 * told otherwise, so it never submits a surrounding form by accident, and it activates on click or
 * Enter.
 */
export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/**
 * `primary` for the main action, `secondary` for alternatives, `ghost` for low-emphasis actions and
 * `danger` for destructive ones.
 */
export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} wrap>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </Stack>
  ),
};

/** The three sizes: `sm`, `md` (the default) and `lg`. */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} align="center">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Stack>
  ),
};

/**
 * `startIcon` and `endIcon` place an icon before or after the label. Icons are wrapped in
 * `aria-hidden`, so the text stays the accessible name.
 */
export const WithIcons: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} wrap>
      <Button {...args} startIcon={<PlusIcon />}>New project</Button>
      <Button {...args} variant="secondary" endIcon={<ArrowRightIcon />}>Continue</Button>
      <Button {...args} variant="danger" startIcon={<TrashIcon />}>Delete</Button>
    </Stack>
  ),
};

/**
 * `loading` shows a spinner, sets `aria-busy` and `aria-disabled`, and ignores clicks while keeping
 * the button focusable. The label is announced through a sibling status region, so pass `loading`
 * as a boolean from the start (`loading={isSaving}`), not only when it becomes true.
 */
export const Loading: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Saving…' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  args: { loading: true, children: 'Saving…' },
};

/**
 * A natively `disabled` button: it can’t be focused or clicked. For a temporary busy state prefer
 * `loading`, which keeps the button focusable.
 */
export const Disabled: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  args: { disabled: true },
};

/**
 * `fullWidth` stretches the button to the width of its container, for example in a narrow form or a
 * card footer.
 */
export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
};

/**
 * `LinkButton` looks like a button but renders a real `<a href>`, so open in new tab, history and
 * crawling all work. Use it whenever the control navigates rather than acts.
 */
export const AsLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', 'https://example.com/docs');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
  name: 'LinkButton (navigation)',
  render: () => (
    <Stack direction="row" gap={3}>
      <LinkButton href="https://example.com/docs" endIcon={<ArrowRightIcon />}>
        Read the docs
      </LinkButton>
      <LinkButton href="https://example.com/pricing" variant="secondary">
        See pricing
      </LinkButton>
    </Stack>
  ),
};
