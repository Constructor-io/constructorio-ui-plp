import useBrowseResults from '../../../src/hooks/useBrowseResults';
import { renderHookServerSideWithCioPlp } from '../../test-utils.server';
import { DEMO_API_KEY } from '../../../src/constants';
import mockBrowseResponse from '../../local_examples/apiBrowseResponse.json';
import { transformBrowseResponse } from '../../../src/utils/transformers';

describe('Testing Hook on the server: useBrowseResults with initial browse results', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw an error if used outside <CioPlp />', async () => {
    const initialSearchResponse = transformBrowseResponse(mockBrowseResponse);

    expect(() =>
      renderHookServerSideWithCioPlp(() => useBrowseResults({ initialSearchResponse }), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

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
    const { result } = renderHookServerSideWithCioPlp(
      () => useBrowseResults({ initialBrowseResponse: mockBrowseResponse }),
      {
        apiKey: DEMO_API_KEY,
      },
    );

    const {
      data: { response, rawApiResponse, resultId },
    } = result;

    expect(resultId).not.toBeUndefined();
    expect(response.totalNumResults).not.toBeUndefined();
    expect(response.refinedContent).not.toBeUndefined();
    expect(response.groups).not.toBeUndefined();
    expect(response.results?.length).not.toBeUndefined();
    expect(response.facets?.length).not.toBeUndefined();
    expect(response.sortOptions?.length).not.toBeUndefined();
    expect(rawApiResponse).not.toBeUndefined();
  });
});

describe('Testing Hook on the server: useBrowseResults with no initialBrowseResponse', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should not break if cioClient is null', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useBrowseResults(), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return null when called with no initialBrowseResponse', async () => {
    const {
      result: { data },
    } = renderHookServerSideWithCioPlp(() => useBrowseResults(), {
      apiKey: DEMO_API_KEY,
    });

    expect(data).toBeNull();
  });
});
