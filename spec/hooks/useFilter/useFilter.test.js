import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useFilter from '../../../src/hooks/useFilter';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../../../src/utils/transformers';
import { renderHookWithCioPlp } from '../../test-utils';

describe('Testing Hook: useFilter', () => {
  const originalWindowLocation = window.location;
  const testBrandA = 'UnderArmour';
  const testBrandB = 'Constructor';

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const searchData = transformSearchResponse(mockSearchResponse);
  const useFilterProps = { facets: searchData.response.facets };

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useFilter())).toThrow();
  });

  it('Should return facets array', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { facets },
      } = result;

      expect(facets).toHaveLength(searchData.response.facets.length);
      expect(facets).toEqual(searchData.response.facets);
    });
  });

  it('Should apply filter correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('Brand', testBrandA);

      expect(window.location.href.indexOf(testBrandA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('Brand')).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should apply filter for number values correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('price', 23.2);

      expect(window.location.href.indexOf('23.2')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('price')).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should apply filter for boolean values correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('inStock', false);

      expect(window.location.href.indexOf('false')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('inStock')).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should apply multiple-type filters correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('Brand', [testBrandA, testBrandB]);

      expect(window.location.href.indexOf(testBrandA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf(testBrandB)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('Brand')).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should apply range-type filters correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('Price', '2-150');
      expect(window.location.href.indexOf('Price')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('2-150')).toBeGreaterThanOrEqual(0);

      setFilter('Price', '100-150');
      expect(window.location.href.indexOf('2-150')).toBe(-1);
      expect(window.location.href.indexOf('100-150')).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should remove a filter if value == null', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter },
      } = result;

      setFilter('Brand', testBrandA);
      setFilter('Brand', null);

      expect(window.location.href.indexOf(testBrandA)).toBe(-1);
      expect(window.location.href.indexOf('Brand')).toBe(-1);
    });
  });
});
