import React, { useCallback } from 'react';
import { Callbacks, SwatchItem, UrlHelpers } from '../../types';

export default function useOnShowMoreSwatches(
  selectedSwatch: SwatchItem | undefined,
  hiddenSwatches: SwatchItem[],
  setUrl: UrlHelpers['setUrl'],
  callback?: Callbacks['onShowMoreSwatches'],
) {
  return useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (callback) {
        callback(event, selectedSwatch, hiddenSwatches, setUrl);
      } else {
        const url = selectedSwatch?.url;
        if (url) {
          setUrl(url);
        }
      }
    },
    [selectedSwatch, hiddenSwatches, setUrl, callback],
  );
}
