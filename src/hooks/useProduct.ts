import useProductSwatch from './useProductSwatch';
import { useCioPlpContext } from './useCioPlpContext';
import { UseProductInfo } from '../types';
import { tryCatchify } from '../utils';

const useProductInfo: UseProductInfo = ({ item }) => {
  const state = useCioPlpContext();
  const productSwatch = useProductSwatch({ item });

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const getPrice = tryCatchify(state?.itemFieldGetters?.getPrice);
  const getImageUrl = tryCatchify(state?.itemFieldGetters?.getImageUrl);
  const getItemUrl = tryCatchify(state?.itemFieldGetters?.getItemUrl);
  const getName = tryCatchify(state?.itemFieldGetters?.getName);

  const itemName = getName(item, productSwatch?.selectedVariation);
  const itemPrice = getPrice(item, productSwatch?.selectedVariation);
  const itemImageUrl = getImageUrl(item, productSwatch?.selectedVariation, {
    imageBaseUrl: state.customConfigs.imageBaseUrl,
  });
  const itemUrl = getItemUrl(item, productSwatch?.selectedVariation);

  return {
    productSwatch,
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
  };
};

export default useProductInfo;
