import { Item } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item): number {
  return item.data.price;
}
