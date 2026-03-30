import React, { useCallback } from 'react';
import { Callbacks, Item, SwatchItem, UrlHelpers } from '../../types';

// eslint-disable-next-line max-params
export default function useOnShowMoreSwatches(
  item: Item,
  selectedSwatch: SwatchItem | undefined,
  hiddenSwatches: SwatchItem[],
  setUrl: UrlHelpers['setUrl'],
  callback?: Callbacks['onShowMoreSwatches'],
) {
  return useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (callback) {
        callback(event, item, selectedSwatch, hiddenSwatches, setUrl);
      } else {
        const url = selectedSwatch?.url || item.url;
        if (url) {
          setUrl(url);
        }
      }
    },
    [item, selectedSwatch, hiddenSwatches, setUrl, callback],
  );
}
