import {
  Nullable,
  SearchParameters,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import {
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
  PlpBrowseData,
} from '../types';
import { removeNullValuesFromObject } from './utilFunctions';

export function isPlpSearchDataResults(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpSearchDataResults {
  return 'response' in (response || {});
}

export function isPlpSearchDataRedirect(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpSearchDataRedirect {
  return 'redirect' in (response || {});
}

export function isPlpBrowseDataResults(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpBrowseData {
  return 'response' in (response || {});
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

export function isOptionFacet(
  facet: PlpFacet,
): facet is PlpMultipleFacet | PlpSingleFacet | PlpHierarchicalFacet {
  return isMultipleOrBucketedFacet(facet) || isSingleFacet(facet) || isHierarchicalFacet(facet);
}

export function checkIsSearchPage(requestConfigs: RequestConfigs) {
  const { query } = getSearchParamsFromRequestConfigs(requestConfigs);

  return !!query;
}

export function checkIsBrowsePage(requestConfigs: RequestConfigs) {
  const { filterName, filterValue } = getBrowseParamsFromRequestConfigs(requestConfigs);

  return !!filterName && !!filterValue;
}

export type PageType = 'search' | 'browse' | 'unknown';

export function getPageType(requestConfigs: RequestConfigs): PageType {
  if (checkIsSearchPage(requestConfigs)) {
    return 'search';
  }
  if (checkIsBrowsePage(requestConfigs)) {
    return 'browse';
  }
  return 'unknown';
}

export function getPlpContainerCnstrcDataAttributes(
  data: PlpSearchDataResults | PlpSearchDataRedirect | PlpBrowseData | null,
  requestConfigs: RequestConfigs,
) {
  if (!data || (!isPlpSearchDataResults(data) && !isPlpBrowseDataResults(data))) return {};

  const { filterName, filterValue } = requestConfigs;
  const pageType = getPageType(requestConfigs);
  let dataCnstrc: Record<`data-cnstrc-${string}`, string | number | boolean> = {};

  switch (pageType) {
    case 'browse':
      dataCnstrc = {
        'data-cnstrc-browse': true,
        'data-cnstrc-num-results': data.response.totalNumResults,
        'data-cnstrc-filter-name': filterName!,
        'data-cnstrc-filter-value': filterValue!,
      };
      break;

    case 'search':
      dataCnstrc = {
        'data-cnstrc-search': true,
        'data-cnstrc-num-results': data.response.totalNumResults,
      };
      break;

    case 'unknown':
      dataCnstrc = {};
      break;

    default:
      break;
  }

  return dataCnstrc;
}
