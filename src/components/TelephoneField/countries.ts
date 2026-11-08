import { useEffect, useState } from 'react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  callingCode: string;
}

const byLocale = new Map<string, Country[]>();

/** Every country libphonenumber knows, named in `locale` and sorted by name. Cached per locale. */
export function countriesFor(locale: string): Country[] {
  const cached = byLocale.get(locale);
  if (cached) return cached;
  const names = new Intl.DisplayNames([locale], { type: 'region', fallback: 'code' });
  const list = getCountries()
    .map((code) => ({ code, name: names.of(code) as string, callingCode: getCountryCallingCode(code) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  byLocale.set(locale, list);
  return list;
}

/*
 * UN M49 continental regions. Cyprus, Turkey and the Caucasus count as Asia, as in M49; search
 * still finds them. Every code libphonenumber lists must appear exactly once (checked by a test).
 * Names come from `regionLabels`, not Intl.DisplayNames: Chrome's ICU data has country names but
 * not continent names, so it returns codes like "150".
 */
export type RegionKey = 'africa' | 'americas' | 'asia' | 'europe' | 'oceania';

const REGIONS: Record<RegionKey, string> = {
  africa:
    'AC AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW IO KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TA TD TG TN TZ UG YT ZA ZM ZW',
  americas:
    'AG AI AR AW BB BL BM BO BQ BR BS BZ CA CL CO CR CU CW DM DO EC FK GD GF GL GP GT GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PR PY SR SV SX TC TT US UY VC VE VG VI',
  asia: 'AE AF AM AZ BD BH BN BT CN CY GE HK ID IL IN IQ IR JO JP KG KH KP KR KW KZ LA LB LK MM MN MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TR TW UZ VN YE',
  europe:
    'AD AL AT AX BA BE BG BY CH CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK',
  oceania: 'AS AU CC CK CX FJ FM GU KI MH MP NC NF NR NU NZ PF PG PW SB TK TO TV VU WF WS',
};

export const DEFAULT_REGION_LABELS: Record<RegionKey, string> = {
  africa: 'Africa',
  americas: 'Americas',
  asia: 'Asia',
  europe: 'Europe',
  oceania: 'Oceania',
};

export const REGION_OF: Record<string, RegionKey> = Object.fromEntries(
  Object.entries(REGIONS).flatMap(([region, codes]) => codes.split(' ').map((code) => [code, region as RegionKey])),
);

export interface Region {
  key: RegionKey;
  name: string;
  countries: Country[];
}

/** `countries` grouped by continent, named from `labels` and sorted by name in `locale`. */
export function groupByRegion(
  countries: Country[],
  locale: string,
  labels: Partial<Record<RegionKey, string>> = {},
): Region[] {
  return (Object.keys(REGIONS) as RegionKey[])
    .map((key) => ({
      key,
      name: labels[key] ?? DEFAULT_REGION_LABELS[key],
      countries: countries.filter((country) => REGION_OF[country.code] === key),
    }))
    .filter((region) => region.countries.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

/* -------------------------------------------------------------------------------------------------
 * Flags
 *
 * The flag set is ~47 KB gzipped, and the dropdown shows every country, so it loads as one chunk
 * the first time a TelephoneField mounts, rather than in every app's main bundle. Until it arrives
 * (and for the few codes without a flag) a neutral placeholder holds the space.
 * -----------------------------------------------------------------------------------------------*/

export type FlagSet = Record<string, string>;

let flagSet: FlagSet | null = null;
let flagLoad: Promise<FlagSet> | null = null;

export function loadFlags(): Promise<FlagSet> {
  flagLoad ??= import('country-flag-icons/string/3x2').then((module) => {
    flagSet = module as unknown as FlagSet;
    return flagSet;
  });
  return flagLoad;
}

/** The flag SVGs once loaded, else `null`. Starts the load on first use. */
export function useFlags(): FlagSet | null {
  const [flags, setFlags] = useState(flagSet);
  useEffect(() => {
    if (flags) return;
    let live = true;
    loadFlags().then((set) => {
      if (live) setFlags(set);
    });
    return () => {
      live = false;
    };
  }, [flags]);
  return flags;
}
