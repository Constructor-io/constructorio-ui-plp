import type { RequestConfigs, QueryParamEncodingOptions } from '../types';

function decodeArrayAsObj<T>(objStr: string): T | undefined {
  try {
    const arr = JSON.parse(objStr);
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

export const defaultQueryStringMap = {
  query: 'q',
  filterName: 'filterName',
  filterValue: 'filterValue',
  page: 'page',
  offset: 'offset',
  resultsPerPage: 'numResults',
  filters: 'f', // do special encoding/decoding
  sortBy: 'sortBy',
  sortOrder: 'sortOrder',
  section: 'section',
};

export function getUrl(): string {
  return window.location.href;
}

export function setUrl(newUrlWithEncodedState: string) {
  window.location.href = newUrlWithEncodedState;
}

export function decodeStateFromUrl(url: string): RequestConfigs {
  const urlObject = new URL(url);
  const urlParams = urlObject.searchParams;

  const rawState = {} as Record<string, string>;
  Object.entries(defaultQueryStringMap).forEach(([key, val]) => {
    const storedVal = urlParams.get(val);
    if (storedVal != null) {
      rawState[key] = storedVal;
    }
  });

  const {
    page,
    offset,
    resultsPerPage,
    filters,
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
  if (filters) state.filters = decodeArrayAsObj<Record<string, any>>(filters);

  return state;
}

export function encodeStateToUrl(
  state: RequestConfigs,
  options: QueryParamEncodingOptions = {},
): string {
  const { baseUrl: url, origin, pathname } = options;
  const baseUrl = url || `${origin}${pathname}`;

  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, val]) => {
    let encodedVal: string;

    if (key === 'filters' && state.filters) {
      encodedVal = encodeObjAsArray(state.filters);
    } else if (typeof val !== 'string') {
      encodedVal = JSON.stringify(val);
    } else {
      encodedVal = val;
    }

    params.set(defaultQueryStringMap[key], encodedVal);
  });

  return `${baseUrl}?${params.toString()}`;
}
