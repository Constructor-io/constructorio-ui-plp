/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Item } from '../../types';
import useRequestConfigs from '../useRequestConfigs';

export default function useOnAddToCart(
  cioClient: Nullable<ConstructorIO>,
  getPrice: (item: Item) => number,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  const { requestConfigs } = useRequestConfigs();

  if (!requestConfigs) {
    throw new Error('This hook is meant to be used within the CioPlp provider.');
  }

  return useCallback(
    (event: React.MouseEvent, item: Item) => {
      const { itemId, itemName, variationId } = item;
      const { query, section } = requestConfigs;
      const revenue = getPrice(item);

      if (cioClient) {
        cioClient.tracker.trackConversion(query, {
          itemId,
          itemName,
          variationId,
          revenue,
          section,
        });
      }

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, getPrice, cioClient, requestConfigs],
  );
}
