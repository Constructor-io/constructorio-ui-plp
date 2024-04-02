import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useFilter from '../src/hooks/useFilter';
import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../src/utils/transformers';
import { renderHookWithCioPlp } from './test-utils';

describe('Testing Hook: useFilter', () => {
  let location;
  const mockLocation = new URL('https://example.com');

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    location = window.location;
    delete window.location;
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/';
  });

  afterEach(() => {
    window.location = location;
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const searchResponse = transformSearchResponse(mockSearchResponse);

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useFilter())).toThrow();
  });

  it('Should return facets array', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter({ response: searchResponse }));

    await waitFor(() => {
      const {
        current: { facets },
      } = result;

      expect(facets).toHaveLength(searchResponse.facets.length);
      expect(facets).toEqual(searchResponse.facets);
    });
  });

  it('Should apply filter correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter({ response: searchResponse }));

    await waitFor(() => {
      const {
        current: { applyFilter },
      } = result;

      applyFilter('Brand', 'test-brand');

      expect(mockLocation.href.indexOf('test-brand')).toBeGreaterThanOrEqual(0);
      expect(mockLocation.href.indexOf('Brand')).toBeGreaterThanOrEqual(0);
    });
  });
});
