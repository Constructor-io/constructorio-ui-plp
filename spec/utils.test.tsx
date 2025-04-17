import { waitFor } from '@testing-library/react';
import { transformResultItem } from '../src/utils/transformers';
import {
  getProductCardCnstrcDataAttributes,
} from '../src/utils';
import useProductInfo from '../src/hooks/useProduct';
import mockItem from './local_examples/item.json';
import { renderHookWithCioPlp } from './test-utils';

const transformedItem = transformResultItem(mockItem);

describe('Testing Utils, getProductCardCnstrcDataAttributes', () => {
  test('Should return productSwatch, itemId, itemName, itemImageUrl, itemUrl, itemPrice', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const dataAttributes = getProductCardCnstrcDataAttributes(result.current);

      expect(dataAttributes['data-cnstrc-item-id']).toBe('KNITS00423-park bench dot');
      expect(dataAttributes['data-cnstrc-item-name']).toBe(
        'Jersey Riviera Shirt (Red Park Bench Dot)',
      );
      expect(dataAttributes['data-cnstrc-item-price']).toBe(90);
      expect(dataAttributes['data-cnstrc-item-variation-id']).toBe('BKT00110DG1733LR');
    });
  });
});
