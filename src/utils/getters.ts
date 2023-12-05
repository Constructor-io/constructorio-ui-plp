import { Item, SwatchItem } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item): number {
  return item.data.price;
}

export function getSwatches(item: Item): [SwatchItem] {
  return item?.variations?.map((variation) => ({
    url: variation?.data?.url,
    imageUrl: variation?.data?.image_url,
    variationId: variation?.data?.variation_id,
  }));
}
