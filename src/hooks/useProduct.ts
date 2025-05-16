import { useCioPlpContext } from './useCioPlpContext';
import { tryCatchify } from '../utils';
import { Item, SwatchItem } from '../types';

interface UseProductInfoArgs {
  item: Item;
  selectedVariation?: SwatchItem;
}

const useProductInfo = ({ item, selectedVariation }: UseProductInfoArgs) => {
  const state = useCioPlpContext();

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const getPrice = tryCatchify(state?.itemFieldGetters?.getPrice);
  const getImageUrl = tryCatchify(state?.itemFieldGetters?.getImageUrl);
  const getItemUrl = tryCatchify(state?.itemFieldGetters?.getItemUrl);
  const getName = tryCatchify(state?.itemFieldGetters?.getName);

  const itemName = getName(item, selectedVariation);
  const itemPrice = getPrice(item, selectedVariation);
  const itemImageUrl = getImageUrl(item, selectedVariation, {
    imageBaseUrl: state.customConfigs.imageBaseUrl,
  });
  const itemUrl = getItemUrl(item, selectedVariation);
  const { itemId } = item;

  return {
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
    variationId,
    itemId,
  };
};

export default useProductInfo;
