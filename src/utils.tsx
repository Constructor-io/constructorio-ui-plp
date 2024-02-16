import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import {
  PrimaryColorStyles,
  RequestConfigs,
  RequestQueryParams,
  PlpSearchRedirectResponse,
  PlpSearchResponse,
} from './types';

// Function to emulate pausing between interactions
export function sleep(ms) {
  // eslint-disable-next-line
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function rgbToHsl(r: number, g: number, b: number) {
  const rConverted = r / 255;
  const gConverted = g / 255;
  const bConverted = b / 255;
  const max = Math.max(rConverted, gConverted, bConverted);
  const min = Math.min(rConverted, gConverted, bConverted);
  const delta = max - min;
  let h = 0;

  if (delta === 0) h = 0;
  else if (max === rConverted) h = ((gConverted - bConverted) / delta) % 6;
  else if (max === gConverted) h = (bConverted - rConverted) / delta + 2;
  else if (max === bConverted) h = (rConverted - gConverted) / delta + 4;

  const l = (min + max) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  const finalH = Math.round(h * 60);
  const finalS = Math.round(s * 100);
  const finalL = Math.round(l * 100);

  return [finalH, finalS, finalL];
}

export function convertPrimaryColorsToString(primaryColorStyles: PrimaryColorStyles) {
  return `{
    --primary-color-h: ${primaryColorStyles['--primary-color-h']}; 
    --primary-color-s: ${primaryColorStyles['--primary-color-s']}; 
    --primary-color-l: ${primaryColorStyles['--primary-color-l']}; 
  }`;
}

export function isHexColor(hex?: string) {
  return (
    typeof hex === 'string' && hex.length === 7 && !Number.isNaN(Number(`0x${hex.substring(1)}`))
  );
}

export function getPreferredColorScheme() {
  let colorScheme = 'light';
  // Check if the dark-mode Media-Query matches
  if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
    colorScheme = 'dark';
  }
  return colorScheme;
}

export function isPlpSearchResponse(
  response: PlpSearchRedirectResponse | PlpSearchResponse,
): response is PlpSearchResponse {
  return 'results' in response;
}

export function isPlpRedirectSearchResponse(
  response: PlpSearchRedirectResponse | PlpSearchResponse,
): response is PlpSearchRedirectResponse {
  return 'redirect' in response;
}

export function getSearchParamsFromRequestConfigs(requestConfigs: RequestConfigs): {
  query: string;
  searchParams: SearchParameters;
} {
  const { query = '', filterValue, filterName, ...searchParams } = requestConfigs;
  return { query, searchParams };
}

export function getBrowseParamsFromRequestConfigs(requestConfigs: RequestConfigs): {
  filterName: string;
  filterValue: string;
  queryParams: RequestQueryParams;
} {
  const { query, filterValue = '', filterName = '', ...queryParams } = requestConfigs;
  return { filterName, filterValue, queryParams };
}
