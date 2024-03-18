import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { renderHook, waitFor } from '@testing-library/react';
import { renderHookWithCioPlp, mockConstructorIOClient, delay } from './test-utils';
import mockBrowseResponse from './local_examples/apiBrowseResponse.json';
import { DEMO_API_KEY } from '../src/constants';
import useBrowseResults from '../src/hooks/useBrowseResults';
import { getUrlFromState } from '../src/utils/urlHelpers';
import { transformBrowseResponse } from '../src/utils/transformers';

describe('Testing Hook: useBrowseResults', () => {
  let clientGetBrowseResultsSpy;
  let ConstructorIO;
  let location;
  const mockLocation = new URL('https://example.com/');

  beforeEach(() => {
    ConstructorIO = new ConstructorIOClient({ apiKey: DEMO_API_KEY });
    clientGetBrowseResultsSpy = jest.spyOn(ConstructorIO.browse, 'getBrowseResults');
    clientGetBrowseResultsSpy.mockImplementationOnce(() => Promise.resolve(mockBrowseResponse));

    location = window.location;
    delete window.location;
    // @ts-ignore
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/browse/123';
  });

  afterEach(() => {
    window.location = location;
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  test('Should return a PlpBrowseResponse Object', async () => {
    const { result } = renderHookWithCioPlp(() => useBrowseResults());

    await waitFor(() => {
      const response = result?.current.browseResults;

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

  it('Should not fetch results on first render with initialBrowseResponse', async () => {
    const initialBrowseResults = transformBrowseResponse(mockBrowseResponse);

    renderHookWithCioPlp(() =>
      useBrowseResults('group_id', '123', { cioClient: ConstructorIO }, initialBrowseResults),
    );

    // wait 200 ms for code to execute
    await delay(200);

    expect(clientGetBrowseResultsSpy).not.toHaveBeenCalled();
  });

  test('Should receive parameters from useRequestConfigs correctly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const page = 2;
    const resultsPerPage = 100;

    const url = getUrlFromState(
      { filterValue: '123', filters, resultsPerPage, page },
      { baseUrl: 'https://example.com/browse/' },
    );
    mockLocation.href = url;

    renderHookWithCioPlp(() => useBrowseResults());

    await waitFor(() => {
      expect(mockConstructorIOClient.browse.getBrowseResults).toHaveBeenCalledWith(
        'group_id',
        '123',
        {
          page,
          filters,
          resultsPerPage,
        },
      );
    });
  });

  test('Should throw error if used outside Context Provider', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useBrowseResults())).toThrow();
    spy.mockRestore();
  });
});
