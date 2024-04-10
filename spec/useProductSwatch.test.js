import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useProductSwatch from '../src/components/ProductSwatch/useProductSwatch';
import { transformResultItem } from '../src/utils/transformers';
import mockItem from './local_examples/item.json';
import { renderHookWithCioPlp } from './test-utils';
import { getSwatchPreview, getPrice, getSwatches } from '../src/utils/itemFieldGetters';

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
  const expectedSwatch = getSwatches(transformedItem, getPrice, getSwatchPreview);

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
        },
      },
    });

    await waitFor(() => {
      const {
        current: { swatchList, selectedVariation, selectVariation },
      } = result;

      expect(typeof selectVariation).toBe('function');
      expect(selectedVariation).toBeUndefined();
      expect(swatchList).toBeUndefined();
    });
  });
});
