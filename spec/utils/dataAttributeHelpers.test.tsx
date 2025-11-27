import { waitFor } from '@testing-library/react';
import {
  transformResultItem,
  transformSearchResponse,
  transformBrowseResponse,
  getProductCardCnstrcDataAttributes,
  getPlpContainerCnstrcDataAttributes,
  getConversionButtonCnstrcDataAttributes,
  cnstrcDataAttrs,
} from '../../src/utils';
import useProductInfo from '../../src/hooks/useProduct';
import mockItem from '../local_examples/item.json';
import mockApiSearchResponse from '../local_examples/apiSearchResponse.json';
import mockApiBrowseResponse from '../local_examples/apiBrowseResponse.json';
import { renderHookWithCioPlp } from '../test-utils';
import { RequestConfigs } from '../../src/types';

const transformedItem = transformResultItem(mockItem);

describe('Testing Utils, getProductCardCnstrcDataAttributes', () => {
  test('Should return relevant data attributes for Product Card', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const dataAttributes = getProductCardCnstrcDataAttributes(result.current, {
        labels: transformedItem.labels,
      });

      expect(dataAttributes[cnstrcDataAttrs.common.itemId]).toBe('KNITS00423-park bench dot');
      expect(dataAttributes[cnstrcDataAttrs.common.itemName]).toBe(
        'Jersey Riviera Shirt (Red Park Bench Dot)',
      );
      expect(dataAttributes[cnstrcDataAttrs.common.itemPrice]).toBe(90);
      expect(dataAttributes[cnstrcDataAttrs.common.variationId]).toBe('BKT00110DG1733LR');
    });
  });

  test('Should include sponsored listing data attributes when available', () => {
    const mockProductInfo = {
      itemId: 'test-id',
      itemName: 'Test Product',
      itemPrice: 100,
      variationId: 'var-123',
    };

    const dataAttributes = getProductCardCnstrcDataAttributes(mockProductInfo, {
      labels: {
        sl_campaign_id: 'campaign-123',
        sl_campaign_owner: 'owner-456',
      },
    });

    expect(dataAttributes[cnstrcDataAttrs.common.slCampaignId]).toBe('campaign-123');
    expect(dataAttributes[cnstrcDataAttrs.common.slCampaignOwner]).toBe('owner-456');
  });

  test('Should only include optional attributes when provided', () => {
    const mockProductInfoWithoutOptionals = {
      itemId: 'test-id',
      itemName: 'Test Product',
    };

    const dataAttributesWithoutOptionals = getProductCardCnstrcDataAttributes(
      mockProductInfoWithoutOptionals,
    );

    expect(dataAttributesWithoutOptionals[cnstrcDataAttrs.common.itemPrice]).toBeUndefined();
    expect(dataAttributesWithoutOptionals[cnstrcDataAttrs.common.variationId]).toBeUndefined();

    const mockProductInfoWithOptionals = {
      itemId: 'test-id',
      itemName: 'Test Product',
      itemPrice: 50,
      variationId: 'var-123',
    };

    const dataAttributesWithOptionals = getProductCardCnstrcDataAttributes(
      mockProductInfoWithOptionals,
    );

    expect(dataAttributesWithOptionals[cnstrcDataAttrs.common.itemPrice]).toBe(50);
    expect(dataAttributesWithOptionals[cnstrcDataAttrs.common.variationId]).toBe('var-123');
  });
});

describe('Testing Utils, getPlpContainerCnstrcDataAttributes', () => {
  test('Should return search data attributes', () => {
    const mockSearchData = transformSearchResponse(mockApiSearchResponse as never);
    if (!mockSearchData || !('response' in mockSearchData)) {
      throw new Error('Failed to transform search response');
    }

    const mockRequestConfigs: RequestConfigs = {
      query: 'shoes',
    };

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockSearchData,
      mockRequestConfigs,
      false,
    );

    expect(dataAttributes[cnstrcDataAttrs.search.searchContainer]).toBe(true);
    expect(dataAttributes[cnstrcDataAttrs.common.resultId]).toBe(mockSearchData.resultId);
    expect(dataAttributes[cnstrcDataAttrs.common.numResults]).toBe(
      mockSearchData.response.totalNumResults,
    );
    expect(dataAttributes[cnstrcDataAttrs.search.searchTerm]).toBe('shoes');
  });

  test('Should return browse data attributes', () => {
    const mockBrowseData = transformBrowseResponse(mockApiBrowseResponse as never);
    if (!mockBrowseData) {
      throw new Error('Failed to transform browse response');
    }

    const mockRequestConfigs: RequestConfigs = {
      filterName: 'group_id',
      filterValue: 'All',
    };

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockBrowseData,
      mockRequestConfigs,
      false,
    );

    expect(dataAttributes[cnstrcDataAttrs.browse.browseContainer]).toBe(true);
    expect(dataAttributes[cnstrcDataAttrs.common.resultId]).toBe(mockBrowseData.resultId);
    expect(dataAttributes[cnstrcDataAttrs.common.numResults]).toBe(
      mockBrowseData.response.totalNumResults,
    );
    expect(dataAttributes[cnstrcDataAttrs.browse.filterName]).toBe('group_id');
    expect(dataAttributes[cnstrcDataAttrs.browse.filterValue]).toBe('All');
  });

  test('Should include zero-result attribute when no results and not loading', () => {
    const mockZeroResultsResponse = {
      ...mockApiSearchResponse,
      response: {
        ...mockApiSearchResponse.response,
        total_num_results: 0,
        results: [],
      },
    };
    const mockSearchData = transformSearchResponse(mockZeroResultsResponse as never);

    const mockRequestConfigs: RequestConfigs = {
      query: 'shoes',
    };

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockSearchData,
      mockRequestConfigs,
      false,
    );

    expect(dataAttributes[cnstrcDataAttrs.common.zeroResults]).toBe(true);
  });

  test('Should not include zero-result attribute when loading', () => {
    const mockZeroResultsResponse = {
      ...mockApiSearchResponse,
      response: {
        ...mockApiSearchResponse.response,
        total_num_results: 0,
        results: [],
      },
    };
    const mockSearchData = transformSearchResponse(mockZeroResultsResponse as never);

    const mockRequestConfigs: RequestConfigs = {};

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockSearchData,
      mockRequestConfigs,
      true,
    );

    expect(dataAttributes[cnstrcDataAttrs.common.zeroResults]).toBeUndefined();
  });

  test('Should include section attribute when section is not Products', () => {
    const mockResponseWithSection = {
      ...mockApiSearchResponse,
      request: {
        ...mockApiSearchResponse.request,
        section: 'Search Suggestions',
      },
    };
    const mockSearchData = transformSearchResponse(mockResponseWithSection as never);

    const mockRequestConfigs: RequestConfigs = {
      query: 'test',
    };

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockSearchData,
      mockRequestConfigs,
      false,
    );

    expect(dataAttributes[cnstrcDataAttrs.common.section]).toBe('Search Suggestions');
  });

  test('Should not include section attribute when section is Products', () => {
    const mockSearchData = transformSearchResponse(mockApiSearchResponse as never);

    const mockRequestConfigs: RequestConfigs = {
      query: 'test',
    };

    const dataAttributes = getPlpContainerCnstrcDataAttributes(
      mockSearchData,
      mockRequestConfigs,
      false,
    );

    expect(dataAttributes[cnstrcDataAttrs.common.section]).toBeUndefined();
  });
});

describe('Testing Utils, getConversionButtonCnstrcDataAttributes', () => {
  test('Should return add_to_cart conversion type', () => {
    const dataAttributes = getConversionButtonCnstrcDataAttributes('add_to_cart');
    expect(dataAttributes[cnstrcDataAttrs.common.conversionBtn]).toBe('add_to_cart');
  });
});
