/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Callbacks, Item, Variation } from '../../types';
import useRequestConfigs from '../useRequestConfigs';

export default function useOnAddToCart(
  cioClient: Nullable<ConstructorIO>,
  callback?: Callbacks['onAddToCart'],
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
      let selectedVariation: Variation | undefined;

      if (cioClient) {
        cioClient.tracker.trackConversion(query, {
          itemId,
          itemName,
          variationId: selectedVariationId || variationId,
          revenue,
          section,
        });
      }

      if (selectedVariationId) {
        selectedVariation = item.variations?.filter(
          (variation) => variation.variationId === selectedVariationId,
        )?.[0];
      }

      if (callback) callback(event, item, selectedVariation);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, cioClient, requestConfigs],
  );
}
