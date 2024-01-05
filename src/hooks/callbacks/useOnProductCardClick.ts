/* eslint-disable max-len */
import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Nullable } from '@constructor-io/constructorio-client-javascript/lib/types';

import { Item } from '../../types';

export default function useOnProductCardClick(
  cioClient: Nullable<ConstructorIO>,
  callback?: (event: React.MouseEvent, item: Item) => void,
) {
  return useCallback(
    (event: React.MouseEvent, item: Item) => {
      // TODO: Identify if Search & Browse, and call the right method - CSL3018
      // TODO: Obtain the search term - CSL3018
      const { itemName, itemId, variationId } = item;

      if (cioClient) {
        cioClient.tracker.trackSearchResultClick('', {
          itemId,
          itemName,
          variationId,
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
