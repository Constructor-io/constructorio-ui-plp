import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useProductInfo from '../../../src/hooks/useProduct';
import { transformResultItem } from '../../../src/utils/transformers';
import mockItem from '../../local_examples/item.json';
import { renderHookWithCioPlp } from '../../test-utils';

describe('Testing Hook: useProductInfo', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useProductInfo())).toThrow();
  });

  const transformedItem = transformResultItem(mockItem);

  it('Should return productSwatch, itemId, itemName, itemImageUrl, itemUrl, itemPrice', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice, itemId },
      } = result;

      expect(productSwatch).not.toBeNull();
      expect(itemId).toEqual(transformedItem.itemId);
      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(transformedItem.imageUrl);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toEqual(transformedItem.data.price);
    });
  });

  it('Should return nothing properly with getters that return nothing', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }), {
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
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(productSwatch).not.toBeNull();
      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(transformedItem.imageUrl);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toBeUndefined();
    });
  });

  it('Should return correctly after different variation is selected', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;
      const { selectVariation, swatchList } = productSwatch;
      selectVariation(swatchList[1]);

      expect(itemName).toEqual(swatchList[1].itemName);
      expect(itemImageUrl).toEqual(swatchList[1].imageUrl || transformedItem.imageUrl);
      expect(itemUrl).toEqual(swatchList[1].url || transformedItem.url);
      expect(itemPrice).toEqual(swatchList[1].price || transformedItem.data.price);
    });
  });

  it('Should return nothing properly with getters that throw errors', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }), {
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
        },
      },
    });

    await waitFor(() => {
      const {
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(productSwatch).not.toBeNull();
      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(transformedItem.imageUrl);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toBeUndefined();
    });
  });
});
