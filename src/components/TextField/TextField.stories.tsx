import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { CheckCircleIcon, LockIcon, MailIcon, SearchIcon, UserIcon } from '../../docs/icons';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TextField } from './TextField';

const meta = {
  title: 'Components/Forms/TextField',
  component: TextField,
  args: {
    label: 'Email address',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@example.com',
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date'] },
    validateOn: { control: 'inline-radio', options: ['blur', 'change', 'submit'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input that renders a native `<input>` with a `<label>`, an optional hint, decorative icons and inline errors from native constraints or a custom `validate` rule. Set `type` and `autoComplete` so browsers offer the right keyboard and autofill. Use `TextArea` for text that may run to several lines.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An email field with a visible `<label>`, `type="email"` and `autoComplete="email"`, so browsers
 * can offer the right keyboard and autofill. The placeholder only shows the format; it never
 * replaces the label.
 */
export const Default: Story = {};

/**
 * A `hint` under the label, linked to the input with `aria-describedby` so screen readers read it
 * after the label.
 */
export const WithHint: Story = {
  args: { hint: "We'll only use this to send receipts." },
};

/**
 * An explicit `error` prop: the message is linked with `aria-describedby` and the input gets
 * `aria-invalid`. The prop always wins over built-in validation, so use it for errors from the
 * server.
 */
export const WithError: Story = {
  args: { defaultValue: 'not-an-email', error: 'Enter an email address like name@example.com.' },
};

/**
 * `required` adds an asterisk to the label that is hidden from screen readers, which hear the
 * native required state instead. Leaving the field empty then shows an error on blur.
 */
export const Required: Story = {
  args: { required: true },
};

/**
 * A `disabled` input keeps its value visible but can’t be focused or edited, and isn’t submitted
 * with the form.
 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked@example.com' },
};

/**
 * Decorative `startIcon` and `endIcon` inside the field. They are `aria-hidden`, so never rely on
 * an icon alone to convey meaning, such as a valid username.
 */
export const WithIcons: Story = {
  render: () => (
    <Stack gap={4}>
      <TextField label="Email" type="email" placeholder="you@example.com" startIcon={<MailIcon />} />
      <TextField label="Username" defaultValue="vince" startIcon={<UserIcon />} endIcon={<CheckCircleIcon />} />
      <TextField label="Password" type="password" startIcon={<LockIcon />} />
      <TextField label="Disabled" disabled defaultValue="Read only" startIcon={<LockIcon />} />
    </Stack>
  ),
};

/**
 * A search field with `hideLabel`: the label is visually hidden but still names the input for
 * screen readers, and the search icon stands in for it visually. Only hide the label when the
 * context makes the field’s purpose obvious.
 */
export const Search: Story = {
  args: {
    label: 'Search projects',
    hideLabel: true,
    type: 'search',
    placeholder: 'Search projects',
    autoComplete: 'off',
    startIcon: <SearchIcon />,
  },
};

/**
 * Native attributes (`required`, `type="email"`, `minLength`, `pattern`, `min` and `max`) drive
 * validation. Errors appear when you leave a field, then update as you type so they clear the
 * moment the value is fixed. Submitting shows every error and focuses the first invalid field.
 */
export const Validation: Story = {
  name: 'Validation (native constraints)',
  render: function Render() {
    const [sent, setSent] = useState(false);
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <Stack gap={4}>
          <TextField
            label="Full name"
            name="name"
            required
            autoComplete="name"
            validationMessages={{ valueMissing: 'Enter your name.' }}
          />
          <TextField label="Email" name="email" type="email" required startIcon={<MailIcon />} autoComplete="email" />
          <TextField
            label="Username"
            name="username"
            required
            minLength={3}
            pattern="[a-z0-9_]+"
            hint="Lowercase letters, numbers and underscores."
            validationMessages={{ patternMismatch: 'Use lowercase letters, numbers and underscores only.' }}
          />
          <TextField label="Age" name="age" type="number" min={13} max={120} />
          <Button type="submit">Create account</Button>
          {sent && <p style={{ margin: 0 }}>Submitted ✓</p>}
        </Stack>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    const name = canvas.getByRole('textbox', { name: /full name/i });
    await expect(name).toHaveAccessibleDescription('Enter your name.');
    await expect(name).toHaveFocus();
  },
};

/**
 * Custom `validate` rules alongside native constraints. The confirm field compares its value with
 * the password held in state, so the cross-field error appears on blur and clears as soon as the
 * values match.
 */
export const CustomRule: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [password, confirm] = canvas.getAllByLabelText(/password/i) as HTMLInputElement[];
    await userEvent.type(password!, 'secret123');
    await userEvent.type(confirm!, 'secret12');
    await userEvent.tab();
    await expect(confirm).toHaveAccessibleDescription('Passwords don’t match.');
    await userEvent.type(confirm!, '3');
    await expect(confirm).not.toHaveAttribute('aria-invalid');
  },
  name: 'Validation (custom rule, cross-field)',
  render: function Render() {
    const [password, setPassword] = useState('');
    return (
      <form onSubmit={(event) => event.preventDefault()}>
        <Stack gap={4}>
          <TextField
            label="Password"
            type="password"
            required
            minLength={8}
            startIcon={<LockIcon />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            validate={(value) => (/\d/.test(value) ? null : 'Include at least one number.')}
          />
          <TextField
            label="Confirm password"
            type="password"
            required
            startIcon={<LockIcon />}
            validate={(value) => (value === password ? null : 'Passwords don’t match.')}
          />
          <Button type="submit">Save</Button>
        </Stack>
      </form>
    );
  },
};

/**
 * With `validateOn="change"` the error appears while typing rather than on blur. Keep this for
 * short, strictly formatted values such as codes, where instant feedback helps more than it
 * interrupts.
 */
export const ValidateOnChange: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Promo code' });
    await userEvent.type(input, 'abc');
    await expect(input).toHaveAccessibleDescription('Use the format ABC-123.');
    await userEvent.clear(input);
    await userEvent.type(input, 'ABC-123');
    await expect(input).not.toHaveAttribute('aria-invalid');
  },
  args: {
    label: 'Promo code',
    type: 'text',
    placeholder: 'ABC-123',
    autoComplete: 'off',
    pattern: '[A-Z]{3}-\\d{3}',
    validateOn: 'change',
    validationMessages: { patternMismatch: 'Use the format ABC-123.' },
  },
};
