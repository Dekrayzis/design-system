import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type FormEvent } from 'react';
import { axe } from '../../test/axe';
import { getCountries } from 'libphonenumber-js';
import { REGION_OF, countriesFor, groupByRegion, loadFlags } from './countries';
import { TelephoneField, type CountryCode, type TelephoneFieldProps } from './TelephoneField';

function Phone(props: Partial<TelephoneFieldProps>) {
  return <TelephoneField label="Phone number" {...props} />;
}

const input = () => screen.getByRole('textbox', { name: /Phone number/ }) as HTMLInputElement;
const picker = () => screen.getByRole('button', { name: /^Country/ });
const search = () => screen.getByRole('combobox', { name: 'Country' });

describe('TelephoneField', () => {
  describe('flags', () => {
    it('holds the space with a placeholder until the flag set has loaded, then shows the flag', async () => {
      vi.resetModules();
      const { TelephoneField: Fresh } = await import('./TelephoneField');
      const { container } = render(<Fresh label="Phone number" />);
      const trigger = within(picker());
      expect(container.querySelector('button img')).toBeNull();
      await waitFor(() => expect(container.querySelector('button img')).not.toBeNull());
      // Decorative: the country name is in the accessible name instead.
      expect(container.querySelector('button img')).toHaveAttribute('alt', '');
      expect(trigger.getByText('United Kingdom')).toBeInTheDocument();
    });

    it('does nothing if the field unmounts before the flags arrive', async () => {
      vi.resetModules();
      const { TelephoneField: Fresh } = await import('./TelephoneField');
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { unmount } = render(<Fresh label="Phone number" />);
      unmount();
      const { loadFlags: load } = await import('./countries');
      await load();
      expect(errors).not.toHaveBeenCalled();
      errors.mockRestore();
    });

    it('loads the flag set once and reuses it', async () => {
      expect(await loadFlags()).toBe(await loadFlags());
    });
  });

  describe('structure', () => {
    it('labels the number input and names the country picker with the country and code', () => {
      render(<Phone />);
      expect(input()).toHaveAttribute('type', 'tel');
      expect(input()).toHaveAttribute('autocomplete', 'tel');
      expect(input()).toHaveAttribute('inputmode', 'tel');
      expect(picker()).toHaveAccessibleName('Country United Kingdom +44');
    });

    it('shows an example number for the country as the placeholder', () => {
      render(<Phone defaultCountry="FR" />);
      expect(input()).toHaveAttribute('placeholder', '06 12 34 56 78');
    });

    it('describes the number with its hint', () => {
      render(<Phone hint="For delivery updates only." />);
      expect(input()).toHaveAccessibleDescription('For delivery updates only.');
    });

    it('groups countries by region, with regions in alphabetical order', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.click(picker());
      const groups = screen.getAllByRole('group');
      expect(groups.map((g) => g.getAttribute('aria-labelledby') && document.getElementById(g.getAttribute('aria-labelledby')!)?.textContent)).toEqual([
        'Africa',
        'Americas',
        'Asia',
        'Europe',
        'Oceania',
      ]);
      const europe = screen.getByRole('group', { name: 'Europe' });
      expect(within(europe).getByRole('option', { name: /United Kingdom/ })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: 'Americas' })).getByRole('option', { name: /Canada/ })).toBeInTheDocument();
    });

    it('puts preferred countries in their own group first, without repeating them', async () => {
      const user = userEvent.setup();
      render(
        <Phone
          countries={['IE', 'US', 'FR', 'JP']}
          preferredCountries={['IE', 'US', 'ZZ' as CountryCode]}
          preferredLabel="Popular"
        />,
      );
      await user.click(picker());
      const popular = screen.getAllByRole('group')[0]!;
      expect(popular).toHaveAccessibleName('Popular');
      expect(within(popular).getAllByRole('option').map((o) => o.textContent)).toEqual(['Ireland+353', 'United States+1']);
      expect(screen.getAllByRole('option', { name: /^Ireland/ })).toHaveLength(1);
    });

    it('limits the list to the given countries, always keeping the selected one', async () => {
      const user = userEvent.setup();
      render(<Phone countries={['IE', 'FR']} />);
      await user.click(picker());
      // All three are in Europe, sorted by name; the UK is there only because it's selected.
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['France+33', 'Ireland+353', 'United Kingdom+44']);
      await user.type(search(), 'France{Enter}');
      await user.click(picker());
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['France+33', 'Ireland+353']);
    });

    it('places every country libphonenumber knows in exactly one region', () => {
      const codes = getCountries();
      expect(codes.filter((code) => !REGION_OF[code])).toEqual([]);
      expect(Object.keys(REGION_OF).sort()).toEqual([...codes].sort());
    });

    it('translates region headings with regionLabels, sorting by the translated names', async () => {
      const user = userEvent.setup();
      render(
        <Phone
          locale="fr"
          regionLabels={{ africa: 'Afrique', americas: 'Amériques', asia: 'Asie', oceania: 'Océanie' }}
        />,
      );
      await user.click(picker());
      expect(screen.getAllByRole('group').map((g) => document.getElementById(g.getAttribute('aria-labelledby')!)?.textContent)).toEqual([
        'Afrique',
        'Amériques',
        'Asie',
        'Europe',
        'Océanie',
      ]);
      expect(within(screen.getByRole('group', { name: 'Europe' })).getByRole('option', { name: /Royaume-Uni/ })).toBeInTheDocument();
    });

    it('leaves out regions with no countries left in them', () => {
      const europeOnly = countriesFor('en').filter((c) => REGION_OF[c.code] === 'europe');
      expect(groupByRegion(europeOnly, 'en').map((r) => r.name)).toEqual(['Europe']);
    });

    it('names countries in the given locale', () => {
      render(<Phone locale="fr" />);
      expect(picker()).toHaveAccessibleName('Country Royaume-Uni +44');
    });

    it('caches the country list per locale', () => {
      expect(countriesFor('de')).toBe(countriesFor('de'));
      expect(countriesFor('de')).not.toBe(countriesFor('en'));
    });

    it('accepts a custom name for the country picker', () => {
      render(<Phone countryLabel="Dialling code" />);
      expect(screen.getByRole('button', { name: /^Dialling code United Kingdom/ })).toBeInTheDocument();
    });
  });

  describe('typing', () => {
    it('formats the number for the country as you type', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.type(input(), '07400123456');
      expect(input()).toHaveValue('07400 123456');
    });

    it('keeps the caret after the same digit when editing the middle', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.type(input(), '074001234');
      expect(input()).toHaveValue('07400 1234');
      // Caret after "07", then type a digit: the number reflows but the caret stays after the 9.
      input().setSelectionRange(2, 2);
      await user.keyboard('9');
      expect(input()).toHaveValue('07940 01234');
      expect(input().selectionStart).toBe(3);
    });

    it('deletes the digit before a space when backspacing over the space', async () => {
      const user = userEvent.setup();
      render(<Phone defaultValue="+447400123456" />);
      input().focus();
      input().setSelectionRange(6, 6);
      await user.keyboard('{Backspace}');
      // "07400 |123456": the space can't go on its own, so the 0 before it goes instead.
      expect(input()).toHaveValue('07401 23456');
      expect(input().selectionStart).toBe(4);
    });

    it('puts the caret at the start when everything before it is deleted', async () => {
      const user = userEvent.setup();
      render(<Phone defaultValue="+447400123456" />);
      input().focus();
      input().setSelectionRange(1, 1);
      await user.keyboard('{Backspace}');
      expect(input().selectionStart).toBe(0);
    });

    it('switches country and shows the local format when a full international number is pasted', async () => {
      const user = userEvent.setup();
      const onCountryChange = vi.fn();
      const onValueChange = vi.fn();
      render(<Phone onCountryChange={onCountryChange} onValueChange={onValueChange} />);
      await user.click(input());
      await user.paste('+33 6 12 34 56 78');
      expect(input()).toHaveValue('06 12 34 56 78');
      expect(picker()).toHaveAccessibleName('Country France +33');
      expect(onCountryChange).toHaveBeenCalledWith('FR');
      expect(onValueChange).toHaveBeenLastCalledWith('+33612345678', { country: 'FR', valid: true });
    });

    it('keeps a partial international number as typed, following its country once known', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.type(input(), '+4');
      expect(input()).toHaveValue('+4');
      expect(picker()).toHaveAccessibleName('Country United Kingdom +44');
      await user.type(input(), '9301');
      expect(input()).toHaveValue('+49 30 1');
      expect(picker()).toHaveAccessibleName('Country Germany +49');
    });

    it('reports nothing for a lone plus sign', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Phone onValueChange={onValueChange} />);
      await user.type(input(), '+');
      expect(input()).toHaveValue('+');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('reports the number so far, the country and whether it is valid', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Phone onValueChange={onValueChange} />);
      await user.type(input(), '0740');
      expect(onValueChange).toHaveBeenLastCalledWith('+44740', { country: 'GB', valid: false });
      await user.type(input(), '0123456');
      expect(onValueChange).toHaveBeenLastCalledWith('+447400123456', { country: 'GB', valid: true });
    });

    it("keeps the caller's change and blur handlers", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onBlur = vi.fn();
      render(<Phone onChange={onChange} onBlur={onBlur} />);
      await user.type(input(), '0');
      await user.tab();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('choosing a country', () => {
    it('reformats the digits for the new country and returns focus to the number', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Phone defaultValue="+447400123456" onValueChange={onValueChange} />);
      await user.click(picker());
      await user.type(search(), 'Ireland{Enter}');
      expect(picker()).toHaveAccessibleName('Country Ireland +353');
      expect(input()).toHaveFocus();
      expect(onValueChange).toHaveBeenLastCalledWith('+3537400123456', { country: 'IE', valid: false });
    });

    it('finds countries by dialling code', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.click(picker());
      await user.type(search(), '+353{Enter}');
      expect(picker()).toHaveAccessibleName('Country Ireland +353');
    });

    it('reports a country change even with no number yet', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onCountryChange = vi.fn();
      render(<Phone onValueChange={onValueChange} onCountryChange={onCountryChange} />);
      await user.click(picker());
      await user.type(search(), 'France{Enter}');
      expect(onCountryChange).toHaveBeenCalledWith('FR');
      expect(onValueChange).toHaveBeenCalledWith('', { country: 'FR', valid: false });
    });
  });

  describe('values', () => {
    it('starts from an E.164 default value, taking the country from the number', () => {
      render(<Phone defaultValue="+14155550123" />);
      expect(input()).toHaveValue('(415) 555-0123');
      expect(picker()).toHaveAccessibleName('Country United States +1');
    });

    it('follows a controlled value changed from outside', () => {
      const { rerender } = render(<Phone value="+447400123456" />);
      expect(input()).toHaveValue('07400 123456');
      rerender(<Phone value="+33612345678" />);
      expect(input()).toHaveValue('06 12 34 56 78');
      expect(picker()).toHaveAccessibleName('Country France +33');
      rerender(<Phone value="" />);
      expect(input()).toHaveValue('');
    });

    it('stays put when the parent echoes back the value it was given', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('');
        return <Phone value={value} onValueChange={setValue} />;
      }
      render(<Controlled />);
      await user.type(input(), '0740');
      expect(input()).toHaveValue('0740');
      expect(input().selectionStart).toBe(4);
    });

    it('re-renders without change when a controlled value parses to what is shown', () => {
      const { rerender } = render(<Phone value="+447400123456" />);
      rerender(<Phone value="+447400123456 " />);
      expect(input()).toHaveValue('07400 123456');
    });

    it('can have its country controlled', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [country, setCountry] = useState<CountryCode>('IE');
        return <Phone country={country} onCountryChange={setCountry} />;
      }
      render(<Controlled />);
      expect(picker()).toHaveAccessibleName('Country Ireland +353');
      await user.click(picker());
      await user.type(search(), 'Spain{Enter}');
      expect(picker()).toHaveAccessibleName('Country Spain +34');
    });

    it('forwards its ref to the number input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TelephoneField label="Phone number" ref={ref} />);
      expect(ref.current).toBe(input());
    });
  });

  describe('validation', () => {
    it('flags a number that is not valid for the country, with an example, and clears when fixed', async () => {
      const user = userEvent.setup();
      render(<Phone />);
      await user.type(input(), '0123');
      await user.tab();
      expect(input()).toBeInvalid();
      expect(input()).toHaveAccessibleDescription('Enter a valid phone number, like 07400 123456.');
      await user.clear(input());
      await user.type(input(), '07400123456');
      expect(input()).toBeValid();
      expect(input()).not.toHaveAccessibleDescription();
    });

    it('re-checks when the country changes', async () => {
      const user = userEvent.setup();
      render(<Phone defaultValue="+447400123456" validateOn="change" />);
      expect(input()).toBeValid();
      await user.click(picker());
      await user.type(search(), 'Ireland{Enter}');
      expect(input()).toBeInvalid();
      expect(input()).toHaveAccessibleDescription('Enter a valid phone number, like 085 012 3456.');
    });

    it('blocks submit when required and empty, and focuses the number', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
      const onInvalid = vi.fn();
      render(
        <form aria-label="f" onSubmit={onSubmit}>
          <Phone required onInvalid={onInvalid} validationMessages={{ valueMissing: 'Enter your phone number.' }} />
          <button type="submit">Save</button>
        </form>,
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).not.toHaveBeenCalled();
      expect(onInvalid).toHaveBeenCalled();
      expect(input()).toHaveFocus();
      expect(input()).toHaveAccessibleDescription('Enter your phone number.');
    });

    it('runs a custom rule on the E.164 value', async () => {
      const user = userEvent.setup();
      render(<Phone validate={(value) => (value.startsWith('+447') ? null : 'Use a UK mobile.')} />);
      await user.type(input(), '02079460000');
      await user.tab();
      expect(input()).toHaveAccessibleDescription('Use a UK mobile.');
    });

    it('lets an explicit error win', () => {
      render(<Phone defaultValue="+447400123456" error="This number is already registered." />);
      expect(input()).toBeInvalid();
      expect(input()).toHaveAccessibleDescription('This number is already registered.');
    });
  });

  describe('forms', () => {
    it('submits the E.164 number under its name, and nothing for the visible input', async () => {
      const user = userEvent.setup();
      let data: FormData | null = null;
      render(
        <form
          aria-label="f"
          onSubmit={(event) => {
            event.preventDefault();
            data = new FormData(event.currentTarget);
          }}
        >
          <Phone name="phone" />
          <button type="submit">Save</button>
        </form>,
      );
      await user.type(input(), '07400123456');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect([...data!.entries()]).toEqual([['phone', '+447400123456']]);
    });

    it('can belong to a form elsewhere in the page', () => {
      const { container } = render(<Phone name="phone" form="checkout" defaultValue="+447400123456" />);
      expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('form', 'checkout');
    });

    it('disables the picker and the number together', () => {
      render(<Phone disabled />);
      expect(input()).toBeDisabled();
      expect(picker()).toBeDisabled();
    });
  });

  it('has no accessibility violations, empty, filled, open and with an error', async () => {
    const user = userEvent.setup();
    // A short list: axe in jsdom takes seconds per check with all ~245 countries in the page. The
    // Chromium story tests run axe on the full list.
    const short: CountryCode[] = ['GB', 'IE', 'FR', 'US'];
    const { container, rerender } = render(<Phone countries={short} hint="Mobile or landline." required />);
    expect(await axe(container)).toHaveNoViolations();
    rerender(
      <Phone countries={short} hint="Mobile or landline." required defaultValue="+447400123456" error="Already registered." />,
    );
    expect(await axe(container)).toHaveNoViolations();
    await user.click(picker());
    expect(await axe(container)).toHaveNoViolations();
    act(() => fireEvent.keyDown(search(), { key: 'Escape' }));
  });
});
