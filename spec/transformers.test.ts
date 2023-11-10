import testItem from './local_examples/item.json';
import { transformResultItem } from '../src/utils/transformers';
import { ApiItem } from '../src/types';

describe('Testing Transformers: transformResultItem', () => {
  test('Should return all base properties as camelCased properties', () => {
    const apiItem = testItem as ApiItem;
    const item = transformResultItem(apiItem);

    expect(typeof item.itemName).toBe('string');
    expect(item.itemName).toBe(apiItem.value);

    expect(typeof item.matchedTerms).toBe('object');
    expect(item.matchedTerms).toBe(apiItem.matched_terms);

    expect(typeof item.isSlotted).toBe('boolean');
    expect(item.isSlotted).toBe(apiItem.is_slotted);

    expect(typeof item.labels).toBe('object');
    expect(item.labels).toBe(apiItem.labels);
  });

  test('Should return all flattened data properties as camelCased properties', () => {
    const apiItem = testItem as ApiItem;
    const item = transformResultItem(apiItem);

    expect(typeof item.itemId).toBe('string');
    expect(item.itemId).toBe(apiItem.data.id);

    expect(['string', 'undefined']).toContain(typeof item.description);
    expect(item.description).toBe(apiItem.data.description);

    expect(['string', 'undefined']).toContain(typeof item.url);
    expect(item.url).toBe(apiItem.data.url);

    expect(['string', 'undefined']).toContain(typeof item.imageUrl);
    expect(item.imageUrl).toBe(apiItem.data.image_url);

    expect(['object', 'undefined']).toContain(typeof item.groupIds);
    expect(item.groupIds).toBe(apiItem.data.group_ids);

    expect(['object', 'undefined']).toContain(typeof item.groups);
    expect(item.groups).toBe(apiItem.data.groups);

    expect(['object', 'undefined']).toContain(typeof item.facets);
    expect(item.facets).toBe(apiItem.data.facets);

    expect(['string', 'undefined']).toContain(typeof item.variationId);
    expect(item.variationId).toBe(apiItem.data.variation_id);
  });

  test('Should return a raw response property by default', () => {
    const apiItem = testItem as ApiItem;
    const item = transformResultItem(apiItem, true);

    expect(item.rawResponse).not.toBeFalsy();
    expect(item.rawResponse).toBe(apiItem);
  });

  test('Should not return a raw response when includeRaw = false', () => {
    const apiItem = testItem as ApiItem;
    const item = transformResultItem(apiItem, false);

    expect(item.rawResponse).toBeFalsy();
  });

  test('Should return remaining parameters in the .data property', () => {
    const apiItem = testItem as ApiItem;
    const item = transformResultItem(apiItem, false);

    expect(item.data.price).toBe(apiItem.data.price);
    expect(item.data.altPrice).toBe(apiItem.data.altPrice);
    expect(item.data.sale_price).toBe(apiItem.data.sale_price);
  });
});
