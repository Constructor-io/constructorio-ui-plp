import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useReducer } from 'react';
import { transformSearchResponse } from '../utils/transformers';
import { PaginationObject, PlpSearchResponse } from '../types';
import {
  SearchStatus,
  searchReducer,
  SearchAction,
  SearchData,
} from '../components/SearchResults/searchReducer';
import usePagination from './usePagination';
import { useCioPlpContext } from '../PlpContext';

export type UseSearchResultsConfigs = {
  searchParams?: SearchParameters;
};

export interface UseSearchResultsReturn {
  status: SearchStatus;
  data: SearchData;
  pagination: PaginationObject;
  refetch: () => void;
}

const fetchSearchResults = async (
  client: ConstructorIOClient,
  query: string,
  searchParams: SearchParameters,
  dispatch: React.Dispatch<SearchAction>,
) => {
  dispatch({
    type: SearchStatus.FETCHING,
  });

  try {
    const res = await client.search.getSearchResults(query, searchParams);
    dispatch({
      type: SearchStatus.SUCCESS,
      payload: transformSearchResponse(res),
    });
  } catch (err) {
    if (err instanceof Error) {
      dispatch({
        type: SearchStatus.ERROR,
        payload: err.message,
      });
    }
  }
};

/**
 * A React Hook to call to utilize Constructor.io Search
 * @param query Search Query
 * @param configs A configuration object
 * @param configs.cioClient A CioClient created by useCioClient. Required if called outside of the CioPlpContext.
 * @param configs.searchParams Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
 * @returns {status, data, pagination, refetch}
 */
export default function useSearchResults(
  query: string,
  configs: UseSearchResultsConfigs = {},
  // Todo: utilize initial search response
  initialSearchResponse?: PlpSearchResponse,
): UseSearchResultsReturn {
  const { searchParams } = configs;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useSearchResults() must be used within a component that is a child of <CioPlpContext />',
    );
  }

  const { cioClient } = contextValue;

  const [state, dispatch] = useReducer(searchReducer, {
    status: SearchStatus.STALE,
    search: {
      rawApiResponse: null,
      request: null,
      response: null,
      redirect: null,
    },
  });

  const { search: data, status } = state;

  const pagination = usePagination({
    initialPage: data.request?.page,
    totalNumResults: data.response?.totalNumResults,
    resultsPerPage: data.response?.numResultsPerPage,
  });

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!cioClient && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (cioClient && query) {
      fetchSearchResults(
        cioClient,
        query,
        { ...searchParams, page: pagination.currentPage || searchParams?.page } || {},
        dispatch,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return {
    status,
    data,
    pagination,
    refetch: () => cioClient && fetchSearchResults(cioClient, query, searchParams || {}, dispatch),
  };
}
