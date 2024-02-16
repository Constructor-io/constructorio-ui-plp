import { ItemFieldGetters, Item, SwatchItem } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item): number {
  return item.data.price;
}

export function getSwatches(
  item: Item,
  retrievePrice: ItemFieldGetters['getPrice'],
  retrieveSwatchPreview: ItemFieldGetters['getSwatchPreview'],
): SwatchItem[] | undefined {
  const swatchList: SwatchItem[] = [];

  item?.variations?.forEach((variation) => {
    if (retrieveSwatchPreview(variation)) {
      swatchList.push({
        itemName: variation?.value || item?.itemName,
        url: variation?.data?.url || item?.data?.url,
        imageUrl: variation?.data?.image_url,
        variationId: variation?.data?.variation_id,
        price: retrievePrice(variation),
        swatchPreview: retrieveSwatchPreview(variation),
      });
    }
  });

  return swatchList;
}

export function getSwatchPreview(item: Item): string {
  return item?.data?.swatchPreview;
}
