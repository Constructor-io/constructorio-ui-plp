import { waitFor } from '@testing-library/react';
import {
  transformResultItem,
  transformSearchResponse,
  transformBrowseResponse,
  getProductCardCnstrcDataAttributes,
  getPlpContainerCnstrcDataAttributes,
  getConversionButtonCnstrcDataAttributes,
} from '../src/utils';
import useProductInfo from '../src/hooks/useProduct';
import mockItem from './local_examples/item.json';
import mockApiSearchResponse from './local_examples/apiSearchResponse.json';
import mockApiBrowseResponse from './local_examples/apiBrowseResponse.json';
import { renderHookWithCioPlp } from './test-utils';
import { RequestConfigs } from '../src';

const transformedItem = transformResultItem(mockItem);

describe('Testing Utils, getProductCardCnstrcDataAttributes', () => {
  test('Should return relevant data attributes for Product Card', async () => {
    const { result } = renderHookWithCioPlp(() => useProductInfo({ item: transformedItem }));

    await waitFor(() => {
      const dataAttributes = getProductCardCnstrcDataAttributes(result.current, transformedItem);

      expect(dataAttributes['data-cnstrc-item-id']).toBe('KNITS00423-park bench dot');
      expect(dataAttributes['data-cnstrc-item-name']).toBe(
        'Jersey Riviera Shirt (Red Park Bench Dot)',
      );
      expect(dataAttributes['data-cnstrc-item-price']).toBe(90);
      expect(dataAttributes['data-cnstrc-item-variation-id']).toBe('BKT00110DG1733LR');
    });
  });

  test('Should include sponsored listing data attributes when available', async () => {
    const mockItemWithSponsoredData = {
      ...transformedItem,
      labels: {
        sl_campaign_id: 'campaign-123',
        sl_campaign_owner: 'owner-456',
      },
    };

    const { result } = renderHookWithCioPlp(() =>
      useProductInfo({ item: mockItemWithSponsoredData }),
    );

    await waitFor(() => {
      const dataAttributes = getProductCardCnstrcDataAttributes(
        result.current,
        mockItemWithSponsoredData,
      );

      expect(dataAttributes['data-cnstrc-sl-campaign-id']).toBe('campaign-123');
      expect(dataAttributes['data-cnstrc-sl-campaign-owner']).toBe('owner-456');
    });
  });

  test('Should not include price if not provided', () => {
    const mockProductInfo = {
      itemId: 'test-id',
      itemName: 'Test Product',
    };

    const dataAttributes = getProductCardCnstrcDataAttributes(mockProductInfo);

    expect(dataAttributes['data-cnstrc-item-price']).toBeUndefined();
  });

  test('Should not include variation ID if not provided', () => {
    const mockProductInfo = {
      itemId: 'test-id',
      itemName: 'Test Product',
      itemPrice: 50,
    };

    const dataAttributes = getProductCardCnstrcDataAttributes(mockProductInfo);

    expect(dataAttributes['data-cnstrc-item-variation-id']).toBeUndefined();
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

    expect(dataAttributes['data-cnstrc-search']).toBe(true);
    expect(dataAttributes['data-cnstrc-result-id']).toBe(mockSearchData.resultId);
    expect(dataAttributes['data-cnstrc-num-results']).toBe(mockSearchData.response.totalNumResults);
    expect(dataAttributes['data-cnstrc-term']).toBe('shoes');
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

    expect(dataAttributes['data-cnstrc-browse']).toBe(true);
    expect(dataAttributes['data-cnstrc-result-id']).toBe(mockBrowseData.resultId);
    expect(dataAttributes['data-cnstrc-num-results']).toBe(mockBrowseData.response.totalNumResults);
    expect(dataAttributes['data-cnstrc-filter-name']).toBe('group_id');
    expect(dataAttributes['data-cnstrc-filter-value']).toBe('All');
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

    expect(dataAttributes['data-cnstrc-zero-result']).toBe(true);
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

    expect(dataAttributes['data-cnstrc-zero-result']).toBeUndefined();
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

    expect(dataAttributes['data-cnstrc-section']).toBe('Search Suggestions');
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

    expect(dataAttributes['data-cnstrc-section']).toBeUndefined();
  });
});

describe('Testing Utils, getConversionButtonCnstrcDataAttributes', () => {
  test('Should return add_to_cart conversion type', () => {
    const dataAttributes = getConversionButtonCnstrcDataAttributes('add_to_cart');
    expect(dataAttributes['data-cnstrc-btn']).toBe('add_to_cart');
  });
});
