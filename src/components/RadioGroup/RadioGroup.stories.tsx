import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/Forms/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  args: {
    legend: 'Delivery speed',
    defaultValue: 'standard',
    onValueChange: fn(),
    children: (
      <>
        <Radio value="standard" label="Standard" hint="3–5 working days, free" />
        <Radio value="express" label="Express" hint="Next working day, £4.99" />
        <Radio value="collect" label="Click & collect" hint="Unavailable for this order" disabled />
      </>
    ),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A set of mutually exclusive options, rendered as a `<fieldset>` with a `<legend>` and native `<input type="radio">`s, so it submits, validates and resets with its form. Use it when every option should stay visible; use `Select` for long lists and `ScaleSelect` when the options form an ordered range.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A vertical group with a hint on each option and one disabled option. Built on a `<fieldset>` and `<legend>` with native radios, so Tab enters the group once and the arrow keys move and select, skipping the disabled option. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Standard' })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Standard' }));
    // Native radio keyboard: the arrow moves and selects, skipping the disabled option.
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Express' })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('express');
  },
};

/** `orientation="horizontal"` lays short options out in a row. Keep it for two or three brief labels; longer lists read better stacked. */
export const Horizontal: Story = {
  args: {
    legend: 'Plan',
    orientation: 'horizontal',
    defaultValue: 'monthly',
    children: (
      <>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </>
    ),
  },
};

/** A required group with an `error` passed in. The message is linked to every radio through `aria-describedby` and each one is marked `aria-invalid`, so screen readers announce it on any option. */
export const WithError: Story = {
  args: {
    defaultValue: undefined,
    required: true,
    error: 'Choose a delivery speed.',
  },
};

/** The `sm`, `md` and `lg` sizes. `size` on the group applies to every radio; a `Radio`’s own `size` overrides it. */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap={10} wrap>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioGroup key={size} legend={`Size ${size}`} size={size} defaultValue="b">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" hint="With a hint" />
          <Radio value="c" label="Option C" disabled />
        </RadioGroup>
      ))}
    </Stack>
  ),
};

/** Built-in validation in a form. Submitting with nothing chosen shows the `valueMissing` message from native `required`; the `validate` rule then rejects “Express”, and the error clears as soon as a valid option is picked. */
export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    await expect(canvas.getByText('Choose a delivery speed.')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Express' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    await expect(canvas.getByText('Express is sold out today.')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Standard' }));
    await expect(canvas.queryByText('Express is sold out today.')).not.toBeInTheDocument();
  },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={4}>
        <RadioGroup
          legend="Delivery speed"
          name="delivery"
          required
          validationMessages={{ valueMissing: 'Choose a delivery speed.' }}
          validate={(value) => (value === 'express' ? 'Express is sold out today.' : null)}
        >
          <Radio value="standard" label="Standard" hint="3–5 working days" />
          <Radio value="express" label="Express" hint="Next working day" />
        </RadioGroup>
        <div>
          <Button type="submit">Place order</Button>
        </div>
      </Stack>
    </form>
  ),
};
