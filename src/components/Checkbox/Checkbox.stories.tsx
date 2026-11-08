import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Checkbox, CheckboxGroup, type CheckedState } from './Checkbox';

const meta = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  subcomponents: { CheckboxGroup },
  args: {
    label: 'Email me about product updates',
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: 'inline-radio', options: [undefined, true, false, 'indeterminate'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Radix-style API (`checked: boolean | "indeterminate"`, `onCheckedChange`) on a real `<input type="checkbox">`, so it submits, validates, autofills and resets with its form natively.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single uncontrolled checkbox. Clicking the label or pressing Space toggles it, and
 * `onCheckedChange` receives the new boolean.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Email me about product updates' });
    await userEvent.click(within(canvasElement).getByText('Email me about product updates'));
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(' ');
    await expect(checkbox).not.toBeChecked();
  },
};

/** `hint` adds supporting text under the label, linked to the input with `aria-describedby`. */
export const WithHint: Story = {
  args: { hint: 'About one email a month. Unsubscribe any time.' },
};

/**
 * Unchecked, checked, indeterminate, disabled, and disabled and checked. The indeterminate state is
 * set through the input’s DOM `indeterminate` property, so assistive technology reports it as
 * mixed.
 */
export const States: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The tick must be painted on top of the box (it once wasn't: disabled opacity and a Card's
    // z-index both buried it). The tick ignores pointer events, so enable them briefly to ask the
    // browser which element is topmost at its centre.
    for (const name of ['Checked', 'Disabled and checked']) {
      const tick = canvas.getByRole('checkbox', { name }).nextElementSibling as SVGElement;
      tick.style.pointerEvents = 'auto';
      const box = tick.getBoundingClientRect();
      const hit = canvasElement.ownerDocument.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      tick.style.pointerEvents = '';
      await expect(tick.contains(hit)).toBe(true);
    }
    await expect(canvas.getByRole('checkbox', { name: 'Indeterminate' })).toBePartiallyChecked();
  },
  render: () => (
    <Stack gap={3}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" defaultChecked="indeterminate" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
    </Stack>
  ),
};

/** `sm`, `md` and `lg` scale the box, its mark, the label, the hint and the spacing together. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={4}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} direction="row" gap={6} wrap>
          <Checkbox size={size} label={`${size.toUpperCase()} unchecked`} />
          <Checkbox size={size} label={`${size.toUpperCase()} checked`} defaultChecked />
          <Checkbox size={size} label={`${size.toUpperCase()} mixed`} defaultChecked="indeterminate" />
          <Checkbox size={size} label={`${size.toUpperCase()} with hint`} hint="Supporting text scales too" defaultChecked />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * A `CheckboxGroup`’s `size` applies to every checkbox inside it, and a checkbox’s own `size`
 * overrides it.
 */
export const GroupSize: Story = {
  name: 'Group size (with an override)',
  render: () => (
    <CheckboxGroup legend="Compact list" size="sm" defaultValue={['b']}>
      <Checkbox value="a" label="Inherits sm from the group" />
      <Checkbox value="b" label="Also sm" />
      <Checkbox value="c" label="Overrides to lg" size="lg" />
    </CheckboxGroup>
  ),
};

/**
 * `error` shows a message under the label, links it with `aria-describedby` and sets
 * `aria-invalid`. Here it marks a required consent box.
 */
export const WithError: Story = {
  args: { label: 'I accept the terms of service', required: true, error: 'You need to accept the terms to continue.' },
};

const toppings = ['Mushrooms', 'Peppers', 'Olives'];

/**
 * A parent checkbox that reflects a group: indeterminate when some toppings are chosen, checked
 * when all are. Clicking it while indeterminate reports `true` and selects everything.
 */
export const SelectAll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole('checkbox', { name: 'All toppings' });
    await expect(all).toBePartiallyChecked();
    await userEvent.click(all);
    for (const name of ['Mushrooms', 'Peppers', 'Olives']) await expect(canvas.getByRole('checkbox', { name })).toBeChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Olives' }));
    await expect(all).toBePartiallyChecked();
    await userEvent.click(all);
    await expect(all).toBeChecked();
  },
  name: 'Indeterminate "select all"',
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['Peppers']);
    const allState: CheckedState =
      selected.length === toppings.length ? true : selected.length > 0 ? 'indeterminate' : false;

    return (
      <Stack gap={2}>
        <Checkbox
          label="All toppings"
          checked={allState}
          onCheckedChange={(checked) => setSelected(checked ? toppings : [])}
        />
        <CheckboxGroup legend="Toppings" value={selected} onValueChange={setSelected}>
          {toppings.map((t) => (
            <Checkbox key={t} value={t} label={t} />
          ))}
        </CheckboxGroup>
      </Stack>
    );
  },
};

/**
 * `CheckboxGroup` renders a `<fieldset>` with the `legend` and shares one array value across its
 * checkboxes. With `name`, each checked box submits its `value` with the form; a `disabled`
 * checkbox can’t be toggled.
 */
export const Group: Story = {
  name: 'CheckboxGroup',
  render: () => (
    <CheckboxGroup
      legend="Notify me about"
      name="notifications"
      defaultValue={['mentions']}
      hint="You can change this any time in settings."
      onValueChange={fn()}
    >
      <Checkbox value="mentions" label="Mentions" hint="When someone @mentions you" />
      <Checkbox value="replies" label="Replies" />
      <Checkbox value="digest" label="Weekly digest" />
      <Checkbox value="marketing" label="Product news" disabled />
    </CheckboxGroup>
  ),
};

/**
 * `orientation="horizontal"` lays the options out in a row. The group’s `error` is shown once under
 * the fieldset, and every checkbox is marked invalid and described by it.
 */
export const HorizontalGroupWithError: Story = {
  render: () => (
    <CheckboxGroup legend="Days" orientation="horizontal" error="Pick at least one day.">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
        <Checkbox key={day} value={day.toLowerCase()} label={day} />
      ))}
    </CheckboxGroup>
  ),
};

/**
 * Validation inside a real form. Submitting with nothing chosen shows the group’s ‘Select at least
 * one option.’ message and focuses the first checkbox, and `validationMessages` replaces the
 * browser’s wording for the terms box. Choosing an option clears the group error.
 */
export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(canvas.getByText('Select at least one option.')).toBeVisible();
    await expect(canvas.getByRole('checkbox', { name: 'Design' })).toHaveFocus();
    await expect(canvas.getByRole('checkbox', { name: /accept the terms/ })).toHaveAccessibleDescription('You need to accept the terms to continue.');

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Design' }));
    await expect(canvas.queryByText('Select at least one option.')).not.toBeInTheDocument();
  },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={5}>
        <CheckboxGroup
          legend="Interests"
          name="interests"
          required
          validate={(value) => (value.length > 2 ? 'Choose no more than two.' : null)}
          hint="Choose one or two."
        >
          <Checkbox value="design" label="Design" />
          <Checkbox value="code" label="Code" />
          <Checkbox value="writing" label="Writing" />
        </CheckboxGroup>
        <Checkbox
          name="terms"
          label="I accept the terms of service"
          required
          validationMessages={{ valueMissing: 'You need to accept the terms to continue.' }}
        />
        <div>
          <Button type="submit">Continue</Button>
        </div>
      </Stack>
    </form>
  ),
};
