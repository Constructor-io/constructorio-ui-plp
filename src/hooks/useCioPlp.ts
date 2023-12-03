import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  SearchParameters,
  ConstructorClientOptions,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { Nullable } from '../types';
import useCioClient from './useCioClient';
import useSearchResults from './useSearchResults';

export type UseCioPlpHook = { cioClient: Nullable<ConstructorIOClient> };

type UseCioPlp = (configs: ConstructorClientOptions) => UseCioPlpHook;

const useCioPlp: UseCioPlp = (configs) => {
  const { apiKey } = configs;
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const cioClient = useCioClient(configs);
  const useCustomSearchResults = (query: string, searchParams: SearchParameters) =>
    useSearchResults(query, { cioClient, searchParams });

  return {
    cioClient,
    useSearchResults: useCustomSearchResults,
  };
};

export default useCioPlp;
