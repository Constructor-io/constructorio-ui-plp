import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useProductSwatch from '../src/components/ProductSwatch/useProductSwatch';
import useSort from '../src/hooks/useSort';
import {
  transformResultItem,
  transformSearchResponse,
  transformSortOptionsResponse,
} from '../src/utils/transformers';
import mockItem from './local_examples/item.json';
import mockSearchResponse from './local_examples/apiSearchResponse.json';
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

  const searchResponse = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = transformSortOptionsResponse(searchResponse.sortOptions);
  const transformedItem = transformResultItem(mockItem);
  const expectedSwatch = getSwatches(transformedItem, getPrice, getSwatchPreview);

  it.only('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useProductSwatch())).toThrow();
  });

  it.only('Should return swatchList, selectedVariation, selectVariation', async () => {
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

  it('Should return the default sort option if none is already selected in request configs', async () => {
    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort },
      } = result;

      const defaultSort = responseSortOptions.find((option) => option.status === 'selected');
      expect(selectedSort).toEqual(defaultSort);
    });
  });

  it('Should return pre-selected sort option', async () => {
    const sortBy = 'item_name';
    const sortOrder = 'ascending';
    window.location.href = `https://www.example.com/group_id/test?sortBy=${sortBy}&sortOrder=${sortOrder}`;

    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort },
      } = result;

      expect(selectedSort.sortBy).toEqual(sortBy);
      expect(selectedSort.sortOrder).toEqual(sortOrder);
    });
  });

  it('Should change selected sort option correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort, changeSelectedSort },
      } = result;

      changeSelectedSort({
        sortBy: 'item_name',
        sortOrder: 'descending',
        displayName: 'Name Z-A',
      });

      expect(selectedSort.sortBy).toEqual('item_name');
      expect(selectedSort.sortOrder).toEqual('descending');
      expect(selectedSort.displayName).toEqual('Name Z-A');
    });
  });
});
