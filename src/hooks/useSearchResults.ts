import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useReducer } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { transformSearchResponse } from '../utils/transformers';
import { PaginationObject } from '../types';
import {
  SearchStatus,
  searchReducer,
  SearchAction,
  SearchData,
} from '../components/SearchResults/searchReducer';
import usePagination from './usePagination';

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

  const pagination = usePagination(data.response, data.request);

  if (!cioClient) {
    throw new Error('CioClient required');
  }

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (query) {
      fetchSearchResults(cioClient, query, searchParams || {}, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return {
    status,
    data,
    pagination,
    refetch: () => fetchSearchResults(cioClient, query, searchParams || {}, dispatch),
  };
}
