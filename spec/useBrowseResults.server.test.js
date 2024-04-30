import useBrowseResults from '../src/hooks/useBrowseResults';
import { renderHookServerSideWithCioPlp } from './test-utils.server';
import { DEMO_API_KEY } from '../src/constants';
import mockBrowseResponse from './local_examples/apiBrowseResponse.json';
import { transformBrowseResponse } from '../src/utils/transformers';

describe('Testing Hook on the server: useBrowseResults with initial browse results', () => {
  it('Should not break if cioClient is null', async () => {
    const initialBrowseResponse = transformBrowseResponse(mockBrowseResponse);

    expect(() =>
      renderHookServerSideWithCioPlp(
        () =>
          useBrowseResults({
            initialBrowseResponse,
          }),
        {
          apiKey: DEMO_API_KEY,
        },
      ),
    ).not.toThrow();
  });

  it('Should return a PlpBrowseResponse Object when provided initialBrowseResponse', async () => {
    const initialBrowseResponse = transformBrowseResponse(mockBrowseResponse);

    const { result } = renderHookServerSideWithCioPlp(
      () => useBrowseResults({ initialBrowseResponse }),
      {
        apiKey: DEMO_API_KEY,
      },
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

describe('Testing Hook on the server: useBrowseResults with no initialBrowseResponse', () => {
  it('Should not break if cioClient is null', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useBrowseResults(), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return null when called with no initialBrowseResponse', async () => {
    const { result } = renderHookServerSideWithCioPlp(() => useBrowseResults(), {
      apiKey: DEMO_API_KEY,
    });

    const response = result.browseResults;
    expect(response).toBeNull();
  });
});
