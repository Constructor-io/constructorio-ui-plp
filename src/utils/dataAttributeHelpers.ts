import {
  RequestConfigs,
  PlpSearchDataResults,
  PlpSearchDataRedirect,
  PlpBrowseData,
  CnstrcData,
  ProductInfoObject,
} from '../types';
import { isPlpBrowseDataResults, isPlpSearchDataResults } from './typeHelpers';
import { getPageType } from './requestConfigsHelpers';

export function getProductCardCnstrcDataAttributes(productInfo: ProductInfoObject) {
  let dataCnstrc: CnstrcData = {};

  const { itemId, itemPrice, itemName, variationId } = productInfo;

  dataCnstrc = {
    'data-cnstrc-item-id': itemId,
    'data-cnstrc-item-name': itemName,
    'data-cnstrc-item-price': itemPrice!,
    'data-cnstrc-item-variation-id': variationId!,
  };

  return dataCnstrc;
}

export function getPlpContainerCnstrcDataAttributes(
  data: PlpSearchDataResults | PlpSearchDataRedirect | PlpBrowseData | null,
  requestConfigs: RequestConfigs,
) {
  if (!data || (!isPlpSearchDataResults(data) && !isPlpBrowseDataResults(data))) return {};

  const { filterName, filterValue } = requestConfigs;
  const pageType = getPageType(requestConfigs);
  let dataCnstrc: Record<`data-cnstrc-${string}`, string | number | boolean> = {};

  switch (pageType) {
    case 'browse':
      dataCnstrc = {
        'data-cnstrc-browse': true,
        'data-cnstrc-num-results': data.response.totalNumResults,
        'data-cnstrc-filter-name': filterName!,
        'data-cnstrc-filter-value': filterValue!,
      };
      break;

    case 'search':
      dataCnstrc = {
        'data-cnstrc-search': true,
        'data-cnstrc-num-results': data.response.totalNumResults,
      };
      break;

    case 'unknown':
      dataCnstrc = {};
      break;

    default:
      break;
  }

  return dataCnstrc;
}
