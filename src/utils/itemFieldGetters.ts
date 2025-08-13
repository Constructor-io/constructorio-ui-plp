import { ItemFieldGetters, Item, SwatchItem, Variation } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item | Variation): number {
  return item.data.price;
}

export function getSalePrice(item: Item | Variation): number | undefined {
  return item.data.sale_price;
}

export function getRolloverImage(item: Item | Variation): string | undefined {
  return item.data.rolloverImage;
}

export function getSwatches(
  item: Item,
  retrievePrice: ItemFieldGetters['getPrice'],
  retrieveSwatchPreview: ItemFieldGetters['getSwatchPreview'],
  retrieveSalePrice: ItemFieldGetters['getSalePrice'],
  retrieveRolloverImage: ItemFieldGetters['getRolloverImage']
): SwatchItem[] | undefined {
  const swatchList: SwatchItem[] = [];

  item?.variations?.forEach((variation: Variation) => {
    if (retrieveSwatchPreview(variation)) {
      swatchList.push({
        itemName: variation?.itemName || item?.itemName,
        url: variation?.url || item?.url,
        imageUrl: variation?.url,
        variationId: variation?.variationId,
        price: retrievePrice(variation),
        salePrice: retrieveSalePrice(variation),
        swatchPreview: retrieveSwatchPreview(variation),
        rolloverImage: retrieveRolloverImage(variation),
      });
    }
  });

  return swatchList;
}

export function getSwatchPreview(variation: Variation): string {
  return variation?.data?.swatchPreview;
}
