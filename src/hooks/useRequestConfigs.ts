import { useCioPlpContext } from './useCioPlpContext';
import { RequestConfigs } from '../types';

export default function useRequestConfigs(): RequestConfigs {
  const context = useCioPlpContext();
  if (!context) {
    throw new Error('This Hook needs to be called within the C.io PLP Context Provider.');
  }

  const { urlHelpers, staticRequestConfigs } = context;
  const { getUrl, getStateFromUrl } = urlHelpers;

  const url = getUrl();
  const urlRequestConfigs = url ? getStateFromUrl(url) : {};

  const requestConfigs: RequestConfigs = { ...staticRequestConfigs, ...urlRequestConfigs };

  if (!requestConfigs.filterValue || requestConfigs.filterValue === '') {
    delete requestConfigs.filterName;
    delete requestConfigs.filterValue;
  }

  return requestConfigs;
}
