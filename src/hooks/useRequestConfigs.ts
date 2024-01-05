import { useCioPlpContext } from '../PlpContext';
import { RequestConfigs } from '../types';

export default function useRequestConfigs(): RequestConfigs {
  const context = useCioPlpContext();
  if (!context) {
    throw new Error('This Hook needs to be called within the C.io PLP Context Provider.');
  }

  const { encoders, defaultRequestConfigs } = context;
  const { getUrl, decodeStateFromUrl } = encoders;

  const urlRequestConfigs = decodeStateFromUrl(getUrl());
  return { ...defaultRequestConfigs, ...urlRequestConfigs };
}
