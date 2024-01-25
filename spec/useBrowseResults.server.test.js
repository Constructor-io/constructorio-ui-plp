import useBrowseResults from '../src/hooks/useBrowseResults';
import { renderHookServerSide } from './test-utils.server';

import mockBrowseResponse from './local_examples/apiBrowseResponse.json';
import { transformBrowseResponse } from '../src/utils/transformers';

describe('Testing Hook on the server: useBrowseResults with initial browse results', () => {
  it('Should throw error if no filterValue or filterName required', async () => {
    expect(() =>
      renderHookServerSide(() => useBrowseResults('', '', { cioClient: null }), {}),
    ).toThrow('filterName and filterValue are required');

    expect(() =>
      renderHookServerSide(() => useBrowseResults('filter_name', '', { cioClient: null }), {}),
    ).toThrow('filterName and filterValue are required');

    expect(() =>
      renderHookServerSide(() => useBrowseResults('', 'filter_value', { cioClient: null }), {}),
    ).toThrow('filterName and filterValue are required');
  });

  it('Should not break if cioClient is null', async () => {
    const initialBrowseResults = transformBrowseResponse(mockBrowseResponse);

    expect(() =>
      renderHookServerSide(
        () =>
          useBrowseResults(
            'filter_value',
            'filter_name',
            { cioClient: null },
            initialBrowseResults,
          ),
        {},
      ),
    ).not.toThrow();
  });

  it('Should return a PlpBrowseResponse Object when provided initialBrowseResults', async () => {
    const initialBrowseResults = transformBrowseResponse(mockBrowseResponse);

    const { result } = renderHookServerSide(
      () =>
        useBrowseResults('filter_value', 'filter_name', { cioClient: null }, initialBrowseResults),
      {},
    );

    const response = result.browseResults;
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

describe('Testing Hook on the server: useBrowseResults with no initialBrowseResults', () => {
  it('Should not break if cioClient is null', async () => {
    expect(() =>
      renderHookServerSide(
        () => useBrowseResults('filter_value', 'filter_name', { cioClient: null }),
        {},
      ),
    ).not.toThrow();
  });

  it('Should return null when called with no initialBrowseResults', async () => {
    const { result } = renderHookServerSide(
      () => useBrowseResults('filter_value', 'filter_name', { cioClient: null }),
      {},
    );

    const response = result.browseResults;
    expect(response).toBeNull();
  });
});
