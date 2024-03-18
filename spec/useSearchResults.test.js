import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useSearchResults from '../src/hooks/useSearchResults';
import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { delay, mockConstructorIOClient, renderHookWithCioPlp } from './test-utils';
import { transformSearchResponse } from '../src/utils/transformers';

describe('Testing Hook: useSearchResults', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
    jest.clearAllMocks();
  });

  it('Should return a PlpSearchResponse Object', async () => {
    const { result } = renderHookWithCioPlp(() => useSearchResults({ query: 'linen' }));

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

  it('Should not fetch results on first render with initialSearchResponse', async () => {
    const initialSearchResponse = transformSearchResponse(mockSearchResponse);

    renderHookWithCioPlp(() =>
      useSearchResults({
        query: 'Linen',
        searchParams: { page: 1 },
        initialSearchResponse,
      }),
    );

    // wait 200 ms for code to execute
    await delay(200);

    expect(mockConstructorIOClient.search.getSearchResults).not.toHaveBeenCalled();
  });

  it('Should pass along parameters properly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const resultsPerPage = 100;
    renderHookWithCioPlp(() =>
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
