import useSearchResults from '../src/hooks/useSearchResults';
import { renderHookServerSide } from './test-utils.server';

import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../src/utils/transformers';

describe('Testing Hook on the server: useSearchResults with initial search results', () => {
  it('Should not break if cioClient is null', async () => {
    const initialSearchResults = transformSearchResponse(mockSearchResponse);

    expect(() =>
      renderHookServerSide(
        () => useSearchResults('linen', { cioClient: null }, initialSearchResults),
        {},
      ),
    ).not.toThrow();
  });

  it('Should return a PlpSearchResponse Object when provided initialSearchResults', async () => {
    const initialSearchResults = transformSearchResponse(mockSearchResponse);

    const { result } = renderHookServerSide(
      () => useSearchResults('linen', { cioClient: null }, initialSearchResults),
      {},
    );

    const response = result.searchResults;
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

describe('Testing Hook on the server: useSearchResults with no initialSearchResults', () => {
  it('Should not break if cioClient is null', async () => {
    expect(() =>
      renderHookServerSide(() => useSearchResults('', { cioClient: null }), {}),
    ).not.toThrow();
  });

  it('Should return null when called with no initialSearchResults', async () => {
    const { result } = renderHookServerSide(
      () => useSearchResults('linen', { cioClient: null }),
      {},
    );

    const response = result.searchResults;
    expect(response).toBeNull();
  });
});