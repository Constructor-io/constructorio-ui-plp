import { Getters, Item, SwatchItem } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item): number {
  return item.data.price;
}

export function getSwatches(
  item: Item,
  retrievePrice: Getters['getPrice'],
  retrieveSwatchPreview: Getters['getSwatchPreview'],
): SwatchItem[] | undefined {
  return item?.variations?.map((variation) => ({
    itemName: variation?.value || item?.value,
    url: variation?.data?.url || item?.data?.url,
    imageUrl: variation?.data?.image_url,
    variationId: variation?.data?.variation_id,
    price: retrievePrice(variation),
    swatchPreview: retrieveSwatchPreview(variation),
  }));
}

export function getSwatchPreview(item: Item): string {
  return item?.data?.swatchPreview;
}
