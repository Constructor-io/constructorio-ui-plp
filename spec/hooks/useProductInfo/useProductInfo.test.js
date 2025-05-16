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

  it('Should return itemId, itemName, itemImageUrl, itemUrl, itemPrice', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { itemName, itemImageUrl, itemUrl, itemPrice, itemId },
      } = result;

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
          getName: () => {},
          getItemUrl: () => {},
          getImageUrl: () => {},
        },
      },
    });

    await waitFor(() => {
      const {
        current: { itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(itemName).toBeUndefined();
      expect(itemImageUrl).toBeUndefined();
      expect(itemUrl).toBeUndefined();
      expect(itemPrice).toBeUndefined();
    });
  });

  it('Should return properly with getters that override defaults', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }), {
      initialProps: {
        itemFieldGetters: {
          getPrice: () => 'override',
          getSwatches: () => [],
          getSwatchPreview: () => 'override',
          getName: () => 'override',
          getItemUrl: () => 'override',
          getImageUrl: () => 'override',
        },
      },
    });

    await waitFor(() => {
      const {
        current: { itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(itemName).toEqual('override');
      expect(itemUrl).toEqual('override');
      expect(itemImageUrl).toEqual('override');
      expect(itemPrice).toEqual('override');
    });
  });

  it('Should return image properly with overridden baseUrl', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }), {
      initialProps: {
        customConfigs: { imageBaseUrl: 'test.com' },
      },
    });

    await waitFor(() => {
      const {
        current: { itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(`test.com${transformedItem.imageUrl}`);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toEqual(transformedItem.data.price);
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
        current: { itemName, itemImageUrl, itemUrl, itemPrice },
      } = result;

      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(transformedItem.imageUrl);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toBeUndefined();
    });
  });

  it('should merge product info fields with selectedVariation when provided', async () => {
    const transformedItem = transformResultItem(mockItem);

    const selectedVariation = {
      itemName: 'Variation Name',
      price: 123.45,
      imageUrl: 'variation-image.jpg',
      url: 'variation-url',
    };
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem, selectedVariation }));

    await waitFor(() => {
      const { current: { itemName, itemPrice, itemImageUrl, itemUrl } } = result;
      expect(itemName).toEqual('Variation Name');
      expect(itemPrice).toEqual(123.45);
      expect(itemImageUrl).toEqual('variation-image.jpg');
      expect(itemUrl).toEqual('variation-url');
    });
  });
});
