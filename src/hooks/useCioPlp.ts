import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useCioClient from './useCioClient';
import useSearchPlp from './useSearchPlp';

export type CioPlpConfigs = { apiKey?: string };
export type UseCioPlpHook = { cioClient: ConstructorIOClient };

type UseCioPlp = (configs: CioPlpConfigs) => UseCioPlpHook;

const useCioPlp: UseCioPlp = (configs) => {
  const { apiKey } = configs;
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const cioClient = useCioClient(apiKey);
  const useCustomSearchPlp = (query: string, searchParams: SearchParameters) =>
    useSearchPlp(query, { cioClient, searchParams });

  return {
    cioClient,
    useSearchPlp: useCustomSearchPlp,
  };
};

export default useCioPlp;
