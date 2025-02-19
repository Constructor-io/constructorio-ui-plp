import { useCioPlpContext } from './useCioPlpContext';
import { RequestConfigs } from '../types';

interface UseRequestConfigsReturn {
  getRequestConfigs: () => RequestConfigs;
  setRequestConfigs: (configsToUpdate: Partial<RequestConfigs>) => void;
}

export default function useRequestConfigs(): UseRequestConfigsReturn {
  const context = useCioPlpContext();
  if (!context) {
    throw new Error('This Hook needs to be called within the Constructor PLP Context Provider.');
  }

  const { urlHelpers, staticRequestConfigs } = context;
  const { getUrl, setUrl, getStateFromUrl, getUrlFromState } = urlHelpers;

  const getRequestConfigs = () => {
    const url = getUrl();
    const urlRequestConfigs = url ? getStateFromUrl(url) : {};
    const page = urlRequestConfigs?.page || staticRequestConfigs?.page || 1;

    const requestConfigs: RequestConfigs = { ...staticRequestConfigs, ...urlRequestConfigs, page };

    if (!requestConfigs.filterValue || requestConfigs.filterValue === '') {
      delete requestConfigs.filterName;
      delete requestConfigs.filterValue;
    }

    return requestConfigs;
  };

  const setRequestConfigs = (configsToUpdate: Partial<RequestConfigs>) => {
    const oldUrl = getUrl();
    if (!oldUrl) {
      throw new Error('getUrl returns undefined when attempting to call setRequestConfigs');
    }

    const urlObj = new URL(oldUrl);
    const oldRequestConfigs = oldUrl ? getStateFromUrl(oldUrl) : {};
    const newRequestConfigs = { ...oldRequestConfigs, ...configsToUpdate };
    const newUrl = getUrlFromState(newRequestConfigs, { url: urlObj });

    setUrl(newUrl);
  };

  return { getRequestConfigs, setRequestConfigs };
}
