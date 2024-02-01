import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  IBrowseParameters,
  SearchParameters,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import useCioClient from './useCioClient';
import useSearchResults from './useSearchResults';
import useBrowseResults from './useBrowseResults';

export type CioPlpConfigs = { apiKey?: string };
export type UseCioPlpHook = { cioClient: Nullable<ConstructorIOClient> };

type UseCioPlp = (configs: CioPlpConfigs) => UseCioPlpHook;

const useCioPlp: UseCioPlp = (configs) => {
  const { apiKey } = configs;
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const cioClient = useCioClient(apiKey);
  const useCustomSearchResults = (query: string, searchParams: SearchParameters) =>
    useSearchResults({ query, searchParams });
  const useCustomBrowseResults = (
    filterName: string,
    filterValue: string,
    browseParams: IBrowseParameters,
  ) => useBrowseResults(filterName, filterValue, { cioClient, browseParams });

  return {
    cioClient,
    useSearchResults: useCustomSearchResults,
    useBrowseResults: useCustomBrowseResults,
  };
};

export default useCioPlp;
