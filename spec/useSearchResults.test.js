import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useSearchResults from '../src/hooks/useSearchResults';
import { mockConstructorIOClient, renderHookWithCioPlp } from './test-utils';
import { getUrlFromState } from '../src/utils/urlHelpers';

describe('Testing Hook: useSearchResults', () => {
  let location;
  const mockLocation = new URL('https://example.com/');

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    location = window.location;
    delete window.location;
    // @ts-ignore
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/search?q=Linen';
  });

  afterEach(() => {
    window.location = location;
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should return a PlpSearchResponse Object', async () => {
    const { result } = renderHookWithCioPlp(() => useSearchResults());

    await waitFor(() => {
      const { current } = result;
      const {
        data: { response, rawApiResponse, request },
      } = current;

      expect(response?.resultId).not.toBeUndefined();
      expect(response?.totalNumResults).not.toBeUndefined();
      expect(response?.refinedContent).not.toBeUndefined();
      expect(response?.groups).not.toBeUndefined();
      expect(response?.results?.length).not.toBeUndefined();
      expect(response?.facets?.length).not.toBeUndefined();
      expect(response?.sortOptions?.length).not.toBeUndefined();
      expect(rawApiResponse).not.toBeUndefined();
      expect(request).not.toBeUndefined();
    });
  });

  it('Should receive parameters from useRequestConfigs correctly', async () => {
    const query = 'Linen';
    const filters = { Color: ['Phantom Ink'] };
    const resultsPerPage = 100;
    const page = 1;
    const url = getUrlFromState(
      { query, filters, resultsPerPage, page },
      { baseUrl: 'https://example.com/search' },
    );

    mockLocation.href = url;

    renderHookWithCioPlp(() => useSearchResults());

    await waitFor(() => {
      expect(mockConstructorIOClient.search.getSearchResults).toHaveBeenCalledWith('Linen', {
        filters,
        resultsPerPage,
        page: 1,
      });
    });
  });

  it('Should throw error if client is not available', () => {
    expect(() => renderHook(() => useSearchResults())).toThrow();
  });
});
