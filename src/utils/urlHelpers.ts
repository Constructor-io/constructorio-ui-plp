import type { RequestConfigs, QueryParamEncodingOptions, DefaultQueryStringMap } from '../types';

function decodeArrayAsObj<T>(arrStr: string): T | undefined {
  try {
    const arr = JSON.parse(arrStr);
    return Object.fromEntries(arr) as T;
  } catch (err) {
    // Fail silently?
  }

  return undefined;
}

function encodeObjAsArray(obj: Record<string, any>) {
  const objAsArray = Array.from(Object.entries(obj));
  return JSON.stringify(objAsArray);
}

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
    Object.entries(filters)?.forEach(([filterName, filterValue]) => {
      urlParams.set(`filters[${filterName}]`, filterValue);
    });
  }
}

export function getStateFromUrl(url: string): RequestConfigs {
  const urlObject = new URL(url);
  const urlParams = urlObject.searchParams;
  const paths = decodeURI(urlObject?.pathname)?.split('/');
  let filterName: string | undefined;
  let filterValue: string | undefined;

  if (paths.length > 0) {
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

  // extract filters

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

export function getUrlFromState(
  state: RequestConfigs,
  options: QueryParamEncodingOptions = {},
): string {
  const { baseUrl: url, origin, pathname } = options;
  const baseUrl = url || `${origin}${pathname}`;

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

  let groupPath = '';
  if (state.filterValue) {
    groupPath = `/${state.filterName}/${state.filterValue}`;
  }

  return `${baseUrl}${groupPath}?${params.toString()}`;
}
