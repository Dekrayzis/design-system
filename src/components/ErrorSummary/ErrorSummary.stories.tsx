import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { ErrorSummary, useErrorSummary } from './ErrorSummary';

function Demo() {
  const formRef = useRef<HTMLFormElement>(null);
  const summary = useErrorSummary(formRef);
  return (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <ErrorSummary {...summary} />
      <form ref={formRef} onSubmit={(event) => event.preventDefault()}>
        <Stack gap={4}>
          <TextField label="Full name" name="name" required validationMessages={{ valueMissing: 'Enter your full name.' }} />
          <TextField label="Email" name="email" type="email" required validationMessages={{ valueMissing: 'Enter your email address.' }} />
          <Checkbox
            label="I accept the terms"
            name="terms"
            required
            validationMessages={{ valueMissing: 'Accept the terms to continue.' }}
          />
          <div>
            <Button type="submit">Continue</Button>
          </div>
        </Stack>
      </form>
    </Stack>
  );
}

const meta = {
  title: 'Components/Forms/ErrorSummary',
  component: Demo,
  parameters: {
    docs: {
      description: {
        component:
          'After a blocked submit, `useErrorSummary` collects the errors the fields are already showing; `ErrorSummary` lists them, takes focus so screen readers announce them, and links each one to its field (the GOV.UK pattern).',
      },
    },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Submit the empty form to see the summary appear above it. `useErrorSummary` gathers the messages the fields are already showing, `ErrorSummary` takes focus so a screen reader announces the list, and choosing a link moves focus to that field. The checkbox is listed once, and the list clears on the next successful submit or reset. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const alert = await canvas.findByRole('alert');
    await waitFor(() => expect(alert.parentElement).toHaveFocus());
    await expect(within(alert).getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Enter your full name.',
      'Enter your email address.',
      'Accept the terms to continue.',
    ]);
    await userEvent.click(within(alert).getByRole('link', { name: 'Enter your email address.' }));
    await expect(canvas.getByRole('textbox', { name: /email/i })).toHaveFocus();
  },
};
