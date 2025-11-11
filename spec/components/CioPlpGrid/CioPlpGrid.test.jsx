/* eslint-disable max-classes-per-file */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CioPlpGrid, { RequestStatus } from '../../../src/components/CioPlpGrid';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import mockApiSearchResponse from '../../local_examples/apiSearchResponse.json';
import mockApiBrowseResponse from '../../local_examples/apiBrowseResponse.json';
import { transformBrowseResponse, transformSearchResponse } from '../../../src/utils';
import useCioPlp from '../../../src/hooks/useCioPlp';
import useRequestConfigs from '../../../src/hooks/useRequestConfigs';
import { getAttribute } from '../../test-utils';

const actualUseCioPlp = jest.requireActual('../../../src/hooks/useCioPlp').default;
const actualUseRequestConfigs = jest.requireActual('../../../src/hooks/useRequestConfigs').default;

jest.mock('../../../src/hooks/useCioPlp');
jest.mock('../../../src/hooks/useRequestConfigs');
jest.mock('@constructor-io/constructorio-client-javascript/lib/modules/search.js', () => {
  const Search = class {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
    constructor() {}

    getSearchResults = jest.fn().mockImplementation((searchQuery) => {
      if (searchQuery === 'test zero results') {
        return {
          response: { results: [], total_num_results: 0, groups: [], facets: [], sort_options: [] },
          result_id: 'test-zero-results',
          request: {},
        };
      }

      return mockApiSearchResponse;
    });
  };

  return Search;
});

jest.mock('@constructor-io/constructorio-client-javascript/lib/modules/browse.js', () => {
  const Browse = class {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
    constructor() {}

    getBrowseResults = jest.fn().mockResolvedValue(mockApiBrowseResponse);
  };

  return Browse;
});

const originalWindowLocation = window.location;

describe('Testing Component: CioPlpGrid', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });

    useCioPlp.mockImplementation(actualUseCioPlp);
    useRequestConfigs.mockImplementation(actualUseRequestConfigs);
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.restoreAllMocks();
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<CioPlpGrid />)).toThrow();
  });

  it('Should render spinner while fetching data', async () => {
    useCioPlp.mockReturnValue({ status: RequestStatus.FETCHING, isSearchPage: true });

    const { getByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(getByTestId('cio-spinner')).toBeInTheDocument());
  });

  it('Should not render spinner if data has been fetched', async () => {
    useCioPlp.mockReturnValue({ status: RequestStatus.SUCCESS, isSearchPage: true });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render spinner if there has been an error while fetching data', async () => {
    useCioPlp.mockReturnValue({
      status: RequestStatus.ERROR,
      data: null,
    });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if there has been an error while fetching data', async () => {
    useCioPlp.mockReturnValue({
      status: RequestStatus.ERROR,
      data: null,
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if data has been fetched', async () => {
    useCioPlp.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: { response: {} },
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should render custom spinner while fetching data if provided', async () => {
    useCioPlp.mockReturnValue({ status: RequestStatus.FETCHING, isSearchPage: true });

    const { getByText, queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(getByText('spinner')).toBeInTheDocument();
      expect(queryByTestId('cio-spinner')).toBeFalsy();
    });
  });

  it('Should render results when data is fetched for Search', async () => {
    useRequestConfigs.mockImplementation(() => ({
      getRequestConfigs: () => ({ query: 'shoes' }),
      setRequestConfigs: jest.fn(),
    }));

    const mockSearchData = transformSearchResponse(mockApiSearchResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() =>
      expect(getByText(mockSearchData.response.results[0].itemName)).toBeInTheDocument(),
    );
  });

  it('Should render results when data is fetched for Browse', async () => {
    useRequestConfigs.mockImplementation(() => ({
      getRequestConfigs: () => ({ filterName: 'group_id', filterValue: '1030' }),
      setRequestConfigs: jest.fn(),
    }));

    const mockBrowseData = transformBrowseResponse(mockApiBrowseResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(getByText(mockBrowseData.response.results[0].itemName)).toBeInTheDocument();
    });
  });

  it('Should render redirect data when a search redirect response is received', async () => {
    // Mock redirect data
    const mockRedirectData = {
      redirect: {
        data: {
          url: 'https://example.com/redirect-url',
        },
      },
    };

    const mockOnRedirect = jest.fn();
    jest.spyOn(require('../../../src/hooks/useCioPlpContext'), 'useCioPlpContext').mockReturnValue({
      callbacks: {
        onRedirect: mockOnRedirect,
      },
    });

    useCioPlp.mockReturnValue({
      status: RequestStatus.SUCCESS,
      isSearchPage: true,
      data: mockRedirectData,
    });

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(mockOnRedirect).toHaveBeenCalledWith('https://example.com/redirect-url');
    });
  });

  it('Should render results with data attributes when data is fetched for Browse', async () => {
    useRequestConfigs.mockImplementation(() => ({
      getRequestConfigs: () => ({ filterName: 'group_id', filterValue: '1030' }),
      setRequestConfigs: jest.fn(),
    }));

    const mockBrowseData = transformBrowseResponse(mockApiBrowseResponse);

    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => {
      const getAttributeFromContainer = getAttribute(container);
      const totalNumResults = getAttributeFromContainer('data-cnstrc-num-results');
      const filterName = getAttributeFromContainer('data-cnstrc-filter-name');
      const filterValue = getAttributeFromContainer('data-cnstrc-filter-value');
      const resultId = getAttributeFromContainer('data-cnstrc-result-id');

      expect(container.querySelector('[data-cnstrc-browse]')).toBeInTheDocument();
      expect(totalNumResults).toEqual(String(mockBrowseData.response.totalNumResults));
      expect(filterName).toEqual(String(mockBrowseData.request.browse_filter_name));
      expect(filterValue).toEqual(String(mockBrowseData.request.browse_filter_value));
      expect(resultId).toEqual(String(mockBrowseData.resultId));
    });
  });

  it('Should render results when provided with initialSearchResponse', async () => {
    const mockSearchData = transformSearchResponse(mockApiSearchResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid initialSearchResponse={mockApiSearchResponse} />
      </CioPlp>,
    );

    await waitFor(() =>
      expect(getByText(mockSearchData.response.results[0].itemName)).toBeInTheDocument(),
    );
  });

  it('Should render results when provided with initialBrowseResponse', async () => {
    const mockBrowseData = transformBrowseResponse(mockApiBrowseResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid initialBrowseResponse={mockApiBrowseResponse} />
      </CioPlp>,
    );

    await waitFor(() =>
      expect(getByText(mockBrowseData.response.results[0].itemName)).toBeInTheDocument(),
    );
  });

  it('Should include Search cnstrc beacon data attributes when data is fetched with results returned', async () => {
    useRequestConfigs.mockImplementation(() => ({
      getRequestConfigs: () => ({ query: 'shoes' }),
      setRequestConfigs: jest.fn(),
    }));

    const mockSearchData = transformSearchResponse(mockApiSearchResponse);

    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(container.querySelector('[data-cnstrc-search]')).toBeInTheDocument();
      expect(
        container
          .querySelector('[data-cnstrc-num-results]')
          .getAttribute('data-cnstrc-num-results'),
      ).toEqual(String(mockSearchData.response.totalNumResults));
      expect(
        container.querySelector('[data-cnstrc-result-id]').getAttribute('data-cnstrc-result-id'),
      ).toEqual(String(mockSearchData.resultId));
    });
  });

  it('Should include Search cnstrc beacon data attributes when data is fetched with zero results returned', async () => {
    useRequestConfigs.mockImplementation(() => ({
      getRequestConfigs: () => ({ query: 'test zero results' }),
      setRequestConfigs: jest.fn(),
    }));

    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(container.querySelector('.cio-zero-results-header')).toBeInTheDocument();
      expect(container.querySelector('[data-cnstrc-search]')).toBeInTheDocument();
      expect(
        container
          .querySelector('[data-cnstrc-num-results]')
          .getAttribute('data-cnstrc-num-results'),
      ).toEqual('0');
      expect(
        container.querySelector('[data-cnstrc-result-id]').getAttribute('data-cnstrc-result-id'),
      ).toEqual('test-zero-results');
      expect(container.querySelector('[data-cnstrc-zero-result]')).toBeInTheDocument();
      expect(
        container
          .querySelector('[data-cnstrc-zero-result]')
          .getAttribute('data-cnstrc-zero-result'),
      ).toBe('true');
    });
  });
});
