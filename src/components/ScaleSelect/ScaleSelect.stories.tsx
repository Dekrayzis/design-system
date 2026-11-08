import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { ScaleSelect } from './ScaleSelect';

const budgets = [
  { value: 'lt5', label: 'Under £5k' },
  { value: '5-15', label: '£5–15k' },
  { value: '15-50', label: '£15–50k' },
  { value: '50-100', label: '£50–100k' },
  { value: 'gt100', label: '£100k+' },
  { value: 'discuss', label: "Let's discuss" },
];

const meta = {
  title: 'Components/Forms/ScaleSelect',
  component: ScaleSelect,
  args: {
    label: 'Budget',
    options: budgets,
    defaultValue: '15-50',
    onValueChange: fn(),
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A single choice along an ordered range, as one continuous bar. Native radios underneath (forms, `required`, validation, reset, screen readers); arrow keys move focus and selection together and stop at the ends. It switches to two columns when its own container is narrow.',
      },
    },
  },
} satisfies Meta<typeof ScaleSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A budget scale with a middle option preselected. Arrow keys move focus and selection together and stop at the first and last options instead of wrapping; the rail’s thumb slides under the chosen segment and is hidden from assistive tech. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Real clicks land on the radio stretched over each segment.
    await userEvent.click(canvas.getByRole('radio', { name: '£15–50k' }));
    await userEvent.keyboard('{ArrowRight}');
    const next = canvas.getByRole('radio', { name: '£50–100k' });
    await expect(next).toBeChecked();
    await expect(next).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('50-100');

    // Once it has slid, the rail's thumb sits under the chosen segment.
    const segment = next.closest('label')!.getBoundingClientRect();
    const thumb = canvasElement.querySelector('[data-set]')!;
    await waitFor(
      () => {
        const t = thumb.getBoundingClientRect();
        expect(Math.abs(t.left + t.width / 2 - (segment.left + segment.width / 2))).toBeLessThan(2);
      },
      { timeout: 2000 },
    );
  },
};

/** When the component’s own container is narrow it switches to a two-column grid and drops the rail. This responds to the container, not the viewport, so it also works in sidebars and cards. */
export const Narrow: Story = {
  name: 'Narrow container (two columns)',
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const a = canvas.getByText('Under £5k').getBoundingClientRect();
    const c = canvas.getByText('£15–50k').getBoundingClientRect();
    // The third option wraps under the first.
    await expect(c.top).toBeGreaterThan(a.bottom);
  },
};

/** A required scale with a hint in a form. Submitting with nothing chosen shows the `valueMissing` message, links it to each radio through `aria-describedby` and focuses the first option; choosing one clears it. */
export const Validation: Story = {
  args: { defaultValue: undefined },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={4}>
        <ScaleSelect
          {...args}
          label="Timeline"
          name="timeline"
          required
          hint="When would you like to start?"
          validationMessages={{ valueMissing: 'Choose a timeline.' }}
          options={[
            { value: 'asap', label: 'ASAP' },
            { value: 'month', label: 'Within a month' },
            { value: 'quarter', label: 'This quarter' },
            { value: 'later', label: 'Later' },
          ]}
        />
        <div>
          <Button type="submit">Send brief</Button>
        </div>
      </Stack>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send brief' }));
    const first = canvas.getByRole('radio', { name: 'ASAP' });
    await expect(first).toHaveAccessibleDescription(/Choose a timeline\./);
    await expect(first).toHaveFocus();
    await userEvent.click(canvas.getByRole('radio', { name: 'This quarter' }));
    await expect(first).not.toHaveAttribute('aria-invalid');
  },
};
