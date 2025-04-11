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
  const getUrl = tryCatchify(state?.itemFieldGetters?.getUrl);
  const getName = tryCatchify(state?.itemFieldGetters?.getName);

  const itemName = getName(item, productSwatch?.selectedVariation);
  const itemPrice = getPrice(item, productSwatch?.selectedVariation);
  const itemImageUrl = getImageUrl(item, productSwatch?.selectedVariation, {
    imageBaseUrl: state.customConfigs.imageBaseUrl,
  });
  const itemUrl = getUrl(item, productSwatch?.selectedVariation);

  return {
    productSwatch,
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
  };
};

export default useProductInfo;
