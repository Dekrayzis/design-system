import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type FormEvent } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Alert } from '../components/Alert/Alert';
import { Button, LinkButton } from '../components/Button/Button';
import { ButtonGroup } from '../components/ButtonGroup/ButtonGroup';
import { Card } from '../components/Card/Card';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { ErrorSummary, useErrorSummary } from '../components/ErrorSummary/ErrorSummary';
import { Heading } from '../components/Heading/Heading';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';
import { Select } from '../components/Select/Select';
import { Stack } from '../components/Stack/Stack';
import { TextField } from '../components/TextField/TextField';
import { LockIcon, MailIcon, UserIcon } from './icons';

/**
 * A composed example using only the built-in validation: native constraints plus `validate`
 * rules. The form never checks fields itself; `useErrorSummary` gathers what they report.
 */
function SignUpForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const summary = useErrorSummary(formRef);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <Alert tone="success" title="Account created">
        Check your inbox to confirm your email address.
      </Alert>
    );
  }

  return (
    <Card as="section" elevation="raised" padding="lg" aria-labelledby="signup-heading" style={{ maxWidth: 440 }}>
      <form ref={formRef} onSubmit={onSubmit}>
        <Stack gap={5}>
          <Heading level={1} size="xl" id="signup-heading">Create your account</Heading>
          <ErrorSummary {...summary} />
          <TextField
            name="name"
            label="Full name"
            autoComplete="name"
            required
            startIcon={<UserIcon />}
            validationMessages={{ valueMissing: 'Enter your name.' }}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            startIcon={<MailIcon />}
            validationMessages={{ valueMissing: 'Enter your email address.' }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            startIcon={<LockIcon />}
            hint="At least 8 characters, including a number."
            validate={(value) => (value && !/\d/.test(value) ? 'Include at least one number.' : null)}
          />
          <Select
            name="team"
            label="Team size"
            defaultValue="2-10"
            options={[
              { value: '1', label: 'Just me' },
              { value: '2-10', label: '2–10 people' },
              { value: '11-50', label: '11–50 people' },
              { value: '50+', label: 'More than 50' },
            ]}
          />
          <Stack gap={2}>
            <span style={{ fontSize: 14, fontWeight: 500 }} aria-hidden="true">Billing</span>
            <ButtonGroup
              label="Billing"
              name="billing"
              defaultValue="monthly"
              fullWidth
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          </Stack>
          <RadioGroup
            name="role"
            legend="Your role"
            orientation="horizontal"
            required
            validationMessages={{ valueMissing: 'Choose your role.' }}
          >
            <Radio value="design" label="Design" />
            <Radio value="engineering" label="Engineering" />
            <Radio value="product" label="Product" />
          </RadioGroup>
          <Checkbox
            name="terms"
            label="I accept the terms of service"
            required
            validationMessages={{ valueMissing: 'You need to accept the terms to continue.' }}
          />
          <Stack direction="row" gap={3} justify="space-between" align="center" wrap>
            <LinkButton href="https://example.com/login" variant="ghost">I have an account</LinkButton>
            <Button type="submit" loading={submitting}>Create account</Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}

const meta = {
  title: 'Examples/Sign-up form',
  component: SignUpForm,
  tags: ['!autodocs'],
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The sign-up form as a user first sees it. Every field uses built-in validation; submitting a
 * valid form shows a loading button and then a success `Alert`.
 */
export const Default: Story = {};

/**
 * Submitting the empty form shows each field’s inline error and an `ErrorSummary` that lists all
 * five problems and takes focus. Each item in the summary is a link that moves focus to its field.
 */
export const ShowsValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    const name = canvas.getByRole('textbox', { name: /full name/i });
    await expect(name).toHaveAccessibleDescription('Enter your name.');
    // The summary lists all five problems and takes focus; each item links to its field.
    const summary = await canvas.findByRole('alert');
    await expect(within(summary).getAllByRole('link')).toHaveLength(5);
    await waitFor(() => expect(summary.parentElement).toHaveFocus());
    await userEvent.click(within(summary).getByRole('link', { name: 'Enter your name.' }));
    await expect(name).toHaveFocus();
  },
};
