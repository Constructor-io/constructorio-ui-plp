import { useCioPlpContext } from '../PlpContext';
import { RequestConfigs } from '../types';

export default function useRequestConfigs(): RequestConfigs {
  const context = useCioPlpContext();
  if (!context) {
    throw new Error('This Hook needs to be called within the C.io PLP Context Provider.');
  }

  const { encoders, defaultRequestConfigs } = context;
  const { getUrl, getStateFromUrl } = encoders;

  const url = getUrl();
  const urlRequestConfigs = getStateFromUrl(url);

  const requestConfigs: RequestConfigs = { ...defaultRequestConfigs, ...urlRequestConfigs };

  if (!requestConfigs.filterValue || requestConfigs.filterValue === '') {
    delete requestConfigs.filterName;
    delete requestConfigs.filterValue;
  }

  return requestConfigs;
}
