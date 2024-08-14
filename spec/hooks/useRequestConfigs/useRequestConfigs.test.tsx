import React from 'react';
import { render, renderHook } from '@testing-library/react';
import useRequestConfigs from '../../../src/hooks/useRequestConfigs';
import CioPlpProvider from '../../../src/components/CioPlp/CioPlpProvider';
import testRequestState from '../../local_examples/sampleRequestState.json';
import testUrl from '../../local_examples/testJsonEncodedUrl.json';
import { DEMO_API_KEY } from '../../../src/constants';
import { getStateFromUrl as defaultGetStateFromUrl } from '../../../src/utils/urlHelpers';
import { RequestConfigs } from '../../../src/types';

const originalWindowLocation = window.location;

describe('Testing Hook: useRequestConfigs', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
  });

  it('Should throw error if called outside of PlpContext', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useRequestConfigs())).toThrow();
    spy.mockRestore();
  });

  it('Should return an object with page only if no defaults have been specified', () => {
    function TestReactComponent() {
      const { requestConfigs, setRequestConfigs } = useRequestConfigs();
      expect(requestConfigs).toEqual({ page: 1 });
      expect(typeof setRequestConfigs).toEqual('function');
      return <div>test</div>;
    }

    render(
      <CioPlpProvider apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });

  it('Should return configurations set as defaults at Plp Context', () => {
    window.location.href = 'https://example.com/group_id/Styles';
    function TestReactComponent() {
      const { requestConfigs } = useRequestConfigs();
      expect(requestConfigs).toEqual(testRequestState);
      return <div>test</div>;
    }

    render(
      <CioPlpProvider
        apiKey={DEMO_API_KEY}
        staticRequestConfigs={testRequestState as RequestConfigs}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });

  it('Should return configurations set in the URL path/query parameters', () => {
    function TestReactComponent() {
      window.location.href = testUrl;
      const { requestConfigs } = useRequestConfigs();
      const { fmtOptions, qsParam, preFilterExpression, variationsMap, ...sampleRequestState } =
        testRequestState;

      sampleRequestState.filterName = 'group_id';
      sampleRequestState.filterValue = 'Styles';

      expect(requestConfigs).toEqual(sampleRequestState);

      return <div>test</div>;
    }

    render(
      <CioPlpProvider apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });

  it('Should return merged configurations with the URL query parameters taking priority', () => {
    function TestReactComponent() {
      window.location.href = 'https://www.example.com/water/fall?q=fire&page=2';
      const { requestConfigs } = useRequestConfigs();
      const decodedRequestState = testRequestState;
      decodedRequestState.page = 2;
      decodedRequestState.query = 'fire';
      decodedRequestState.filterName = 'group_id';
      decodedRequestState.filterValue = 'fall';
      expect(requestConfigs).toEqual(decodedRequestState);
      return <div>test</div>;
    }

    render(
      <CioPlpProvider
        apiKey={DEMO_API_KEY}
        staticRequestConfigs={testRequestState as RequestConfigs}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });

  test('Should use custom urlHelpers if set', () => {
    const customUrlGetter = () => 'https://www.example.com/water/fall?page=7';

    const customGetStateFromUrl = (urlString: string) => {
      const stateFromUrl = defaultGetStateFromUrl(urlString);

      stateFromUrl.filterName = 'collection_id';
      stateFromUrl.filterValue = 'testing-collection-id';

      return stateFromUrl;
    };

    function TestReactComponent() {
      window.location.href = 'https://www.example.com/water/fall?q=fire&page=2';
      const { requestConfigs: decodedRequestState } = useRequestConfigs();

      expect(typeof decodedRequestState).toBe('object');
      expect(decodedRequestState.page).toBe(7);
      expect(decodedRequestState.query).toBeUndefined();
      expect(decodedRequestState.filterName).toBe('collection_id');
      expect(decodedRequestState.filterValue).toBe('testing-collection-id');
      return <div>test</div>;
    }

    render(
      <CioPlpProvider
        apiKey={DEMO_API_KEY}
        urlHelpers={{
          getUrl: customUrlGetter,
          getStateFromUrl: customGetStateFromUrl,
        }}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });

  test('Using setRequestConfigs should work', () => {
    function TestReactComponent() {
      window.location.href = 'https://www.example.com/search?q=item&page=3';
      const { setRequestConfigs } = useRequestConfigs();

      const oldUrlObj = new URL(window.location.href);
      setRequestConfigs({ page: 12 });
      const newUrlObj = new URL(window.location.href);

      expect(newUrlObj.searchParams.get('page')).toEqual('12');

      // Check the remaining query parameters are the same
      expect(newUrlObj.searchParams.get('q')).toEqual(oldUrlObj.searchParams.get('q'));

      return <div>test</div>;
    }

    render(
      <CioPlpProvider apiKey={DEMO_API_KEY}>
        <TestReactComponent />
      </CioPlpProvider>,
    );
  });
});
