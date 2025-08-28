import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useProductInfo from '../../../src/hooks/useProduct';
import { transformResultItem } from '../../../src/utils/transformers';
import mockItem from '../../local_examples/item.json';
import mockItemWithSalePrice from '../../local_examples/itemWithSalePrice.json';
import { renderHookWithCioPlp, copyItemWithNewSalePrice } from '../../test-utils';

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
  const transformedItemWithSalePrice = transformResultItem(mockItemWithSalePrice);

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

  it('Should return correctly after a different variation is selected', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const {
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice, itemSalePrice },
      } = result;
      const { selectVariation, swatchList } = productSwatch;
      selectVariation(swatchList[1]);

      expect(itemName).toEqual(swatchList[1].itemName);
      expect(itemImageUrl).toEqual(swatchList[1].imageUrl || transformedItem.imageUrl);
      expect(itemUrl).toEqual(swatchList[1].url || transformedItem.url);
      expect(itemPrice).toEqual(swatchList[1].price || transformedItem.data.price);
      expect(itemSalePrice).toEqual(swatchList[1].salePrice || transformedItem.data.salePrice);
    });
  });

  it('Should return nothing properly with getters that throw errors', async () => {
    const { result } = renderHookWithCioPlp(
      () => useProductInfo({ item: transformedItemWithSalePrice }),
      {
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
          },
        },
      },
    );

    await waitFor(() => {
      const {
        current: { productSwatch, itemName, itemImageUrl, itemUrl, itemPrice, itemSalePrice },
      } = result;

      expect(productSwatch).not.toBeNull();
      expect(itemName).toEqual(transformedItem.itemName);
      expect(itemImageUrl).toEqual(transformedItem.imageUrl);
      expect(itemUrl).toEqual(transformedItem.url);
      expect(itemPrice).toBeUndefined();
      expect(itemSalePrice).toBeUndefined();
    });
  });

  describe.each([
    {
      item: transformedItem,
      itemDescription: 'a standard item',
    },
    {
      item: transformedItemWithSalePrice,
      itemDescription: 'an item on sale',
    },
  ])('With $itemDescription', ({ item }) => {
    it.each([
      ['itemId', item.itemId],
      ['itemName', item.itemName],
      ['itemImageUrl', item.imageUrl],
      ['itemUrl', item.url],
      ['itemPrice', item.data.price],
      ['salePrice', item.data.sale_price],
    ])('Should return the correct value for "%s"', async (property, expectedValue) => {
      const { result } = renderHookWithCioPlp(() => useProductInfo({ item }));
      await waitFor(() => {
        expect(result.current[property]).toEqual(expectedValue);
      });
    });
  });

  describe('Testing sale price handling logic', () => {
    describe.each([
      {
        desc: 'undefined salePrice',
        salePrice: undefined,
        expected: undefined,
      },
      {
        desc: 'negative salePrice',
        salePrice: -5,
        expected: undefined,
      },
      {
        desc: 'salePrice greater than or equal to price',
        salePrice: Infinity,
        expected: undefined,
      },
      {
        desc: 'valid salePrice (positive and less than price)',
        salePrice: 1,
        expected: 1,
      },
      {
        desc: 'zero salePrice',
        salePrice: 0,
        expected: undefined,
      },
    ])('When $desc', ({ salePrice, expected }) => {
      it(`Should return ${expected === undefined ? 'undefined' : expected} for salePrice`, async () => {
        const item = transformResultItem(
          copyItemWithNewSalePrice(mockItemWithSalePrice, salePrice),
        );
        const { result } = renderHookWithCioPlp(() => useProductInfo({ item }));
        await waitFor(() => {
          expect(result.current.salePrice).toEqual(expected);
        });
      });
    });
  });
});
