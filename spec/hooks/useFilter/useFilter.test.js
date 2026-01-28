import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import useFilter from '../../../src/hooks/useFilter';
import useRequestConfigs from '../../../src/hooks/useRequestConfigs';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../../../src/utils';
import { renderHookWithCioPlp } from '../../test-utils';
import { CioPlpProvider } from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';

describe('Testing Hook: useFilter', () => {
  const originalWindowLocation = window.location;
  const testBrandA = 'AnonymousCompany';
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

  it('Should return sliderStep when provided', async () => {
    const useFilterPropsWithSliderStep = {
      ...useFilterProps,
      sliderStep: 0.5,
    };
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithSliderStep));

    await waitFor(() => {
      const {
        current: { sliderStep },
      } = result;
      expect(sliderStep).toBe(0.5);
    });
  });

  it('Should return facetSliderSteps when provided', async () => {
    const facetSliderSteps = { price: 1, rating: 0.1 };
    const useFilterPropsWithFacetSliderSteps = {
      ...useFilterProps,
      facetSliderSteps,
    };
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithFacetSliderSteps));

    await waitFor(() => {
      const {
        current: { facetSliderSteps: returnedFacetSliderSteps },
      } = result;
      expect(returnedFacetSliderSteps).toEqual(facetSliderSteps);
    });
  });

  it('Should remove all filters when clearFilters is called', async () => {
    const { result } = renderHookWithCioPlp(() => useFilter(useFilterProps));

    await waitFor(() => {
      const {
        current: { setFilter, clearFilters },
      } = result;

      setFilter('Brand', testBrandA);
      setFilter('Price', '2-150');

      expect(window.location.href.indexOf('Brand')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf(testBrandA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('Price')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('2-150')).toBeGreaterThanOrEqual(0);

      clearFilters();
      expect(window.location.href.indexOf('Brand')).toBe(-1);
      expect(window.location.href.indexOf(testBrandA)).toBe(-1);
      expect(window.location.href.indexOf('Price')).toBe(-1);
      expect(window.location.href.indexOf('2-150')).toBe(-1);
    });
  });

  it('Should remove all filters but not other request params when clearFilters is called', async () => {
    const initialProps = {
      staticRequestConfigs: {
        resultsPerPage: 12,
        section: 'Search Suggestions',
      },
    };

    const { result: filterResult } = renderHookWithCioPlp(() => useFilter(useFilterProps), {
      initialProps,
    });
    // Use useRequestConfigs hook to access request configs
    const { result: requestConfigsResult } = renderHookWithCioPlp(() => useRequestConfigs(), {
      initialProps,
    });

    const {
      current: { setFilter, clearFilters },
    } = filterResult;

    await waitFor(() => {
      setFilter('Brand', testBrandA);
      setFilter('Price', '2-150');

      let requestConfig = requestConfigsResult.current.getRequestConfigs();
      expect(requestConfig.filters.Brand.toString()).toBe(testBrandA);
      expect(requestConfig.filters.Price.toString()).toBe('2-150');
      expect(requestConfig.resultsPerPage).toBe(12);
      expect(requestConfig.section.toString()).toBe('Search Suggestions');

      clearFilters();

      requestConfig = requestConfigsResult.current.getRequestConfigs();
      expect(requestConfig.filters).toBeUndefined();
      expect(requestConfig.resultsPerPage).toBe(12);
      expect(requestConfig.section.toString()).toBe('Search Suggestions');
    });
  });

  describe('isHiddenFacetFn', () => {
    it('Should filter out facets when isHiddenFacetFn returns true', async () => {
      const isHiddenFacetFn = (facet) => facet.name === 'brand'; // lowercase
      const useFilterPropsWithHiddenFn = {
        ...useFilterProps,
        isHiddenFacetFn,
      };
      const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithHiddenFn));

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        expect(facets.length).toBe(searchData.response.facets.length - 1);
        expect(facets.find((f) => f.name === 'brand')).toBeUndefined();
      });
    });

    it('Should not filter facets when isHiddenFacetFn returns false', async () => {
      const isHiddenFacetFn = () => false;
      const useFilterPropsWithHiddenFn = {
        ...useFilterProps,
        isHiddenFacetFn,
      };
      const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithHiddenFn));

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        expect(facets.length).toBe(searchData.response.facets.length);
      });
    });

    it('Should filter facets by multiple conditions', async () => {
      const isHiddenFacetFn = (facet) => facet.type === 'range';
      const useFilterPropsWithHiddenFn = {
        ...useFilterProps,
        isHiddenFacetFn,
      };
      const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithHiddenFn));

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        // Should filter out all range type facets
        expect(facets.every((f) => f.type !== 'range')).toBe(true);
      });
    });
  });

  describe('getIsHiddenFacetField via metadata', () => {
    it('Should filter out facets with data.cio_plp_hidden = true', async () => {
      // Create facets with hidden flag
      const facetsWithHidden = searchData.response.facets.map((facet, index) => ({
        ...facet,
        data: {
          ...facet.data,
          cio_plp_hidden: index === 0, // Hide first facet
        },
      }));

      const useFilterPropsWithHiddenData = {
        facets: facetsWithHidden,
      };
      const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithHiddenData));

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        expect(facets.length).toBe(facetsWithHidden.length - 1);
        // First facet should be hidden
        expect(facets[0].name).not.toBe(facetsWithHidden[0].name);
      });
    });

    it('Should use custom getIsHiddenFacetField from itemFieldGetters', async () => {
      // Create a custom field getter that hides facets with a custom field
      const customGetIsHiddenFacetField = (facet) => facet.data?.customHidden === true;

      const facetsWithCustomField = searchData.response.facets.map((facet, index) => ({
        ...facet,
        data: {
          ...facet.data,
          customHidden: index === 1, // Hide second facet
        },
      }));

      const { result } = renderHook(
        () => useFilter({ facets: facetsWithCustomField }),
        {
          wrapper: ({ children }) => (
            <CioPlpProvider
              apiKey={DEMO_API_KEY}
              itemFieldGetters={{ getIsHiddenFacetField: customGetIsHiddenFacetField }}
            >
              {children}
            </CioPlpProvider>
          ),
        }
      );

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        expect(facets.length).toBe(facetsWithCustomField.length - 1);
        // Second facet should be hidden
        expect(facets.find((f) => f.name === facetsWithCustomField[1].name)).toBeUndefined();
      });
    });

    it('Should prioritize isHiddenFacetFn over getIsHiddenFacetField', async () => {
      // Both methods should work together - if either returns true, facet is hidden
      const facetsWithHidden = searchData.response.facets.map((facet, index) => ({
        ...facet,
        data: {
          ...facet.data,
          cio_plp_hidden: index === 0, // Hide first facet via metadata
        },
      }));

      const isHiddenFacetFn = (facet) => facet.name === facetsWithHidden[1].name; // Also hide second facet via fn

      const useFilterPropsWithBoth = {
        facets: facetsWithHidden,
        isHiddenFacetFn,
      };
      const { result } = renderHookWithCioPlp(() => useFilter(useFilterPropsWithBoth));

      await waitFor(() => {
        const {
          current: { facets },
        } = result;

        // Both first and second facets should be hidden
        expect(facets.length).toBe(facetsWithHidden.length - 2);
        expect(facets.find((f) => f.name === facetsWithHidden[0].name)).toBeUndefined();
        expect(facets.find((f) => f.name === facetsWithHidden[1].name)).toBeUndefined();
      });
    });
  });
});
