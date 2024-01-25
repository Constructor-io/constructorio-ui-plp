import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useRequestConfigs from '../src/hooks/useRequestConfigs';
import { CioPlpContext } from '../src/PlpContext';
import testRequestState from './local_examples/sampleRequestState.json';
import testUrl from './local_examples/testJsonEncodedUrl.json';
import { DEMO_API_KEY } from '../src/constants';
import { getStateFromUrl as defaultGetStateFromUrl } from '../src/utils/encoders';
import { RequestConfigs } from '../src/types';

describe('Testing Hook: useRequestConfigs', () => {
  let location;
  const mockLocation = new URL('https://example.com/');

  beforeEach(() => {
    location = window.location;
    delete window.location;
    // @ts-ignore
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/';
  });

  afterEach(() => {
    window.location = location;
  });

  it('Should throw error if called outside of PlpContext', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useRequestConfigs())).toThrow();
    spy.mockRestore();
  });

  it('Should return an empty object if no defaults have been specified', () => {
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

  it('Should return configurations set as defaults at Plp Context', () => {
    window.location.href = 'https://example.com/group_id/Styles';
    function TestReactComponent() {
      const requestConfigs = useRequestConfigs();
      expect(requestConfigs).toEqual(testRequestState);
      return <div>hello</div>;
    }

    render(
      <CioPlpContext
        apiKey={DEMO_API_KEY}
        defaultRequestConfigs={testRequestState as RequestConfigs}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  it('Should return configurations set in the URL path/query parameters', () => {
    function TestReactComponent() {
      window.location.href = testUrl;
      const requestConfigs = useRequestConfigs();
      const { fmtOptions, qsParam, preFilterExpression, variationsMap, ...sampleRequestState } =
        testRequestState;

      sampleRequestState.filterName = 'group_id';
      sampleRequestState.filterValue = 'Styles';

      expect(requestConfigs).toEqual(sampleRequestState);

      return <div>hello</div>;
    }

    render(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  it('Should return merged configurations with the URL query parameters taking priority', () => {
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
      <CioPlpContext
        apiKey={DEMO_API_KEY}
        defaultRequestConfigs={testRequestState as RequestConfigs}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });

  test('Should use custom encoders if set', () => {
    const customUrlGetter = () => 'https://www.example.com/water/fall?page=7';

    const customGetStateFromUrl = (urlString: string) => {
      const stateFromUrl = defaultGetStateFromUrl(urlString);

      stateFromUrl.filterName = 'collection_id';
      stateFromUrl.filterValue = 'testing-collection-id';

      return stateFromUrl;
    };

    function TestReactComponent() {
      window.location.href = 'https://www.example.com/water/fall?q=fire&page=2';
      const decodedRequestState = useRequestConfigs();

      expect(typeof decodedRequestState).toBe('object');
      expect(decodedRequestState.page).toBe(7);
      expect(decodedRequestState.query).toBeUndefined();
      expect(decodedRequestState.filterName).toBe('collection_id');
      expect(decodedRequestState.filterValue).toBe('testing-collection-id');
      return <div>hello</div>;
    }

    render(
      <CioPlpContext
        apiKey={DEMO_API_KEY}
        encoders={{
          getUrl: customUrlGetter,
          getStateFromUrl: customGetStateFromUrl,
        }}>
        <TestReactComponent />
      </CioPlpContext>,
    );
  });
});
