import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import { usePlpContext } from '../PlpContext';
import { transformSearchResponse } from '../utils/transformers';
import { PlpSearchResponse } from '../types';
import usePagination from './usePagination';

export type UseSearchResultsConfigs = {
  cioClient?: ConstructorIOClient | null;
  searchParams?: SearchParameters;
};

export type UseSearchResultsReturn = {
  searchResults: PlpSearchResponse | null;
  handleSubmit: () => void;
  pagination: ReturnType<typeof usePagination>;
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

  const state = usePlpContext();
  const [searchResponse, setSearchResponse] = useState<PlpSearchResponse | null>(null);
  const pagination = usePagination(searchResponse);

  const client = cioClient || state?.cioClient;
  if (!client) {
    throw new Error('CioClient required');
  }

  const handleSubmit = () => {
    client.search
      .getSearchResults(query, { ...searchParams, page: pagination.currentPage })
      .then((res) => setSearchResponse(transformSearchResponse(res)));
  };

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (query) {
      client.search
        .getSearchResults(query, { ...searchParams, page: pagination.currentPage })
        .then((res) => setSearchResponse(transformSearchResponse(res)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return { searchResults: searchResponse, handleSubmit, pagination };
}
