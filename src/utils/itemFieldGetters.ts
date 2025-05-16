import { ItemFieldGetters, Item, SwatchItem, Variation } from '../types';

export function getPrice(item: Item, variation?: Variation): number {
  return variation?.data?.price || item?.data?.price;
}

export function getImageUrl(item: Item, variation?: Variation, options?: any): string | undefined {
  const { imageBaseUrl } = options;

  if (imageBaseUrl) {
    return `${imageBaseUrl}${variation?.imageUrl || item?.imageUrl}`;
  }
  return variation?.imageUrl || item?.imageUrl;
}

export function getItemUrl(item: Item, variation?: Variation): string | undefined {
  return variation?.url || item.url;
}

export function getName(item: Item, variation?: Variation): string {
  return variation?.itemName || item.itemName;
}

export function getSwatches(
  item: Item,
  retrieveSwatchPreview: ItemFieldGetters['getSwatchPreview'],
): SwatchItem[] | undefined {
  const swatchList: SwatchItem[] = [];

  item?.variations?.forEach((variation: Variation) => {
    if (retrieveSwatchPreview(variation)) {
      swatchList.push({
        itemName: variation?.itemName || item?.itemName,
        url: variation?.url || item?.url,
        imageUrl: variation?.url,
        variationId: variation?.variationId,
        swatchPreview: retrieveSwatchPreview(variation),
        variation,
      });
    }
  });

  return swatchList;
}

export function getSwatchPreview(variation: Variation): string {
  return variation?.data?.swatchPreview;
}