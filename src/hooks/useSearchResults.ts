import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useState } from 'react';
import { usePlpState } from '../PlpContext';
import { transformSearchResponse } from '../transformers';
import { PlpSearchResponse } from '../types';

export type UseSearchResultsConfigs = {
  cioClient?: ConstructorIOClient | null;
  searchParams?: SearchParameters;
};

export type UseSearchResultsReturn = {
  searchResults: PlpSearchResponse | null;
  handleSubmit: () => void;
};

/**
 * A React Hook to call to utilize Constructor.io Search
 * @param query Search Query
 * @param configs A configuration object
 * @param configs.cioClient A CioClient created by useCioClient. Required if called outside of the PlpContextProvider.
 * @param configs.searchParams Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
 */
export default function useSearchResults(
  query: string,
  configs: UseSearchResultsConfigs = {},
): UseSearchResultsReturn {
  const { cioClient, searchParams } = configs;
  const state = usePlpState();
  const [searchResponse, setSearchResponse] = useState<PlpSearchResponse | null>(null);

  const client = cioClient || state?.cioClient;
  if (!client) {
    throw new Error('CioClient required');
  }

  const handleSubmit = () => {
    client.search
      .getSearchResults(query, searchParams)
      .then((res) => setSearchResponse(transformSearchResponse(res)));
  };

  return { searchResults: searchResponse, handleSubmit };
}
