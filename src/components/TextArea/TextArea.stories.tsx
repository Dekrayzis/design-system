import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MessageIcon } from '../../docs/icons';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/Forms/TextArea',
  component: TextArea,
  args: {
    label: 'Feedback',
    hint: 'Tell us what worked and what didn’t.',
  },
  argTypes: {
    validateOn: { control: 'inline-radio', options: ['blur', 'change', 'submit'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text input that renders a native `<textarea>` with a `<label>`, an optional hint, decorative icons, built-in validation and an optional character count. Use it for free text that may run to several lines; use `TextField` for short, single-line values.',
      },
    },
  },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A labelled `<textarea>` with a `hint` linked through `aria-describedby`. It shows four rows by
 * default; set `rows` to change that.
 */
export const Default: Story = {};

/**
 * A decorative `startIcon` pinned to the first line. Icons are `aria-hidden`, so the label still
 * has to say what the field is for.
 */
export const WithIcon: Story = {
  args: { label: 'Message', hint: undefined, placeholder: 'Write a message…', startIcon: <MessageIcon /> },
};

/**
 * An explicit `error` prop: the message is linked with `aria-describedby` and the field gets
 * `aria-invalid`. The prop always wins over built-in validation, so use it for errors from the
 * server.
 */
export const WithError: Story = {
  args: { error: 'Feedback must be at least 20 characters.', defaultValue: 'Too short' },
};

/**
 * A `disabled` field keeps its value visible but can’t be focused or edited, and isn’t submitted
 * with the form.
 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Submitted on 3 October.' },
};

/**
 * `showCount` with `minLength` and `maxLength` adds a bar that fills towards the limit, a “32 /
 * 500” count and optional `countStatus` words for each state. Screen readers hear the limit in the
 * field’s description rather than the changing number; once typing pauses near the limit, a polite
 * live region says how many characters are left.
 */
export const CharacterCount: Story = {
  name: 'Character count (showCount)',
  args: {
    label: 'The brief',
    hint: 'What are you making, and who is it for?',
    rows: 6,
    showCount: true,
    minLength: 40,
    maxLength: 500,
    countStatus: {
      empty: 'Over to you',
      short: 'Keep going',
      good: 'Good to send',
      near: 'Nearly full',
      full: 'Limit reached',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const brief = canvas.getByRole('textbox', { name: 'The brief' });
    await expect(brief).toHaveAccessibleDescription(/Up to 500 characters\./);
    await userEvent.type(brief, 'A small puzzle game for the web.');
    await expect(canvas.getByText('Keep going')).toBeVisible();
    await expect(canvas.getByText('32 / 500')).toBeVisible();
    await userEvent.type(brief, ' Two levels.');
    await expect(canvas.getByText('Good to send')).toBeVisible();
  },
};

/**
 * Native constraints and a custom `validate` rule in a form. Submitting it empty shows the
 * `valueMissing` message and focuses the field; leaving the field with a link in it then shows the
 * custom rule’s error.
 */
export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send report' }));
    const report = canvas.getByRole('textbox', { name: /bug report/i });
    await expect(report).toHaveFocus();
    await expect(report).toHaveAccessibleDescription(/Describe the bug\./);
    await userEvent.type(report, 'It crashes when I open http://example.com in the viewer.');
    await userEvent.tab();
    await expect(report).toHaveAccessibleDescription(/Remove links/);
  },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={4}>
        <TextArea
          label="Bug report"
          name="report"
          required
          minLength={20}
          maxLength={500}
          startIcon={<MessageIcon />}
          hint="At least 20 characters."
          validationMessages={{ valueMissing: 'Describe the bug.' }}
          validate={(value) => (/https?:\/\//.test(value) ? 'Remove links; attach screenshots instead.' : null)}
        />
        <Button type="submit">Send report</Button>
      </Stack>
    </form>
  ),
};
