import {
  Nullable,
  SearchParameters,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import {
  PrimaryColorStyles,
  RequestConfigs,
  RequestQueryParams,
  PlpFacet,
  PlpRangeFacet,
  PlpMultipleFacet,
  PlpSearchDataResults,
  PlpSearchDataRedirect,
  PlpSearchData,
  PlpSingleFacet,
  PlpHierarchicalFacet,
} from './types';

// Function to emulate pausing between interactions
export function sleep(ms) {
  // eslint-disable-next-line
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* istanbul ignore next */
export const logger = (error: any) => {
  try {
    if (typeof process !== 'undefined' && process?.env?.LOGGER) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  } catch (e) {
    // process variable is not available and logger should not be active
  }
};

// eslint-disable-next-line @cspell/spellchecker
export function tryCatchify(func: Function) {
  return (...args: any) => {
    try {
      return func(...args);
    } catch (e) {
      logger(e);
    }
    return undefined;
  };
}

export function removeNullValuesFromObject(obj: Object) {
  const filteredListOfEntries = Object.entries(obj).filter(([, val]) => val != null);

  return Object.fromEntries(filteredListOfEntries);
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

export function isPlpSearchDataResults(
  response: Nullable<PlpSearchData>,
): response is PlpSearchDataResults {
  return 'response' in (response || {});
}

export function isPlpSearchDataRedirect(
  response: Nullable<PlpSearchData>,
): response is PlpSearchDataRedirect {
  return 'redirect' in (response || {});
}

export function getSearchParamsFromRequestConfigs(requestConfigs: RequestConfigs): {
  query: string;
  searchParams: SearchParameters;
} {
  const { query = '', filterValue, filterName, ...rest } = requestConfigs;
  const searchParams = removeNullValuesFromObject(rest);

  return { query, searchParams };
}

export function getBrowseParamsFromRequestConfigs(requestConfigs: RequestConfigs): {
  filterName: string;
  filterValue: string;
  queryParams: RequestQueryParams;
} {
  const { query, filterValue = '', filterName = '', ...queryParams } = requestConfigs;

  return { filterName, filterValue, queryParams: removeNullValuesFromObject(queryParams) };
}

export function isRangeFacet(facet: PlpFacet): facet is PlpRangeFacet {
  return facet.type === 'range';
}

export function isMultipleOrBucketedFacet(facet: PlpFacet): facet is PlpMultipleFacet {
  return facet.type === 'multiple';
}

export function isSingleFacet(facet: PlpFacet): facet is PlpSingleFacet {
  return facet.type === 'single';
}

export function isHierarchicalFacet(facet: PlpFacet): facet is PlpHierarchicalFacet {
  return facet.type === 'hierarchical';
}

export function isOptionFacet(facet: PlpFacet) {
  return isMultipleOrBucketedFacet(facet) || isSingleFacet(facet) || isHierarchicalFacet(facet);
}
