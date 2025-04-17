import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { RequestConfigs, RequestQueryParams } from '../types';
import { removeNullValuesFromObject } from './common';

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
