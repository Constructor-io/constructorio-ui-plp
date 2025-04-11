import { ItemFieldGetters, Item, SwatchItem, Variation } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function getPrice(item: Item | Variation, selectedSwatch?: SwatchItem | undefined): number {
  return selectedSwatch?.price || selectedSwatch?.variation?.data?.price || item?.data?.price;
}

// eslint-disable-next-line import/prefer-default-export
export function getImageUrl(
  item: Item | Variation,
  selectedSwatch?: SwatchItem | undefined,
  options?: any,
): string | undefined {
  const { imageBaseUrl } = options;

  if (imageBaseUrl) {
    return `${imageBaseUrl}${selectedSwatch?.imageUrl || selectedSwatch?.variation?.imageUrl || item?.imageUrl}`;
  }
  return selectedSwatch?.imageUrl || selectedSwatch?.variation?.imageUrl || item?.imageUrl;
}

// eslint-disable-next-line import/prefer-default-export
export function getUrl(
  item: Item | Variation,
  selectedSwatch?: SwatchItem | undefined,
): string | undefined {
  return selectedSwatch?.url || selectedSwatch?.variation?.url || item.url;
}

// eslint-disable-next-line import/prefer-default-export
export function getName(
  item: Item | Variation,
  selectedSwatch?: SwatchItem | undefined,
): string | undefined {
  return selectedSwatch?.itemName || selectedSwatch?.variation?.itemName || item.itemName;
}

export function getSwatches(
  item: Item,
  retrievePrice: ItemFieldGetters['getPrice'],
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
        price: retrievePrice(variation),
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
