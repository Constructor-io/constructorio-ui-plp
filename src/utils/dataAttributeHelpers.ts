import {
  RequestConfigs,
  PlpSearchDataResults,
  PlpSearchDataRedirect,
  PlpBrowseData,
  CnstrcData,
  ProductInfoObject,
  Item,
} from '../types';
import { isPlpBrowseDataResults, isPlpSearchDataResults } from './typeHelpers';
import { getPageType } from './requestConfigsHelpers';

export function getProductCardCnstrcDataAttributes(productInfo: ProductInfoObject, item?: Item) {
  let dataCnstrc: CnstrcData = {};

  const { itemId, itemPrice, itemName, variationId } = productInfo;

  dataCnstrc = {
    'data-cnstrc-item-id': itemId,
    'data-cnstrc-item-name': itemName,
  };

  // Only include variation ID if it exists
  if (variationId) {
    dataCnstrc['data-cnstrc-item-variation-id'] = variationId;
  }

  // Only include price if it exists and there's a CTA button
  if (itemPrice !== undefined && itemPrice !== null) {
    dataCnstrc['data-cnstrc-item-price'] = itemPrice;
  }

  // Add sponsored listing data if available
  if (item?.labels?.sl_campaign_id) {
    dataCnstrc['data-cnstrc-sl-campaign-id'] = String(item.labels.sl_campaign_id);
  }

  if (item?.labels?.sl_campaign_owner) {
    dataCnstrc['data-cnstrc-sl-campaign-owner'] = String(item.labels.sl_campaign_owner);
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
  let dataCnstrc: Record<`data-cnstrc-${string}`, string | number | boolean> = {};
  const isZeroResults = data.response.totalNumResults === 0;

  switch (pageType) {
    case 'browse':
      dataCnstrc = {
        'data-cnstrc-browse': true,
        'data-cnstrc-num-results': data.response.totalNumResults,
        'data-cnstrc-result-id': data.resultId,
        'data-cnstrc-filter-name': filterName!,
        'data-cnstrc-filter-value': filterValue!,
      };
      break;

    case 'search':
      dataCnstrc = {
        'data-cnstrc-search': true,
        'data-cnstrc-result-id': data.resultId,
        'data-cnstrc-num-results': data.response.totalNumResults,
      };

      // Add search term
      if (data.request?.term) {
        dataCnstrc['data-cnstrc-term'] = data.request.term;
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
      dataCnstrc['data-cnstrc-zero-result'] = true;
    }

    // Add section if it's not "Products"
    if (data.request?.section && data.request.section !== 'Products') {
      dataCnstrc['data-cnstrc-section'] = data.request.section;
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
    'data-cnstrc-btn': conversionType,
  };
}
