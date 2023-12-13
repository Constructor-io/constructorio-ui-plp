import { renderHook, waitFor } from '@testing-library/react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import useSearchResults from '../src/hooks/useSearchResults';
import mockResponse from './local_examples/apiResponse.json';
import { DEMO_API_KEY } from '../src/constants';

describe('Testing Hook: useSearchResults', () => {
  let clientGetSearchResultsSpy;
  let ConstructorIO;

  beforeEach(() => {
    ConstructorIO = new ConstructorIOClient({ apiKey: DEMO_API_KEY });
    clientGetSearchResultsSpy = jest.spyOn(ConstructorIO.search, 'getSearchResults');
    clientGetSearchResultsSpy.mockImplementationOnce(() => Promise.resolve(mockResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  test('Should return a PlpSearchResponse Object', async () => {
    const { result } = renderHook(
      () => useSearchResults('linen', { cioClient: ConstructorIO }),
      {},
    );

    await waitFor(() => {
      console.log('Test 1 - result.current:', result?.current);
      const response = result?.current;
      expect(response?.resultId).not.toBeUndefined();
      expect(response?.totalNumResults).not.toBeUndefined();
      expect(response?.refinedContent).not.toBeUndefined();
      expect(response?.groups).not.toBeUndefined();
      expect(response?.results?.length).not.toBeUndefined();
      expect(response?.facets?.length).not.toBeUndefined();
      expect(response?.sortOptions?.length).not.toBeUndefined();
      expect(response?.rawResponse).not.toBeUndefined();
    });
  });

  test('Should pass along parameters properly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const page = 2;
    const resultsPerPage = 100;
    renderHook(
      () =>
        useSearchResults('Linen', {
          cioClient: ConstructorIO,
          searchParams: { page, filters, resultsPerPage },
        }),
      {},
    );

    await waitFor(() => {
      console.log('Test 2 - Spy called with:', clientGetSearchResultsSpy.mock.calls); // Log spy calls

      expect(clientGetSearchResultsSpy).toHaveBeenCalledWith('Linen', {
        page,
        filters,
        resultsPerPage,
      });
    });
  });

  test('Should throw error if client is not available', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useSearchResults('item', {}), {})).toThrow();
    spy.mockRestore();
  });
});
