import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  args: {
    label: 'Dark mode',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'An on/off setting that takes effect immediately, such as a preference. It renders a native `<input type="checkbox" role="switch">` with a `<label>`, so it submits with forms, supports `required` and `validate` rules, and toggles with Space. Use a `Checkbox` instead when the choice only applies once a form is submitted.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single switch, off to start. It is a native checkbox with `role="switch"`, so clicking the
 * label or the track toggles it, and so does Space when it has focus.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Dark mode' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    // The thumb has travelled to the end of the track.
    const track = toggle.getBoundingClientRect();
    const thumb = getComputedStyle(toggle, '::before');
    await expect(thumb.translate).not.toBe('none');
    await expect(track.width).toBeGreaterThan(track.height);
    await userEvent.keyboard(' ');
    await expect(toggle).not.toBeChecked();
  },
};

/**
 * Starts on via `defaultChecked`, as an uncontrolled input. Pass `checked` and `onChange` instead
 * when the state lives in your app.
 */
export const On: Story = {
  args: { defaultChecked: true },
};

/**
 * A typical settings list: each switch has a `hint` linked to it with `aria-describedby`. The last
 * one is `disabled`, for a setting the user can see but not change.
 */
export const SettingsList: Story = {
  render: () => (
    <Stack gap={5}>
      <Switch label="Push notifications" hint="Mentions and direct messages." defaultChecked />
      <Switch label="Weekly digest" hint="A summary every Monday morning." />
      <Switch label="Beta features" hint="Managed by your organisation." disabled />
    </Stack>
  ),
};

/**
 * `size` scales the track, thumb, label and hint together: `sm` for compact lists, `md` by
 * default, `lg` for touch-first layouts.
 */
export const Sizes: Story = {
  render: () => (
    <Stack gap={5}>
      <Switch size="sm" label="Small" hint="Compact settings lists" defaultChecked />
      <Switch size="md" label="Medium" hint="The default" defaultChecked />
      <Switch size="lg" label="Large" hint="Touch-first layouts" defaultChecked />
      <Switch size="lg" label="Large, off" />
    </Stack>
  ),
};

/**
 * A `required` switch in a form. Submitting while it is off shows “Turn this on to continue.”,
 * links it to the switch with `aria-describedby` and moves focus to it; turning it on clears the
 * error. Reserve this for consent-style settings that must be on to continue.
 */
export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Join beta' }));
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAccessibleDescription(/Turn this on to continue/);
    await expect(toggle).toHaveFocus();
    await userEvent.click(toggle);
    await expect(toggle).not.toHaveAttribute('aria-invalid');
  },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={4}>
        <Switch name="consent" label="Share anonymous usage data" required hint="Required to join the beta." />
        <div>
          <Button type="submit">Join beta</Button>
        </div>
      </Stack>
    </form>
  ),
};
