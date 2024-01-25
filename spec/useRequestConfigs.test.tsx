import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useRequestConfigs from '../src/hooks/useRequestConfigs';
import { CioPlpContext } from '../src/PlpContext';
import testRequestState from './local_examples/sampleRequestState.json';
import testUrl from './local_examples/testJsonEncodedUrl.json';
import { DEMO_API_KEY } from '../src/constants';

describe('Testing Hook: useRequestConfigs', () => {
  let location;
  const mockLocation = new URL('https://example.com');

  beforeEach(() => {
    location = window.location;
    delete window.location;
    window.location = mockLocation;
  });

  afterEach(() => {
    window.location = location;
  });

  test('Should throw error if called outside of PlpContext', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useRequestConfigs())).toThrow();
    spy.mockRestore();
  });

  test('Should return an empty object if no defaults have been specified', () => {
    function TestReactComponent() {
      const requestConfigs = useRequestConfigs();
      expect(requestConfigs).toEqual({});
      return <div>hello</div>;
    }

    render(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  test('Should return configurations set as defaults at Plp Context', () => {
    function TestReactComponent() {
      const requestConfigs = useRequestConfigs();
      expect(requestConfigs).toEqual(testRequestState);
      return <div>hello</div>;
    }

    render(
      <CioPlpContext apiKey={DEMO_API_KEY} defaultRequestConfigs={testRequestState}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  test('Should return configurations set in the URL path/query parameters', () => {
    function TestReactComponent() {
      window.location.href = testUrl;
      const requestConfigs = useRequestConfigs();
      const { fmtOptions, qsParam, preFilterExpression, variationsMap, ...sampleRequestState } =
        testRequestState;

      sampleRequestState.filterName = 'group_id';
      sampleRequestState.filterValue = 'path';

      expect(requestConfigs).toEqual(sampleRequestState);

      return <div>hello</div>;
    }

    render(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  test('Should return merged configurations with the URL query parameters taking priority', () => {
    function TestReactComponent() {
      window.location.href = 'https://www.example.com/water/fall?q=fire&page=2';
      const requestConfigs = useRequestConfigs();
      const decodedRequestState = testRequestState;
      decodedRequestState.page = 2;
      decodedRequestState.query = 'fire';
      decodedRequestState.filterName = 'group_id';
      decodedRequestState.filterValue = 'fall';

      expect(requestConfigs).toEqual(decodedRequestState);
      return <div>hello</div>;
    }

    render(
      <CioPlpContext apiKey={DEMO_API_KEY} defaultRequestConfigs={testRequestState}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  test('Should use custom encoders if set', () => {
    const customNotActuallyAUrlGetter = () => ({
      customPassByField: 'earth',
    });

    const customDecoder = (notActuallyAUrl) => ({
      query: 'water',
      page: 7,
      customField: 'fire',
      customPassByField: notActuallyAUrl.customPassByField,
    });

    const customGetBrowseStateFromPath = () => ({
      filterName: 'collection_id',
      filterValue: 'my-random-collection',
    });

    function TestReactComponent() {
      window.location.href = 'https://www.example.com/water/fall?q=fire&page=2';
      const decodedRequestState = useRequestConfigs();

      expect(typeof decodedRequestState).toBe('object');
      expect(decodedRequestState.page).toBe(7);
      expect(decodedRequestState.query).toBe('water');
      expect(decodedRequestState.customField).toBe('fire');
      expect(decodedRequestState.customPassByField).toBe('earth');
      return <div>hello</div>;
    }

    render(
      <CioPlpContext
        apiKey={DEMO_API_KEY}
        defaultRequestConfigs={testRequestState}
        encoders={{
          getUrl: customNotActuallyAUrlGetter,
          decodeStateFromUrlQueryParams: customDecoder,
          getBrowseStateFromPath: customGetBrowseStateFromPath,
        }}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });
});
