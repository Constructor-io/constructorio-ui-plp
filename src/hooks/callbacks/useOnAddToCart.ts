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

      // TODO: Obtain the search term, if it exists - CSL3018
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
