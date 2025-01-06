/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Item } from '../../types';
import useRequestConfigs from '../useRequestConfigs';

export default function useOnAddToCart(
  cioClient: Nullable<ConstructorIO>,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  const { getRequestConfigs } = useRequestConfigs();
  const requestConfigs = getRequestConfigs();

  if (!requestConfigs) {
    throw new Error('This hook is meant to be used within the CioPlp provider.');
  }

  return useCallback(
    (event: React.MouseEvent, item: Item, revenue?: number, selectedVariationId?: string) => {
      const { itemId, itemName, variationId } = item;
      const { query, section } = requestConfigs;

      if (cioClient) {
        cioClient.tracker.trackConversion(query, {
          itemId,
          itemName,
          variationId: selectedVariationId || variationId,
          revenue,
          section,
        });
      }

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, cioClient, requestConfigs],
  );
}
