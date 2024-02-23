import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SearchResults from '../src/components/SearchResults';
import CioPlp from '../src/components/CioPlp';
import { DEMO_API_KEY } from '../src/constants';
import '@testing-library/jest-dom';

jest.mock('../src/styles.css', () => ({}));
jest.mock('../src/hooks/useSearchResults');
jest.mock('../src/hooks/useRequestConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({ query: 'red' })),
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

  it('Should render loading state while fetching data', async () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: 'fetching' });

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(getByText('loading')).toBeInTheDocument());
  });

  it('Should render title and search results when data is fetched', async () => {
    const mockData = {
      response: {
        results: [
          { itemId: '1', itemName: 'Product 1', data: { price: 100 }, price: 100 },
          { itemId: '2', itemName: 'Product 2', data: { price: 100 }, price: 100 },
        ],
      },
    };
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: 'success', data: mockData });

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    await waitFor(() => expect(getByText('Search Results')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Product 2')).toBeInTheDocument());
  });
});
