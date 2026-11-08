import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from 'react';
import {
  AsYouType,
    getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { cx } from '../../utils/cx';
import { useFieldValidation, type ValidationProps } from '../../utils/validation';
import { Field, useFieldIds, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Select, SelectGroup, SelectItem } from '../Select/Select';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { countriesFor, groupByRegion, useFlags, type Country, type RegionKey } from './countries';
import styles from './TelephoneField.module.css';

export type { CountryCode, RegionKey };

export interface TelephoneChangeDetails {
  country: CountryCode;
  /** Whether the number is a complete, valid number for its country. */
  valid: boolean;
}

export interface TelephoneFieldProps
  extends FieldBaseProps,
    ValidationProps<string>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'children' | 'name'> {
  /** The number in international E.164 form, e.g. `+447400123456`. `''` when empty. */
  value?: string;
  defaultValue?: string;
  /** Called with the E.164 number (or what's typed so far) as the number or country changes. */
  onValueChange?: (value: string, details: TelephoneChangeDetails) => void;
  /** The selected country. Leave unset to let the field manage it. */
  country?: CountryCode;
  /** Starting country when `country` and `defaultValue` don't decide it. Defaults to `GB`. */
  defaultCountry?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  /**
   * Limits the dropdown to these countries, e.g. the ones you deliver to. The selected country is
   * always listed too, so a pasted number from elsewhere still shows its country.
   */
  countries?: CountryCode[];
  /** Countries listed first in the dropdown, in their own group, in this order. */
  preferredCountries?: CountryCode[];
  /** Heading of the preferred countries' group. Defaults to "Suggested". */
  preferredLabel?: string;
  /**
   * Region headings in the dropdown, to translate them. Defaults to Africa, Americas, Asia, Europe
   * and Oceania. Country names translate automatically from `locale`.
   */
  regionLabels?: Partial<Record<RegionKey, string>>;
  /** Language for country names. Defaults to `en`. */
  locale?: string;
  /** Accessible name of the country picker. Defaults to "Country". */
  countryLabel?: string;
  /** Submits the E.164 number under this name. */
  name?: string;
  /** Class for the outer field wrapper. */
  className?: string;
}

/**
 * Reads the flag set itself rather than taking it as a prop: Select keeps the icon element an
 * option registered with, so the flag in the closed trigger must update on its own when the set
 * arrives.
 */
function Flag({ code }: { code: CountryCode }) {
  const svg = useFlags()?.[code];
  if (!svg) return <span className={cx(styles.flag, styles.flagPlaceholder)} />;
  return <img className={styles.flag} src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="" />;
}

const digitCount = (text: string) => text.replace(/[^\d+]/g, '').length;

/** The caret position just after the `digits`-th digit (or `+`) of `text`. */
function caretAfterDigits(text: string, digits: number) {
  if (digits === 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/[\d+]/.test(text[i] as string) && ++seen === digits) return i + 1;
  }
  return text.length;
}

/** The number as entered, formatted for display, plus its E.164 value. */
function interpret(raw: string, country: CountryCode) {
  if (raw.trim().startsWith('+')) {
    // Typed or pasted internationally. The country picker follows as soon as the number shows
    // which country it is; the text switches to the local format only once the number is complete,
    // since local formatting of a partial number can drop the trunk prefix (the UK's leading 0).
    const typed = new AsYouType();
    const text = typed.input(raw);
    const number = typed.getNumber();
    if (number?.isValid()) {
      return { country: number.country as CountryCode, text: number.formatNational(), e164: number.number as string };
    }
    return { country: typed.getCountry() ?? country, text, e164: typed.getNumberValue() ?? '' };
  }
  const typed = new AsYouType(country);
  return { country, text: typed.input(raw), e164: typed.getNumberValue() ?? '' };
}

/** Display state for an E.164 value coming from props. */
function fromValue(value: string, fallback: CountryCode) {
  const parsed = value ? parsePhoneNumberFromString(value) : undefined;
  const country = parsed?.country ?? fallback;
  return { country, text: parsed ? parsed.formatNational() : '', e164: value };
}

/**
 * A phone number input with a searchable country picker showing flags and dialling codes.
 * Formats as you type, accepts pasted international numbers (switching the country to match),
 * validates the number for the chosen country, and reports and submits it in E.164 form.
 */
export const TelephoneField = forwardRef<HTMLInputElement, TelephoneFieldProps>(function TelephoneField(
  {
    label,
    hint,
    error,
    hideLabel,
    id,
    className,
    required,
    disabled,
    value,
    defaultValue = '',
    onValueChange,
    country: countryProp,
    defaultCountry = 'GB',
    onCountryChange,
    countries: allowed,
    preferredCountries = [],
    preferredLabel = 'Suggested',
    regionLabels,
    locale = 'en',
    countryLabel = 'Country',
    name,
    form,
    autoComplete = 'tel',
    validate,
    validationMessages,
    validateOn,
    onBlur,
    onChange,
    onInvalid,
    ...inputProps
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const [state, setState] = useState(() => fromValue(value ?? defaultValue, countryProp ?? defaultCountry));
  const country = countryProp ?? state.country;

  // A controlled value that isn't the one we last reported came from outside: show it.
  const reported = useRef(state.e164);
  if (value !== undefined && value !== reported.current) {
    reported.current = value;
    const next = fromValue(value, country);
    if (next.text !== state.text || next.country !== state.country) setState(next);
  }

  const commit = (next: ReturnType<typeof interpret>) => {
    setState(next);
    if (next.country !== country) onCountryChange?.(next.country);
    if (next.e164 !== reported.current || next.country !== country) {
      reported.current = next.e164;
      onValueChange?.(next.e164, { country: next.country, valid: isValidPhoneNumber(next.e164) });
    }
  };

  // libphonenumber ships a mobile example for every country it lists.
  const example = getExampleNumber(country, examples)!.formatNational();

  const validation = useFieldValidation(inputRef, {
    getValue: () => state.e164,
    validate: (e164) => {
      if (state.text && !isValidPhoneNumber(state.text, country)) {
        return `Enter a valid phone number, like ${example}.`;
      }
      return validate?.(e164);
    },
    validationMessages,
    validateOn,
  });
  const shownError = error ?? validation.error;
  const { controlId, hintId, describedBy } = useFieldIds(id, hint, shownError);

  // Re-check after each change has rendered, so the rule sees the new number and country.
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) first.current = false;
    else validation.onValueChange();
  }, [state.text, country]);

  // After a country is picked, move on to the number. This runs after render, because Select
  // returns focus to its own button when it closes.
  const focusNumber = useRef(false);
  useLayoutEffect(() => {
    if (!focusNumber.current) return;
    focusNumber.current = false;
    inputRef.current!.focus();
  });

  // Keep the caret after the same digit once the text has been reformatted.
  const caret = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (caret.current === null) return;
    const position = caretAfterDigits(state.text, caret.current);
    inputRef.current!.setSelectionRange(position, position);
    caret.current = null;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    let raw = event.target.value;
    // A tel input always has a text cursor, so selectionStart is never null here.
    let at = event.target.selectionStart!;
    // Deleting only a space or bracket would be undone by formatting; delete the digit before it.
    if (raw.length < state.text.length && digitCount(raw) === digitCount(state.text)) {
      const before = raw.slice(0, at).replace(/[\d+](?=[^\d+]*$)/, '');
      raw = before + raw.slice(at);
      at = before.length;
    }
    caret.current = digitCount(raw.slice(0, at));
    commit(interpret(raw, country));
  };

  // The picker is memoised below, so it reaches the latest state through a ref.
  const latest = useRef({ commit, text: state.text });
  latest.current = { commit, text: state.text };

  const allCountries = countriesFor(locale);
  const countries = useMemo(
    () => (allowed ? allCountries.filter((c) => allowed.includes(c.code) || c.code === country) : allCountries),
    [allCountries, allowed?.join(), country],
  );
  const { preferred, regions } = useMemo(() => {
    const picked = preferredCountries
      .map((code) => countries.find((c) => c.code === code))
      .filter((c): c is Country => !!c);
    const rest = countries.filter((c) => !preferredCountries.includes(c.code));
    return { preferred: picked, regions: groupByRegion(rest, locale, regionLabels) };
  }, [countries, locale, preferredCountries.join(), JSON.stringify(regionLabels)]);

  // Memoised so typing in the number doesn't re-render all ~245 country options.
  const picker = useMemo(() => {
    const current = countries.find((c) => c.code === country)!;
    const option = (c: Country) => (
      <SelectItem key={c.code} value={c.code} icon={<Flag code={c.code} />} textValue={`${c.name} +${c.callingCode}`}>
        <span className={styles.option}>
          <span className={styles.optionName}>{c.name}</span>
          <span className={styles.dialCode}>+{c.callingCode}</span>
        </span>
      </SelectItem>
    );
    return (
      <Select
        label={countryLabel}
        hideLabel
        searchable
        searchPlaceholder="Search countries"
        value={country}
        onValueChange={(code) => {
          focusNumber.current = true;
          latest.current.commit(interpret(latest.current.text, code as CountryCode));
        }}
        disabled={disabled}
        className={styles.country}
        renderValue={() => (
          <span className={styles.dialCode}>
            {/* The space sits outside the hidden name, or it's trimmed from the accessible name. */}
            <VisuallyHidden>{current.name}</VisuallyHidden> +{current.callingCode}
          </span>
        )}
      >
        {preferred.length > 0 && <SelectGroup label={preferredLabel}>{preferred.map(option)}</SelectGroup>}
        {regions.map((region) => (
          <SelectGroup key={region.key} label={region.name}>
            {region.countries.map(option)}
          </SelectGroup>
        ))}
      </Select>
    );
  }, [countries, country, countryLabel, disabled, preferred, preferredLabel, regions]);

  return (
    <Field
      label={label}
      hint={hint}
      error={shownError}
      hideLabel={hideLabel}
      controlId={controlId}
      hintId={hintId}
      required={required}
      className={className}
    >
      <div className={styles.row}>
        {picker}
        <input
          ref={inputRef}
          id={controlId}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          placeholder={example}
          value={state.text}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          className={cx(fieldStyles.control, styles.number)}
          onChange={handleChange}
          onBlur={(event: FocusEvent<HTMLInputElement>) => {
            validation.onBlur();
            onBlur?.(event);
          }}
          onInvalid={(event) => {
            validation.onInvalid(event);
            onInvalid?.(event);
          }}
          {...inputProps}
        />
      </div>
      {name && <input type="hidden" name={name} form={form} value={state.e164} />}
    </Field>
  );
});
