import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import { usePlpContext } from '../PlpContext';
import { transformSearchResponse } from '../utils/transformers';
import { PlpSearchResponse, Nullable } from '../types';

export type UseSearchResultsConfigs = {
  cioClient: Nullable<ConstructorIOClient>;
  searchParams?: SearchParameters;
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
  configs: UseSearchResultsConfigs,
): PlpSearchResponse | null {
  const { cioClient, searchParams } = configs;
  const state = usePlpContext();
  const client = cioClient || state?.cioClient;

  const [searchResponse, setSearchResponse] = useState<PlpSearchResponse | null>(null);
  useEffect(() => {
    // This should be checked only on the client side. It's ok for the server to not have a client.
    if (!client) {
      throw new Error('CioClient required');
    }

    client.search
      .getSearchResults(query, searchParams)
      .then((res) => setSearchResponse(transformSearchResponse(res)));
  }, [client, query, searchParams]);

  return searchResponse;
}
