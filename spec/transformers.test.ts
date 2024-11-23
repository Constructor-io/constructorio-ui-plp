import testItem from './local_examples/item.json';
import testRequest from './local_examples/apiSearchResponse.json';
import { transformResponseFacets, transformResultItem } from '../src/utils/transformers';
import {
  ApiFacet,
  ApiHierarchicalFacetOption,
  ApiItem,
  PlpFacetOption,
  PlpHierarchicalFacetOption,
} from '../src/types';
import { isHierarchicalFacet, isOptionFacet, isRangeFacet } from '../src/utils';

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

describe('Testing Transformers: transformResponseFacets', () => {
  test('Should return all base properties as camelCased properties', () => {
    const apiFacets = testRequest.response.facets as ApiFacet[];
    const facets = transformResponseFacets(apiFacets);

    expect(facets.length).toBe(apiFacets.length);

    facets.forEach((facet, i) => {
      const apiFacet = apiFacets[i];

      expect(typeof facet.displayName).toBe('string');
      expect(facet.displayName).toBe(apiFacet.display_name);

      expect(typeof facet.name).toBe('string');
      expect(facet.name).toBe(apiFacet.name);

      expect(typeof facet.hidden).toBe('boolean');
      expect(facet.hidden).toBe(apiFacet.hidden);

      expect(typeof facet.data).toBe('object');
      expect(facet.data).toEqual(apiFacet.data);

      expect(typeof facet.type).toBe('string');
      expect(facet.type).toBe(apiFacet.type);

      expect(Object.keys(facet).length).toBe(Object.keys(apiFacet).length);

      if (isRangeFacet(facet)) {
        expect(facet.type).toBe('range');

        expect(typeof facet.min).toBe('number');
        expect(facet.min).toBe(apiFacet.min);

        expect(typeof facet.max).toBe('number');
        expect(facet.max).toBe(apiFacet.max);

        expect(facet.status).toBe(apiFacet.status);
      }

      if (isOptionFacet(facet)) {
        expect(['multiple', 'single', 'hierarchical'].includes(facet.type)).toBeTruthy();

        expect(typeof facet.options).toBe('object');
      }

      if (isHierarchicalFacet(facet)) {
        expect(facet.type).toBe('hierarchical');
        expect(typeof facet.options).toBe('object');
      }
    });
  });

  test('Should return all facet options and their respective fields', () => {
    const apiFacets = testRequest.response.facets as ApiFacet[];
    const facets = transformResponseFacets(apiFacets);

    function testFacetOptions(
      transformedFacetOptions: Array<PlpFacetOption>,
      apiFacetOptions: Array<ApiHierarchicalFacetOption>,
    ) {
      transformedFacetOptions.forEach((facetOption, j) => {
        const apiFacetOption = apiFacetOptions[j];

        expect(typeof facetOption.displayName).toBe('string');
        expect(facetOption.displayName).toBe(apiFacetOption.display_name);

        expect(typeof facetOption.value).toBe('string');
        expect(facetOption.value).toBe(apiFacetOption.value);

        expect(typeof facetOption.count).toBe('number');
        expect(facetOption.count).toBe(apiFacetOption.count);

        expect(typeof facetOption.status).toBe('string');
        expect(facetOption.status).toBe(apiFacetOption.status);

        expect(Object.keys(facetOption).length).toBe(Object.keys(apiFacetOption).length);

        if (facetOption.options) {
          const {
            options: secondLevelOptions,
            data: { parentValue, ...otherDataFields },
          } = facetOption as PlpHierarchicalFacetOption;
          const {
            options: secondLevelRawOptions,
            data: { parent_value: rawParentValue, ...otherRawDataFields },
          } = apiFacetOption;

          expect(typeof secondLevelOptions).toBe('object');
          expect(secondLevelOptions.length).toBe(secondLevelRawOptions?.length);
          expect(parentValue).toBe(rawParentValue);
          expect(otherDataFields).toEqual(otherRawDataFields);

          testFacetOptions(
            facetOption.options,
            apiFacetOption.options as Array<ApiHierarchicalFacetOption>,
          );
        } else {
          expect(typeof facetOption.data).toBe('object');
          expect(facetOption.data).toEqual(apiFacetOption.data);
        }
      });
    }

    facets.forEach((facet, i) => {
      if (isOptionFacet(facet)) {
        expect(facet.options.length).toBe(apiFacets[i].options.length);
        testFacetOptions(facet.options, apiFacets[i].options);
      }
    });
  });
});
