import React from 'react';
import { render } from '@testing-library/react';
import testRequestState from './local_examples/sampleRequestState.json';
import testUrl from './local_examples/sampleEncodedUrl.json';
import {
  decodeStateFromUrl,
  encodeStateToUrl,
  defaultQueryStringMap,
  getUrl,
  setUrl,
} from '../src/utils/encoders';

describe('Testing Default Encoders: encodeStateToUrl', () => {
  test('Should encode all request parameters as defined in defaultQueryStringMap', () => {
    const url = new URL(
      encodeStateToUrl(testRequestState, { baseUrl: 'https://www.example.com/a/random/path' }),
    );
    const params = url.searchParams;

    const query = params.get(defaultQueryStringMap.query);
    expect(query).toBe('item');

    const filterName = params.get(defaultQueryStringMap.filterName);
    expect(filterName).toBe('group_id');

    const filterValue = params.get(defaultQueryStringMap.filterValue);
    expect(filterValue).toBe('Styles');

    const filters = params.get(defaultQueryStringMap.filters);
    expect(filters).toBe('[["price","5-100"],["test","testValue"],["lowestPrice",100]]');

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
    const urlString = encodeStateToUrl(testRequestState, {
      baseUrl: 'https://www.example.com/a/random/path',
    });
    const url = new URL(urlString);
    const params = url.searchParams;

    // Check if we used `null` or `undefined` as keys
    const nullCheck = params.get(null);
    expect(nullCheck).toBeNull();

    const undefinedCheck = params.get(undefined);
    expect(undefinedCheck).toBeNull();

    // Check for the values
    expect(urlString.indexOf(testRequestState.query)).toBe(-1);
    expect(urlString.indexOf(testRequestState.filterName)).toBe(-1);
    expect(urlString.indexOf(testRequestState.filterValue)).toBe(-1);
    expect(urlString.indexOf(testRequestState.fmtOptions)).toBe(-1);
    expect(urlString.indexOf(testRequestState.preFilterExpression)).toBe(-1);
    expect(urlString.indexOf(testRequestState.variationsMap)).toBe(-1);
    expect(urlString.indexOf(testRequestState.qsParam)).toBe(-1);
  });
});

describe('Testing Default Encoders: decodeStateFromUrl', () => {
  test('Should decode all request parameters as defined in defaultQueryStringMap', () => {
    const state = decodeStateFromUrl(testUrl);

    expect(typeof state.query).toBe('string');
    expect(state.query).toBe('item');

    expect(typeof state.filterName).toBe('string');
    expect(state.filterName).toBe('group_id');

    expect(typeof state.filterValue).toBe('string');
    expect(state.filterValue).toBe('Styles');

    expect(typeof state.filters).toBe('object');
    expect(state.filters).toEqual({
      price: '5-100',
      test: 'testValue',
      lowestPrice: 100,
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
    expect(typeof state.qsParam).toBe('undefined');
  });
});

describe('Testing Default Encoders: getUrl, setUrl', () => {
  let location;
  const mockUrl = 'https://example.com/a/random/path?q=3&randomQuery=[true,%20false]';
  const mockLocation = new URL(mockUrl);

  beforeEach(() => {
    location = window.location;
    delete window.location;
    window.location = mockLocation;
  });

  afterEach(() => {
    window.location = location;
  });

  test('getUrl should get the full url by default', () => {
    function TestReactComponent() {
      const url = getUrl();
      expect(url).toBe(mockUrl);
    }

    render(<TestReactComponent />);
  });

  test('setUrl should set the request configs to the url by default', () => {
    function TestReactComponent() {
      setUrl(testUrl);
      expect(window.location.href).toBe(testUrl);
    }

    render(<TestReactComponent />);
  });
});
