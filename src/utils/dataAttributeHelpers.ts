import {
  RequestConfigs,
  PlpSearchDataResults,
  PlpSearchDataRedirect,
  PlpBrowseData,
  CnstrcDataAttrs,
  ProductInfoObject,
} from '../types';
import { isPlpBrowseDataResults, isPlpSearchDataResults } from './typeHelpers';
import { getPageType } from './requestConfigsHelpers';

export interface ProductCardDataAttributeOptions {
  labels?: {
    sl_campaign_id?: string | number;
    sl_campaign_owner?: string | number;
  };
}

export const cnstrcDataAttrs = {
  common: {
    itemId: 'data-cnstrc-item-id',
    itemName: 'data-cnstrc-item-name',
    itemPrice: 'data-cnstrc-item-price',
    variationId: 'data-cnstrc-item-variation-id',
    numResults: 'data-cnstrc-num-results',
    conversionBtn: 'data-cnstrc-btn',
    resultId: 'data-cnstrc-result-id',
    section: 'data-cnstrc-section',
    zeroResults: 'data-cnstrc-zero-result',
    slCampaignId: 'data-cnstrc-sl-campaign-id',
    slCampaignOwner: 'data-cnstrc-sl-campaign-owner',
  },
  search: {
    searchContainer: 'data-cnstrc-search',
    searchTerm: 'data-cnstrc-search-term',
  },
  browse: {
    browseContainer: 'data-cnstrc-browse',
    filterName: 'data-cnstrc-filter-name',
    filterValue: 'data-cnstrc-filter-value',
  },
};

export function getProductCardCnstrcDataAttributes(
  productInfo: ProductInfoObject,
  options?: ProductCardDataAttributeOptions,
) {
  const { itemId, itemPrice, itemName, variationId } = productInfo;

  const dataCnstrc: CnstrcDataAttrs = {
    [cnstrcDataAttrs.common.itemId]: itemId,
    [cnstrcDataAttrs.common.itemName]: itemName,
  };

  // Only include variation ID if it exists
  if (variationId) {
    dataCnstrc[cnstrcDataAttrs.common.variationId] = variationId;
  }

  // Only include price if it exists
  if (itemPrice !== undefined && itemPrice !== null) {
    dataCnstrc[cnstrcDataAttrs.common.itemPrice] = itemPrice;
  }

  // Add sponsored listing data if available
  if (options?.labels?.sl_campaign_id) {
    dataCnstrc[cnstrcDataAttrs.common.slCampaignId] = String(options.labels.sl_campaign_id);
  }

  if (options?.labels?.sl_campaign_owner) {
    dataCnstrc[cnstrcDataAttrs.common.slCampaignOwner] = String(options.labels.sl_campaign_owner);
  }

  return dataCnstrc;
}

export function getPlpContainerCnstrcDataAttributes(
  data: PlpSearchDataResults | PlpSearchDataRedirect | PlpBrowseData | null,
  requestConfigs: RequestConfigs,
  isLoading: boolean = false,
) {
  if (!data || (!isPlpSearchDataResults(data) && !isPlpBrowseDataResults(data))) return {};

  const { filterName, filterValue } = requestConfigs;
  const pageType = getPageType(requestConfigs);
  const isZeroResults = data.response.totalNumResults === 0;
  let dataCnstrc: CnstrcDataAttrs = {};

  switch (pageType) {
    case 'browse':
      dataCnstrc = {
        [cnstrcDataAttrs.browse.browseContainer]: true,
        [cnstrcDataAttrs.common.numResults]: data.response.totalNumResults,
        [cnstrcDataAttrs.common.resultId]: data.resultId,
        [cnstrcDataAttrs.browse.filterName]: filterName!,
        [cnstrcDataAttrs.browse.filterValue]: filterValue!,
      };
      break;

    case 'search':
      dataCnstrc = {
        [cnstrcDataAttrs.search.searchContainer]: true,
        [cnstrcDataAttrs.common.resultId]: data.resultId,
        [cnstrcDataAttrs.common.numResults]: data.response.totalNumResults,
      };

      // Add search term
      if (data.request?.term) {
        dataCnstrc[cnstrcDataAttrs.search.searchTerm] = data.request.term;
      }
      break;

    case 'unknown':
      dataCnstrc = {};
      break;

    default:
      break;
  }

  // Add common conditional attributes (applies to both search and browse)
  if (pageType === 'search' || pageType === 'browse') {
    // Add zero-result attribute only if not loading and there are no results
    if (isZeroResults && !isLoading) {
      dataCnstrc[cnstrcDataAttrs.common.zeroResults] = true;
    }

    // Add section if it's not "Products"
    if (data.request?.section && data.request.section !== 'Products') {
      dataCnstrc[cnstrcDataAttrs.common.section] = data.request.section;
    }
  }

  return dataCnstrc;
}

export type ConversionType =
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'like'
  | 'message'
  | 'make_offer'
  | 'read'
  | string;

export function getConversionButtonCnstrcDataAttributes(conversionType: ConversionType) {
  return {
    [cnstrcDataAttrs.common.conversionBtn]: conversionType,
  };
}
