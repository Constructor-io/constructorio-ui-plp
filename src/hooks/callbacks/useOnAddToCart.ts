import React, { useCallback } from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { Item } from '../../types';

interface UseOnAddToCartProps {
  cioClient: ConstructorIO;
  getPrice: (item: Item) => number;
  callback?: (event: React.MouseEvent, item: Item) => void;
  searchTerm?: string;
}

export default function useOnAddToCart({
  cioClient,
  getPrice,
  callback,
  searchTerm = 'TERM_UNKNOWN',
}: UseOnAddToCartProps) {
  return useCallback(
    (event: React.MouseEvent, item: Item) => {
      const { itemId, itemName, variationId } = item;
      const revenue = getPrice(item);

      cioClient.tracker.trackConversion(searchTerm, {
        itemId,
        itemName,
        variationId,
        revenue,
        section: 'Products',
      });

      if (callback) callback(event, item);

      event.preventDefault();
      event.stopPropagation();
    },
    [searchTerm, callback, getPrice, cioClient],
  );
}
