import useProductSwatch from './useProductSwatch';
import { useCioPlpContext } from './useCioPlpContext';
import { UseProductInfo } from '../types';
import { tryCatchify, isValidSalePrice } from '../utils';
import {
  getPrice as defaultGetPrice,
  getSalePrice as defaultGetSalePrice,
  getRolloverImage as defaultGetRolloverImage,
} from '../utils/itemFieldGetters';

const useProductInfo: UseProductInfo = ({ item }) => {
  const state = useCioPlpContext();
  const productSwatch = useProductSwatch({ item });

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const getPrice = tryCatchify(state?.itemFieldGetters?.getPrice || defaultGetPrice);
  const getSalePrice = tryCatchify(state?.itemFieldGetters?.getSalePrice || defaultGetSalePrice);
  const getRolloverImage = tryCatchify(
    state?.itemFieldGetters?.getRolloverImage || defaultGetRolloverImage,
  );

  const itemName = productSwatch?.selectedVariation?.itemName || item.itemName;
  const itemPrice = productSwatch?.selectedVariation?.price || getPrice(item);
  const itemImageUrl = productSwatch?.selectedVariation?.imageUrl || item.imageUrl;
  const itemUrl = productSwatch?.selectedVariation?.url || item.url;
  const variationId = productSwatch?.selectedVariation?.variationId;
  let rolloverImage = productSwatch?.selectedVariation?.rolloverImage;

  // Fallback to item's rollover image if all variations don't have a rollover image
  if (!rolloverImage && productSwatch?.swatchList?.every((swatch) => !swatch.rolloverImage)) {
    rolloverImage = getRolloverImage(item);
  }

  const { itemId } = item;

  let salePrice = productSwatch?.selectedVariation?.salePrice || getSalePrice(item);
  let hasSalePrice = true;

  if (!isValidSalePrice(salePrice, itemPrice)) {
    salePrice = undefined;
    hasSalePrice = false;
  }

  return {
    productSwatch,
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
    variationId,
    itemId,
    salePrice,
    rolloverImage,
    hasSalePrice,
  };
};

export default useProductInfo;
