import { renderHook, waitFor } from '@testing-library/react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import useSearchResults from '../src/hooks/useSearchResults';
import mockResponse from './local_examples/apiResponse.json';
import { DEMO_API_KEY } from '../src/constants';

jest.setTimeout(10000); // Set timeout to 10000 ms (10 seconds)

describe('Testing Hook: useSearchResults', () => {
  test('Should return a PlpSearchResponse Object', async () => {
    const ConstructorIO = new ConstructorIOClient({ apiKey: DEMO_API_KEY });
    const clientGetSearchResultsSpy = jest.spyOn(ConstructorIO.search, 'getSearchResults');
    clientGetSearchResultsSpy.mockImplementationOnce(() => Promise.resolve(mockResponse));

    const { result } = renderHook(
      () => useSearchResults('linen', { cioClient: ConstructorIO }),
      {},
    );

    await waitFor(
      () => {
        const response = result?.current;
        expect(response?.resultId).not.toBeUndefined();
        expect(response?.totalNumResults).not.toBeUndefined();
        expect(response?.refinedContent).not.toBeUndefined();
        expect(response?.groups).not.toBeUndefined();
        expect(response?.results?.length).not.toBeUndefined();
        expect(response?.facets?.length).not.toBeUndefined();
        expect(response?.sortOptions?.length).not.toBeUndefined();
        expect(response?.rawResponse).not.toBeUndefined();
      },
      { timeout: 10000 },
    );
  });

  test('Should pass along parameters properly', async () => {
    const ConstructorIO = new ConstructorIOClient({ apiKey: DEMO_API_KEY });
    const clientGetSearchResultsSpy = jest.spyOn(ConstructorIO.search, 'getSearchResults');
    clientGetSearchResultsSpy.mockImplementationOnce(() => Promise.resolve(mockResponse));
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

    await waitFor(
      () => {
        expect(clientGetSearchResultsSpy).toHaveBeenCalledWith('Linen', {
          page,
          filters,
          resultsPerPage,
        });
      },
      { timeout: 10000 },
    );
  });

  test('Should throw error if client is not available', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useSearchResults('item', {}), {})).toThrow();
    spy.mockRestore();
  });
});
