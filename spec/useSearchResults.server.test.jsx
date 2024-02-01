import useSearchResults from '../src/hooks/useSearchResults';
import { renderHookServerSideWithCioPlp } from './test-utils.server';

import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../src/utils/transformers';
import { DEMO_API_KEY } from '../src/constants';

describe('Testing Hook on the server: useSearchResults with initial search results', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw an error if used outside <CioPlp />', async () => {
    const initialSearchResponse = transformSearchResponse(mockSearchResponse);

    expect(() =>
      renderHookServerSideWithCioPlp(
        () => useSearchResults({ query: 'linen', initialSearchResponse }),
        {
          apiKey: DEMO_API_KEY,
        },
      ),
    ).not.toThrow();
  });

  it('Should not break if cioClient is null', async () => {
    const initialSearchResponse = transformSearchResponse(mockSearchResponse);

    expect(() =>
      renderHookServerSideWithCioPlp(
        () => useSearchResults({ query: 'linen', initialSearchResponse }),
        {
          apiKey: DEMO_API_KEY,
        },
      ),
    ).not.toThrow();
  });

  it('Should return a PlpSearchResponse Object when provided initialSearchResponse', async () => {
    const initialSearchResponse = transformSearchResponse(mockSearchResponse);

    const { result } = renderHookServerSideWithCioPlp(
      () => useSearchResults({ query: 'linen', initialSearchResponse }),
      {
        apiKey: DEMO_API_KEY,
      },
    );

    const {
      data: { response, rawApiResponse },
    } = result;

    expect(response?.resultId).not.toBeUndefined();
    expect(response?.totalNumResults).not.toBeUndefined();
    expect(response?.refinedContent).not.toBeUndefined();
    expect(response?.groups).not.toBeUndefined();
    expect(response?.results?.length).not.toBeUndefined();
    expect(response?.facets?.length).not.toBeUndefined();
    expect(response?.sortOptions?.length).not.toBeUndefined();
    expect(rawApiResponse).not.toBeUndefined();
  });
});

describe('Testing Hook on the server: useSearchResults with no initialSearchResponse', () => {
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
      renderHookServerSideWithCioPlp(() => useSearchResults({ query: '' }), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return null when called with no initialSearchResponse', async () => {
    const {
      result: {
        data: { response },
      },
    } = renderHookServerSideWithCioPlp(() => useSearchResults({ query: 'linen' }), {
      apiKey: DEMO_API_KEY,
    });

    expect(response).toBeNull();
  });
});