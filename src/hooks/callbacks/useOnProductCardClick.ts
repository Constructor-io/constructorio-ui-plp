/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Item } from '../../types';
import useRequestConfigs from '../useRequestConfigs';

export default function useOnProductCardClick(
  cioClient: Nullable<ConstructorIO>,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  const { requestConfigs } = useRequestConfigs();

  if (!requestConfigs) {
    throw new Error('This hook is meant to be used within the CioPlp provider.');
  }

  return useCallback(
    (event: React.MouseEvent, item: Item, selectedVariationId?: string) => {
      const { itemName, itemId, variationId } = item;
      const { query, section } = requestConfigs;

      if (cioClient) {
        // Track search result click
        if (query) {
          cioClient.tracker.trackSearchResultClick(query, {
            itemId,
            itemName,
            variationId: selectedVariationId || variationId,
            section: 'Products',
          });
        }
        // TODO: Track browse result click
      }

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [callback, cioClient, requestConfigs],
  );
}
