import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useProductSwatch from '../../../src/hooks/useProductSwatch';
import { transformResultItem } from '../../../src/utils/transformers';
import mockItem from '../../local_examples/item.json';
import { renderHookWithCioPlp } from '../../test-utils';
import {
  getSwatchPreview,
  getPrice,
  getSwatches,
  getSalePrice,
  getRolloverImage,
} from '../../../src/utils/itemFieldGetters';

describe('Testing Hook: useProductSwatch', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const transformedItem = transformResultItem(mockItem);
  const expectedSwatch = getSwatches(
    transformedItem,
    getPrice,
    getSwatchPreview,
    getSalePrice,
    getRolloverImage,
  );

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useProductSwatch())).toThrow();
  });

  it('Should return swatchList, selectedVariation, selectVariation', async () => {
    const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { swatchList, selectedVariation, selectVariation },
      } = result;

      expect(typeof selectVariation).toBe('function');
      expect(selectedVariation.variationId).toEqual(transformedItem.variationId);
      expect(swatchList).toHaveLength(expectedSwatch.length);
      expect(swatchList).toEqual(expectedSwatch);
    });
  });

  it('Should change selectedVariation correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { swatchList, selectedVariation, selectVariation },
      } = result;

      selectVariation(swatchList[1]);

      expect(selectedVariation.variationId).not.toEqual(transformedItem.variationId);
      expect(selectedVariation.variationId).toEqual(swatchList[1].variationId);
      expect(swatchList).toHaveLength(expectedSwatch.length);
      expect(swatchList).toEqual(expectedSwatch);
    });
  });

  it('Should return nothing properly with getters that return nothing', async () => {
    const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }), {
      initialProps: {
        itemFieldGetters: {
          getPrice: () => {},
          getSwatches: () => {},
          getSwatchPreview: () => {},
          getSalePrice: () => {},
          getRolloverImage: () => {},
        },
      },
    });

    await waitFor(() => {
      const {
        current: { swatchList, selectedVariation, selectVariation },
      } = result;

      expect(typeof selectVariation).toBe('function');
      expect(selectedVariation).toBeUndefined();
      expect(swatchList.length).toBe(0);
    });
  });

  it('Should return nothing properly with getters that throw errors', async () => {
    const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }), {
      initialProps: {
        itemFieldGetters: {
          getPrice: () => {
            throw new Error();
          },
          getSwatches: () => {
            throw new Error();
          },
          getSwatchPreview: () => {
            throw new Error();
          },
          getSalePrice: () => {
            throw new Error();
          },
          getRolloverImage: () => {
            throw new Error();
          },
        },
      },
    });

    await waitFor(() => {
      const {
        current: { swatchList, selectedVariation, selectVariation },
      } = result;

      expect(typeof selectVariation).toBe('function');
      expect(selectedVariation).toBeUndefined();
      expect(swatchList.length).toBe(0);
    });
  });

  it('Should override getRolloverImage and work as expected', async () => {
    const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }), {
      initialProps: {
        itemFieldGetters: {
          getRolloverImage: (item) => item.data.swatchPreview,
        },
      },
    });

    await waitFor(() => {
      const {
        current: { selectedVariation },
      } = result;

      expect(selectedVariation.rolloverImage).toBe('#e04062');
    });
  });

  describe('maxVisibleSwatches config', () => {
    it('Should return all swatches as visible when no config is provided', async () => {
      const { result } = renderHookWithCioPlp(() => useProductSwatch({ item: transformedItem }));

      await waitFor(() => {
        const {
          current: {
            swatchList,
            visibleSwatches,
            hiddenSwatches,
            hasMoreSwatches,
            totalSwatchCount,
          },
        } = result;

        expect(visibleSwatches).toEqual(swatchList);
        expect(hiddenSwatches).toBeUndefined();
        expect(hasMoreSwatches).toBe(false);
        expect(totalSwatchCount).toBe(swatchList.length);
      });
    });

    it('Should split swatches when maxVisibleSwatches is less than total', async () => {
      const { result } = renderHookWithCioPlp(() =>
        useProductSwatch({ item: transformedItem, config: { maxVisibleSwatches: 2 } }),
      );

      await waitFor(() => {
        const {
          current: {
            swatchList,
            visibleSwatches,
            hiddenSwatches,
            hasMoreSwatches,
            totalSwatchCount,
          },
        } = result;

        expect(visibleSwatches).toHaveLength(2);
        expect(visibleSwatches).toEqual(swatchList.slice(0, 2));
        expect(hiddenSwatches).toEqual(swatchList.slice(2));
        expect(hasMoreSwatches).toBe(true);
        expect(totalSwatchCount).toBe(swatchList.length);
      });
    });

    it('Should return all swatches as visible when maxVisibleSwatches exceeds total', async () => {
      const { result } = renderHookWithCioPlp(() =>
        useProductSwatch({ item: transformedItem, config: { maxVisibleSwatches: 100 } }),
      );

      await waitFor(() => {
        const {
          current: { swatchList, visibleSwatches, hiddenSwatches, hasMoreSwatches },
        } = result;

        expect(visibleSwatches).toEqual(swatchList);
        expect(hiddenSwatches).toBeUndefined();
        expect(hasMoreSwatches).toBe(false);
      });
    });

    it('Should return all swatches as visible when maxVisibleSwatches equals total', async () => {
      const { result } = renderHookWithCioPlp(() =>
        useProductSwatch({
          item: transformedItem,
          config: { maxVisibleSwatches: expectedSwatch.length },
        }),
      );

      await waitFor(() => {
        const {
          current: { swatchList, visibleSwatches, hiddenSwatches, hasMoreSwatches },
        } = result;

        expect(visibleSwatches).toEqual(swatchList);
        expect(hiddenSwatches).toBeUndefined();
        expect(hasMoreSwatches).toBe(false);
      });
    });

    it('Should hide all swatches when maxVisibleSwatches is 0', async () => {
      const { result } = renderHookWithCioPlp(() =>
        useProductSwatch({ item: transformedItem, config: { maxVisibleSwatches: 0 } }),
      );

      await waitFor(() => {
        const {
          current: { swatchList, visibleSwatches, hiddenSwatches, hasMoreSwatches },
        } = result;

        expect(visibleSwatches).toHaveLength(0);
        expect(hiddenSwatches).toEqual(swatchList);
        expect(hasMoreSwatches).toBe(true);
      });
    });
  });
});
