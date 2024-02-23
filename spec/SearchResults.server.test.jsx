import React from 'react';
import { renderToString } from 'react-dom/server';
import SearchResults from '../src/components/SearchResults';
import CioPlp from '../src/components/CioPlp';
import { DEMO_API_KEY } from '../src/constants';

jest.mock('../src/styles.css', () => ({}));
jest.mock('../src/hooks/useSearchResults');
jest.mock('../src/hooks/useRequestConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({ query: 'red' })),
}));

describe('SearchResults Component (Server-Side Rendering)', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => renderToString(<SearchResults />)).toThrow();
  });

  it('Should render loading state while fetching data', () => {
    const mockUseSearchResults = require('../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: 'fetching' });

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    expect(html).toContain('loading');
  });

  it('Should render title and search results when data is fetched', () => {
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

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults />
      </CioPlp>,
    );

    expect(html).toContain('Search Results');
    expect(html).toContain('Product 1');
    expect(html).toContain('Product 2');
  });
});
