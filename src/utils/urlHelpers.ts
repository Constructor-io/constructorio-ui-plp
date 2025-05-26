import type { RequestConfigs, DefaultQueryStringMap } from '../types';

export const defaultQueryStringMap: Readonly<DefaultQueryStringMap> = Object.freeze({
  query: 'q',
  page: 'page',
  offset: 'offset',
  resultsPerPage: 'numResults',
  filters: 'filters', // do special encoding/decoding
  sortBy: 'sortBy',
  sortOrder: 'sortOrder',
  section: 'section',
});

export function getUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.location.href;
}

export function setUrl(newUrlWithEncodedState: string) {
  if (typeof window === 'undefined') return;
  window.location.href = newUrlWithEncodedState;
}

export function extractFiltersFromUrl(urlParams: URLSearchParams) {
  const filters = {};
  const filterRegex = new RegExp(`^${defaultQueryStringMap.filters}\\[(.*)\\]`);

  urlParams?.forEach((value, key) => {
    const filterKey = key?.match(filterRegex)?.[1];
    if (filterKey) {
      if (filters[filterKey]) {
        filters[filterKey].push(value);
      } else {
        filters[filterKey] = [value];
      }
    }
  });

  return Object.keys(filters).length ? filters : undefined;
}

export function getFilterParamsFromState(
  urlParams: URLSearchParams,
  filters: RequestConfigs['filters'],
) {
  if (filters) {
    Object.entries(filters)?.forEach(([filterName, filterValues]) => {
      if (Array.isArray(filterValues)) {
        filterValues.forEach((filterValue) => {
          urlParams.append(`filters[${filterName}]`, String(filterValue));
        });
      } else {
        urlParams.append(`filters[${filterName}]`, String(filterValues));
      }
    });
  }
}

export function getStateFromUrl(url: string): RequestConfigs {
  const urlObject = new URL(url);
  const urlParams = urlObject.searchParams;
  const paths = decodeURI(urlObject?.pathname)?.split('/');
  const query = urlParams.get(defaultQueryStringMap.query);
  let filterName: string | undefined;
  let filterValue: string | undefined;

  if (!query && paths.length > 0) {
    filterName = 'group_id';
    filterValue = paths[paths.length - 1];
  }

  const rawState = {} as Record<string, string>;
  Object.entries(defaultQueryStringMap).forEach(([key, val]) => {
    const storedVal = urlParams.get(val);
    if (storedVal != null) {
      rawState[key] = storedVal;
    }
  });

  const filters = extractFiltersFromUrl(urlParams);

  const {
    page,
    offset,
    resultsPerPage,
    fmtOptions,
    hiddenFacets,
    hiddenFields,
    variationsMap,
    preFilterExpression,
    ...rest
  } = rawState;

  const state = { ...rest } as RequestConfigs;
  if (page) state.page = Number(page);
  if (offset) state.offset = Number(offset);
  if (resultsPerPage) state.resultsPerPage = Number(resultsPerPage);
  if (filters) state.filters = filters;
  if (filterName) {
    state.filterName = filterName;
    state.filterValue = filterValue;
  }

  return state;
}

export function getUrlFromState(state: RequestConfigs, url: string): string {
  const urlObject = new URL(url);
  let { pathname } = urlObject;

  if (state.filterName && state.filterValue) {
    if (pathname.match(/(group_id|collection_id)\/[^/]+$/)) {
      pathname = pathname.replace(
        /\/(group_id|collection_id)\/[^/]+$/,
        `/${state.filterName}/${state.filterValue}`,
      );
    } else {
      pathname = `/${state.filterName}/${state.filterValue}`;
    }
  }

  const params = new URLSearchParams();

  Object.entries(state).forEach(([key, val]) => {
    if (defaultQueryStringMap[key] === undefined) {
      return;
    }

    let encodedVal: string = '';

    if (key === 'filters' && state.filters) {
      getFilterParamsFromState(params, state.filters);
    } else if (typeof val !== 'string') {
      encodedVal = JSON.stringify(val);
    } else {
      encodedVal = val;
    }

    if (encodedVal) {
      params.set(defaultQueryStringMap[key], encodedVal);
    }
  });

  return `${urlObject.origin}${pathname}?${params.toString()}`;
}
