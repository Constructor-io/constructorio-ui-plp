/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Item } from '../../types';

export default function useOnAddToCart(
  cioClient: ConstructorIO,
  getPrice: (item: Item) => number,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  return useCallback(
    (event: React.MouseEvent, item: Item) => {
      const { itemId, itemName, variationId } = item;
      const revenue = getPrice(item);

      // TODO: How to track term here?
      // const termFromUrl = !(typeof browsePageCheckCallback === 'function' && browsePageCheckCallback()) && conversionUseTermFromUrls && this.getTermFromUrls();
      // const termFromSubmit = utils.storageGetItem(this.CONSTANTS.SEARCH_TERM_STORAGE_KEY);
      // const conversionTerm = term || termFromSubmit || termFromUrl || 'TERM_UNKNOWN';

      // RFC?: How to track revenue here?
      // - Issue here is the mapping of the price field to revenue
      // - We surface a callback to obtain. Defaults to item.data.price
      cioClient.tracker.trackConversion(undefined, {
        itemId,
        itemName,
        variationId,
        revenue,
        section: 'Products',
      });

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, getPrice, cioClient],
  );
}
