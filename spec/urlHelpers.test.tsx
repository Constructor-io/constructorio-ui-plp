import React from 'react';
import { render } from '@testing-library/react';
import testRequestState from './local_examples/sampleRequestState.json';
import testUrl from './local_examples/testJsonEncodedUrl.json';
import {
  getStateFromUrl,
  getUrlFromState,
  defaultQueryStringMap,
  getUrl,
  setUrl,
} from '../src/utils/urlHelpers';
import { RequestConfigs } from '../src/types';

describe('Testing Default UrlHelpers: getUrlFromState', () => {
  test('Should encode all request parameters as defined in defaultQueryStringMap', () => {
    const url = new URL(
      getUrlFromState(testRequestState as RequestConfigs, 'https://www.example.com/a/random/path'),
    );
    const params = url.searchParams;

    const query = params.get(defaultQueryStringMap.query);
    expect(query).toBe('item');

    Object.entries(testRequestState.filters)?.forEach(([key, value]) => {
      const filterValues = params.getAll(`${defaultQueryStringMap.filters}[${key}]`);

      expect(new Set(filterValues)).toEqual(new Set(value));
    });

    const page = params.get(defaultQueryStringMap.page);
    expect(page).toBe('3');

    const offset = params.get(defaultQueryStringMap.offset);
    expect(offset).toBe('24');

    const resultsPerPage = params.get(defaultQueryStringMap.resultsPerPage);
    expect(resultsPerPage).toBe('30');

    const sortBy = params.get(defaultQueryStringMap.sortBy);
    expect(sortBy).toBe('price');

    const sortOrder = params.get(defaultQueryStringMap.sortOrder);
    expect(sortOrder).toBe('descending');

    const section = params.get(defaultQueryStringMap.section);
    expect(section).toBe('Products');
  });

  test('Should not encode parameters not defined in defaultQueryStringMap', () => {
    const urlString = getUrlFromState(testRequestState as RequestConfigs, 'https://www.example.com/a/random/path');
    const url = new URL(urlString);
    const params = url.searchParams;

    // Check if we used `null` or `undefined` as keys
    const nullCheck = params.get(null);
    expect(nullCheck).toBeNull();

    const undefinedCheck = params.get(undefined);
    expect(undefinedCheck).toBeNull();

    // Check for the values
    expect(urlString.indexOf(JSON.stringify(testRequestState.fmtOptions))).toBe(-1);
    expect(urlString.indexOf(JSON.stringify(testRequestState.preFilterExpression))).toBe(-1);
    expect(urlString.indexOf(JSON.stringify(testRequestState.variationsMap))).toBe(-1);
    expect(urlString.indexOf(testRequestState.qsParam)).toBe(-1);

    // Check that filterName and filterValue aren't encoded as query string parameters
    expect(params.has(testRequestState.filterName)).toBe(false);
    expect(params.has(testRequestState.filterValue)).toBe(false);
  });

  test('Should update pathname when filterName and filterValue are provided', () => {
    const url = new URL(
      getUrlFromState(testRequestState as RequestConfigs, 'https://www.example.com/a/random/path'),
    )

    expect(url.pathname).toBe('/group_id/Styles');    
  });

  test('Should handle empty pathname correctly', () => {
    const url = new URL(
      getUrlFromState(testRequestState as RequestConfigs, 'https://www.example.com'),
    );
    expect(url.pathname).toBe('/group_id/Styles');
  });

  test('Should replace existing group_id in pathname', () => {
    const url = new URL(
      getUrlFromState(
        testRequestState as RequestConfigs, 
        'https://www.example.com/path/group_id/old-value'
      ),
    );
    expect(url.pathname).toBe('/path/group_id/Styles');
  });

  test('Should replace existing collection_id in pathname', () => {
    const url = new URL(
      getUrlFromState(
        { ...testRequestState, filterName: 'collection_id' } as RequestConfigs,
        'https://www.example.com/path/collection_id/old-value'
      ),
    );
    expect(url.pathname).toBe('/path/collection_id/Styles');
  });

  test('Should retain pathname when filterName and filterValue are not provided', () => {
    const { filterName, filterValue, ...testRequestStateWithoutFilters } = testRequestState;
    const url = new URL(
      getUrlFromState(testRequestStateWithoutFilters as RequestConfigs, 'https://www.example.com/a/random/path'),
    )

    expect(url.pathname).toBe('/a/random/path');
  });
});

describe('Testing Default UrlHelpers: getStateFromUrl', () => {
  test('Should decode all request parameters as defined in defaultQueryStringMap', () => {
    const state = getStateFromUrl(testUrl);

    expect(typeof state.query).toBe('string');
    expect(state.query).toBe('item');

    expect(typeof state.filters).toBe('object');
    expect(state.filters).toEqual({
      price: ['5-100'],
      color: ['Gold'],
      test: ['testValue', 'testValue2', 'testValue3'],
      lowestPrice: ['100', '300'],
    });

    expect(typeof state.sortBy).toBe('string');
    expect(state.sortBy).toBe('price');

    expect(typeof state.sortOrder).toBe('string');
    expect(state.sortOrder).toBe('descending');

    expect(typeof state.section).toBe('string');
    expect(state.section).toBe('Products');

    expect(typeof state.fmtOptions).toBe('undefined');
    expect(typeof state.preFilterExpression).toBe('undefined');
    expect(typeof state.variationsMap).toBe('undefined');
    expect(typeof (state as any).qsParam).toBe('undefined');
  });

  test('getBrowseGroup should get the last path name as the group_id', () => {
    const mockUrl = 'https://example.com/a/random/lastPathName?q=3&randomQuery=[true,%20false]';
    const { filterName, filterValue } = getStateFromUrl(mockUrl);
    expect(filterName).toBe('group_id');
    expect(filterValue).toBe('lastPathName');
  });
});

describe('Testing Default UrlHelpers: getUrl, setUrl', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/a/random/path?q=3&randomQuery=[true,%20false]';
  const mockLocation = new URL(mockUrl);

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: mockLocation,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
  });

  test('getUrl should get the full url by default', () => {
    function TestReactComponent() {
      const url = getUrl();
      expect(url).toBe(mockUrl);

      return <div>Test</div>;
    }

    render(<TestReactComponent />);
  });

  test('setUrl should set the request configs to the url by default', () => {
    function TestReactComponent() {
      setUrl(testUrl);
      expect(window.location.href).toBe(testUrl);

      return <div>Test</div>;
    }

    render(<TestReactComponent />);
  });
});
