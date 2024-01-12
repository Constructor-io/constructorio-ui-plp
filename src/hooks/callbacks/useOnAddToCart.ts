/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Item } from '../../types';

export default function useOnAddToCart(
  cioClient: Nullable<ConstructorIO>,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  return useCallback(
    (event: React.MouseEvent, item: Item, revenue: number, selectedVariationId?: string) => {
      const { itemId, itemName, variationId } = item;

      // TODO: Obtain the search term, if it exists - CSL3018
      if (cioClient) {
        cioClient.tracker.trackConversion(undefined, {
          itemId,
          itemName,
          variationId: selectedVariationId || variationId,
          revenue,
          section: 'Products',
        });
      }

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, cioClient],
  );
}
