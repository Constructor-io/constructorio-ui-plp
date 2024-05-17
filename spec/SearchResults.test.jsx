import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SearchResults from '../src/components/SearchResults';
import CioPlp from '../src/components/CioPlp';
import { DEMO_API_KEY } from '../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../src/utils/transformers';
import mockSearchResponse from './local_examples/apiSearchResponse.json';

jest.mock('../src/styles.css', () => ({}));
jest.mock('../src/hooks/useSearchResults');
jest.mock('../src/hooks/useRequestConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({ requestConfigs: { query: 'red' } })),
}));

describe('Testing Component: SearchResults', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<SearchResults />)).toThrow();
  });

  it('Should render spinner while fetching data', async () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: 'fetching' });

    const { getByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(getByTestId('cio-spinner')).toBeInTheDocument());
  });

  it('Should not render spinner if data has been fetched', async () => {
    const mockData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: 'success',
      data: { response: { ...mockData } },
    });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render spinner if there has been an error while fetching data', async () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: 'error',
      data: {
        response: null,
      },
    });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if there has been an error while fetching data', async () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: 'error',
      data: {
        response: null,
      },
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if data has been fetched', async () => {
    const mockData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: 'success',
      data: { response: { ...mockData } },
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should render custom spinner while fetching data if provided', async () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: 'fetching' });

    const { getByText, queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(getByText('spinner')).toBeInTheDocument();
      expect(queryByTestId('cio-spinner')).toBeFalsy();
    });
  });

  it('Should render title and search results when data is fetched', async () => {
    const mockData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: 'success',
      data: { response: { ...mockData } },
    });

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(getByText('Search Results')).toBeInTheDocument());
    await waitFor(() => expect(getByText(mockData.results[0].itemName)).toBeInTheDocument());
  });

  it('Should render title and search results when when provided initialSearchResponse', async () => {
    const initialSearchResponse = transformSearchResponse(mockSearchResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults initialSearchResponse={initialSearchResponse} />
      </CioPlp>,
    );

    await waitFor(() => expect(getByText('Search Results')).toBeInTheDocument());
    await waitFor(() =>
      expect(getByText(initialSearchResponse.results[0].itemName)).toBeInTheDocument(),
    );
  });
});
