import { renderHook, waitFor } from '@testing-library/react';
import { renderHookWithCioPlp, mockConstructorIOClient } from '../../test-utils';
import mockBrowseResponse from '../../local_examples/apiBrowseResponse.json';
import useBrowseResults from '../../../src/hooks/useBrowseResults';
import { getUrlFromState } from '../../../src/utils/urlHelpers';
import { transformBrowseResponse } from '../../../src/utils/transformers';

describe('Testing Hook: useBrowseResults', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/browse/123';
  const mockLocation = new URL(mockUrl);

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: mockLocation,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.restoreAllMocks(); // This will reset all mocks after each test
    jest.clearAllMocks();
  });

  test('Should return a PlpBrowseResponse Object', async () => {
    const { result } = renderHookWithCioPlp(() => useBrowseResults());

    await waitFor(() => {
      const response = result?.current.browseResults;

      expect(response?.resultId).not.toBeUndefined();
      expect(response?.response?.totalNumResults).not.toBeUndefined();
      expect(response?.response?.refinedContent).not.toBeUndefined();
      expect(response?.response?.groups).not.toBeUndefined();
      expect(response?.response?.results?.length).not.toBeUndefined();
      expect(response?.response?.facets?.length).not.toBeUndefined();
      expect(response?.response?.sortOptions?.length).not.toBeUndefined();
      expect(response?.rawApiResponse).not.toBeUndefined();
    });
  });

  it('Should not fetch results on first render with initialBrowseResponse', async () => {
    const initialBrowseResponse = transformBrowseResponse(mockBrowseResponse);

    renderHookWithCioPlp(() => useBrowseResults({ initialBrowseResponse }));

    await waitFor(() => {
      expect(mockConstructorIOClient.browse.getBrowseResults).not.toHaveBeenCalled();
    });
  });

  test('Should receive parameters from useRequestConfigs correctly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const page = 2;
    const resultsPerPage = 100;

    const url = getUrlFromState(
      { filterValue: '123', filters, resultsPerPage, page },
      { baseUrl: 'https://example.com/browse/123' },
    );

    window.location.href = url;

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
