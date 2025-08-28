import useProductSwatch from './useProductSwatch';
import { useCioPlpContext } from './useCioPlpContext';
import { UseProductInfo } from '../types';
import { tryCatchify, isValidSalePrice } from '../utils';
import {
  getPrice as defaultGetPrice,
  getSalePrice as defaultGetSalePrice,
} from '../utils/itemFieldGetters';

const useProductInfo: UseProductInfo = ({ item }) => {
  const state = useCioPlpContext();
  const productSwatch = useProductSwatch({ item });

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const getPrice = tryCatchify(state?.itemFieldGetters?.getPrice || defaultGetPrice);
  const getSalePrice = tryCatchify(state?.itemFieldGetters?.getSalePrice || defaultGetSalePrice);

  const itemName = productSwatch?.selectedVariation?.itemName || item.itemName;
  const itemPrice = productSwatch?.selectedVariation?.price || getPrice(item);
  const itemImageUrl = productSwatch?.selectedVariation?.imageUrl || item.imageUrl;
  const itemUrl = productSwatch?.selectedVariation?.url || item.url;
  const variationId = productSwatch?.selectedVariation?.variationId;
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
    hasSalePrice,
  };
};

export default useProductInfo;
