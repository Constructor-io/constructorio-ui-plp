import { useCioPlpContext } from '../PlpContext';
import { RequestConfigs } from '../types';

export default function useRequestConfigs(): RequestConfigs {
  const context = useCioPlpContext();
  if (!context) {
    throw new Error('This Hook needs to be called within the C.io PLP Context Provider.');
  }

  const { encoders, defaultRequestConfigs } = context;
  const { getUrl, decodeStateFromUrlQueryParams, getBrowseStateFromPath } = encoders;

  const url = getUrl();
  const { filterName, filterValue } = getBrowseStateFromPath(url) || {};
  const urlRequestConfigs = decodeStateFromUrlQueryParams(url);

  const requestConfigs: RequestConfigs = { ...defaultRequestConfigs, ...urlRequestConfigs };
  if (filterName && filterValue) {
    requestConfigs.filterName = filterName;
    requestConfigs.filterValue = filterValue;
  }

  return requestConfigs;
}
