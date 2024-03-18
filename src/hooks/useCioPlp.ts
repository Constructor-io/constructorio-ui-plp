import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  IBrowseParameters,
  SearchParameters,
  Nullable,
  ConstructorClientOptions,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import useCioClient from './useCioClient';
import useSearchResults from './useSearchResults';
import useBrowseResults from './useBrowseResults';

export type CioPlpConfigs = {
  apiKey?: string;
  cioClient?: Nullable<ConstructorIOClient>;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
};
export type UseCioPlpHook = { cioClient: Nullable<ConstructorIOClient> };

type UseCioPlp = (configs: CioPlpConfigs) => UseCioPlpHook;

const useCioPlp: UseCioPlp = (configs) => {
  const { apiKey, cioClient: customClient, options } = configs;
  if (!apiKey) {
    throw new Error('Api Key or Constructor Client required');
  }

  const cioClient = useCioClient({ apiKey, cioClient: customClient, options });

  return {
    cioClient,
  };
};

export default useCioPlp;
