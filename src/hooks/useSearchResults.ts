import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  SearchParameters,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import { useCioPlpContext } from '../PlpContext';
import { transformSearchResponse } from '../utils/transformers';
import { PaginationProps, PlpSearchResponse } from '../types';
import usePagination from '../components/Pagination/usePagination';

export type UseSearchResultsConfigs = {
  cioClient?: Nullable<ConstructorIOClient>;
  searchParams?: SearchParameters;
};

export type UseSearchResultsReturn = {
  searchResults: PlpSearchResponse | null;
  handleSubmit: () => void;
  pagination: PaginationProps;
};

/**
 * A React Hook to call to utilize Constructor.io Search
 * @param query Search Query
 * @param configs A configuration object
 * @param configs.cioClient A CioClient created by useCioClient. Required if called outside of the CioPlpContext.
 * @param configs.searchParams Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
 */
export default function useSearchResults(
  query: string,
  configs: UseSearchResultsConfigs = {},
  initialSearchResponse?: PlpSearchResponse,
): UseSearchResultsReturn {
  const { cioClient, searchParams } = configs;
  const state = useCioPlpContext();
  const client = cioClient || state?.cioClient;

  const [searchResponse, setSearchResponse] = useState<PlpSearchResponse | null>(
    initialSearchResponse || null,
  );
  const pagination = usePagination({
    initialPage: searchResponse?.rawResponse.request.page,
    totalNumResults: searchResponse?.totalNumResults,
    resultsPerPage: searchResponse?.numResultsPerPage,
  });

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!client && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const handleSubmit = () => {
    if (client) {
      client.search
        .getSearchResults(query, {
          ...searchParams,
          page: pagination.currentPage || searchParams?.page,
        })
        .then((res) => setSearchResponse(transformSearchResponse(res)));
    }
  };

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (query && client) {
      client.search
        .getSearchResults(query, {
          ...searchParams,
          page: pagination.currentPage || searchParams?.page,
        })
        .then((res) => setSearchResponse(transformSearchResponse(res)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return { searchResults: searchResponse, handleSubmit, pagination };
}
