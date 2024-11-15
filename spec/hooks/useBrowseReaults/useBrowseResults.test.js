import { renderHook, waitFor } from '@testing-library/react';
import { renderHookWithCioPlp, mockConstructorIOClient } from '../../test-utils';
import mockBrowseResponse from '../../local_examples/apiBrowseResponse.json';
import useBrowseResults from '../../../src/hooks/useBrowseResults';
import { getUrlFromState } from '../../../src/utils/urlHelpers';
import { transformBrowseResponse } from '../../../src/utils/transformers';
import '@testing-library/jest-dom';

describe('Testing Hook: useBrowseResults', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/group_id/All';
  const mockLocation = new URL(mockUrl);

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

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
    jest.clearAllTimers(); // Clear all timers after each test
  });

  it('Should return a PlpBrowseResponse Object', async () => {
    const { result } = renderHookWithCioPlp(() => useBrowseResults());

    await waitFor(() => {
      const { current } = result;
      const {
        data: { response, rawApiResponse, request, resultId },
      } = current;

      expect(resultId).not.toBeUndefined();
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

  it('Should not fetch results on first render with initialBrowseResponse', async () => {
    const initialBrowseResponse = transformBrowseResponse(mockBrowseResponse);

    renderHookWithCioPlp(() => useBrowseResults({ initialBrowseResponse }));

    await waitFor(() => {
      expect(mockConstructorIOClient.browse.getBrowseResults).not.toHaveBeenCalled();
    });
  });

  it('Should receive parameters from useRequestConfigs correctly', async () => {
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

  it('Should throw error if used outside Context Provider', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useBrowseResults())).toThrow();
    spy.mockRestore();
  });
});
