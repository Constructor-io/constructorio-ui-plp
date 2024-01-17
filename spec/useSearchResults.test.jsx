import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useSearchResults from '../src/hooks/useSearchResults';
import {
  mockConstructorIOClient,
  renderHookWithCioPlpApiKey,
  renderHookWithCioPlpCioClient,
} from './test-utils';

describe('Testing Hook: useSearchResults', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should return a PlpSearchResponse Object', async () => {
    const { result } = renderHookWithCioPlpApiKey(() =>
      useSearchResults({ query: 'linen', configs: {} }),
    );

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

  it('Should pass along parameters properly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const resultsPerPage = 100;
    renderHookWithCioPlpCioClient(() =>
      useSearchResults({
        query: 'Linen',
        searchParams: { filters, resultsPerPage, page: 1 },
      }),
    );

    await waitFor(() => {
      expect(mockConstructorIOClient.search.getSearchResults).toHaveBeenCalledWith('Linen', {
        filters,
        resultsPerPage,
        page: 1,
      });
    });
  });

  it('Should throw error if client is not available', () => {
    expect(() => renderHook(() => useSearchResults({ query: 'item' }))).toThrow();
  });
});
