/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Callbacks, Item, Variation } from '../../types';
import useRequestConfigs from '../useRequestConfigs';

export default function useOnProductCardClick(
  cioClient: Nullable<ConstructorIO>,
  callback?: Callbacks['onProductCardClick'],
) {
  const { getRequestConfigs } = useRequestConfigs();
  const requestConfigs = getRequestConfigs();

  if (!requestConfigs) {
    throw new Error('This hook is meant to be used within the CioPlp provider.');
  }

  return useCallback(
    (event: React.MouseEvent, item: Item, selectedVariationId?: string) => {
      const { itemName, itemId, variationId } = item;
      const { query, section } = requestConfigs;
      let selectedVariation: Variation | undefined;

      if (cioClient) {
        // Track search result click
        if (query) {
          cioClient.tracker.trackSearchResultClick(query, {
            itemId,
            itemName,
            variationId: selectedVariationId || variationId,
            section,
          });
        }
      }

      if (selectedVariationId) {
        selectedVariation = item.variations?.find(
          (variation) => variation.variationId === selectedVariationId,
        );
      }

      if (callback) callback(event, item, selectedVariation);
    },
    [callback, cioClient, requestConfigs],
  );
}
