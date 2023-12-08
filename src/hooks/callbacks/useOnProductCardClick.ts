import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Item } from '../../types';

interface UseOnProductCardClickProps {
  cioClient: ConstructorIO;
  callback?: (event: React.MouseEvent, item: Item) => void;
  searchTerm?: string;
  filterName?: string;
  filterValue?: string;
  section?: string;
}

export default function useOnProductCardClick({
  cioClient,
  callback,
  searchTerm = '',
  filterName = '',
  filterValue = '',
  section = 'Products',
}: UseOnProductCardClickProps) {
  return useCallback(
    (event: React.MouseEvent, item: Item) => {
      const { itemName, itemId, variationId } = item;

      if (searchTerm) {
        // Track search result click
        cioClient.tracker.trackSearchResultClick(searchTerm, {
          itemId,
          itemName,
          variationId,
          section,
        });
      } else {
        // Track browse result click
        cioClient.tracker.trackBrowseResultClick({
          itemId,
          variationId,
          section,
          filterName,
          filterValue,
        });
      }

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [filterName, filterValue, searchTerm, section, callback, cioClient],
  );
}
