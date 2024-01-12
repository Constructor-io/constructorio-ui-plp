import { Getters, Item, SwatchItem } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item): number {
  return item.data.price;
}

export function getSwatches(
  item: Item,
  retrievePrice: Getters['getPrice'],
): SwatchItem[] | undefined {
  return item?.variations?.map((variation) => ({
    itemName: variation?.value,
    url: variation?.data?.url,
    imageUrl: variation?.data?.image_url,
    variationId: variation?.data?.variation_id,
    price: retrievePrice(variation),
    previewImageUrl: variation?.data?.image_url,
    previewHexCode: variation?.data?.swatchHex,
  }));
}
