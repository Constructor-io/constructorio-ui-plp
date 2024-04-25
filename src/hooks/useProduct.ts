import useProductSwatch from '../components/ProductSwatch/useProductSwatch';
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

  const itemName = productSwatch?.selectedVariation?.itemName || item.itemName;
  const itemPrice = productSwatch?.selectedVariation?.price || getPrice(item);
  const itemImageUrl = productSwatch?.selectedVariation?.imageUrl || item.imageUrl;
  const itemUrl = productSwatch?.selectedVariation?.url || item.url;

  return {
    productSwatch,
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
  };
};

export default useProductInfo;
