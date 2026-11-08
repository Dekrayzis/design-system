import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TelephoneField, type CountryCode } from './TelephoneField';

const meta = {
  title: 'Components/Forms/TelephoneField',
  component: TelephoneField,
  args: {
    label: 'Phone number',
  },
  argTypes: {
    validateOn: { control: 'inline-radio', options: ['blur', 'change', 'submit'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A phone number field: a searchable country picker with flags and dialling codes, grouped by region, joined to a native `<input type="tel">`. It formats the number for the chosen country as you type, switches country when an international number is pasted, checks the number is valid for that country, and reports and submits it in E.164 form (`+447400123456`). Uses `libphonenumber-js` for the rules; the flags load as one separate chunk the first time the field appears.',
      },
    },
  },
} satisfies Meta<typeof TelephoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Starts on the United Kingdom. The placeholder shows an example number in the local format, and
 * typing is formatted as you go. The country picker's accessible name includes the country, not
 * just its code.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Phone number' });
    await userEvent.type(input, '07400123456');
    await expect(input).toHaveValue('07400 123456');
    await expect(canvas.getByRole('button', { name: /Country United Kingdom \+44/ })).toBeInTheDocument();
  },
};

/** A `hint` under the label, read after the label by screen readers. */
export const WithHint: Story = {
  args: { hint: 'We’ll only call about your delivery.' },
};

/**
 * Countries are grouped by region (Africa, Americas, Asia, Europe, Oceania). Those in
 * `preferredCountries` get their own "Suggested" group at the top. Search matches country names
 * and dialling codes, so typing "353" finds Ireland, and groups with no matches are hidden.
 */
export const PreferredCountries: Story = {
  args: { preferredCountries: ['GB', 'IE', 'US', 'FR', 'DE'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Country/ }));
    const body = within(canvasElement.ownerDocument.body);
    const options = await body.findAllByRole('option');
    await expect(options[1]).toHaveTextContent('Ireland');
    await expect(body.getByRole('group', { name: 'Suggested' })).toBeInTheDocument();
    await expect(body.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
    await userEvent.type(body.getByRole('combobox', { name: 'Country' }), '353{Enter}');
    await expect(canvas.getByRole('button', { name: /Country Ireland \+353/ })).toBeInTheDocument();
  },
};

/**
 * `countries` limits the list, for example to the countries you deliver to. The selected country
 * is always listed, so a pasted number from elsewhere still shows its country.
 */
export const LimitedCountries: Story = {
  args: { countries: ['GB', 'IE', 'FR', 'DE', 'ES', 'NL'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Country/ }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findAllByRole('option')).toHaveLength(6);
  },
};

/**
 * Pasting or typing a number with its `+` code switches the country to match and shows the number
 * in that country's local format.
 */
export const PasteInternational: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Phone number' });
    await userEvent.click(input);
    await userEvent.paste('+33 6 12 34 56 78');
    await expect(input).toHaveValue('06 12 34 56 78');
    await expect(canvas.getByRole('button', { name: /Country France \+33/ })).toBeInTheDocument();
  },
};

/** Starts from an E.164 `defaultValue`; the country comes from the number. */
export const WithValue: Story = {
  args: { defaultValue: '+14155550123' },
};

/**
 * A number that can't exist in the chosen country gets an error on blur, with an example of the
 * right format. It clears as soon as the number is fixed.
 */
export const Validation: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Phone number/ });
    await userEvent.type(input, '0123');
    await userEvent.tab();
    await expect(input).toHaveAccessibleDescription('Enter a valid phone number, like 07400 123456.');
    await userEvent.clear(input);
    await userEvent.type(input, '07400123456');
    await expect(input).not.toHaveAccessibleDescription();
  },
};

/** An explicit `error`, for problems only the server knows about. */
export const WithError: Story = {
  args: { defaultValue: '+447400123456', error: 'This number is already registered.' },
};

/** Disables both the country picker and the number. */
export const Disabled: Story = {
  args: { defaultValue: '+447400123456', disabled: true },
};

function ControlledDemo() {
  const [value, setValue] = useState('+353851234567');
  const [country, setCountry] = useState<CountryCode>('IE');
  const [valid, setValid] = useState(true);
  return (
    <Stack gap={3}>
      <TelephoneField
        label="Phone number"
        value={value}
        country={country}
        onCountryChange={setCountry}
        onValueChange={(next, details) => {
          setValue(next);
          setValid(details.valid);
        }}
      />
      <output>
        <code>{value || '(empty)'}</code> · {country} · {valid ? 'valid' : 'not valid yet'}
      </output>
    </Stack>
  );
}

/**
 * Controlled `value` and `country`. `onValueChange` reports the E.164 number on every change,
 * with the country and whether the number is complete and valid.
 */
export const Controlled: Story = {
  render: () => <ControlledDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Phone number' });
    await expect(input).toHaveValue('085 123 4567');
    await userEvent.clear(input);
    await userEvent.type(input, '0851');
    await expect(canvas.getByRole('status')).toHaveTextContent('+353851 · IE · not valid yet');
  },
};

function FormDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('phone')));
      }}
    >
      <Stack gap={4}>
        <TelephoneField label="Phone number" name="phone" required preferredCountries={['GB', 'IE']} />
        <Button type="submit">Save</Button>
        {submitted && <output>Submitted {submitted}</output>}
      </Stack>
    </form>
  );
}

/**
 * Inside a form, `name` submits the E.164 number. An empty or invalid number blocks submission and
 * focuses the field.
 */
export const InAForm: Story = {
  render: () => <FormDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Phone number/ });
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.type(input, '07400123456');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Submitted +447400123456');
  },
};
