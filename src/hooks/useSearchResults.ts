import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useReducer } from 'react';
import { transformSearchResponse } from '../utils/transformers';
import { PaginationObject, PlpSearchRedirectResponse, PlpSearchResponse } from '../types';
import {
  RequestStatus,
  searchReducer,
  SearchAction,
  SearchData,
  initialState,
  initFunction,
} from '../components/SearchResults/reducer';
import { useCioPlpContext } from './useCioPlpContext';
import usePagination from '../components/Pagination/usePagination';

export interface UseSearchResultsProps {
  query: string;
  searchParams?: SearchParameters;
  initialSearchResponse?: PlpSearchResponse | PlpSearchRedirectResponse;
}

export interface UseSearchResultsReturn {
  status: RequestStatus;
  message?: string;
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
    type: RequestStatus.FETCHING,
  });

  try {
    const res = await client.search.getSearchResults(query, searchParams);

    dispatch({
      type: RequestStatus.SUCCESS,
      payload: transformSearchResponse(res),
    });
  } catch (err) {
    if (err instanceof Error) {
      dispatch({
        type: RequestStatus.ERROR,
        payload: err.message,
      });
    }
  }
};

/**
 * A React Hook to call to utilize Constructor.io Search
 * @param {Object} props - The component props.
 * @param {string} props.query Search Query
 * @param {SearchParameters} props.searchParams Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
 * @param {object} [props.initialSearchResponse] Default search response
 * @returns {status, data, pagination, refetch}
 */
export default function useSearchResults(props: UseSearchResultsProps): UseSearchResultsReturn {
  const { query, searchParams, initialSearchResponse } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useSearchResults() must be used within a component that is a child of <CioPlp />',
    );
  }

  const { cioClient } = contextValue;

  const [state, dispatch] = useReducer(searchReducer, initialState, (defaultState) =>
    initFunction(defaultState, initialSearchResponse),
  );

  const { search: data, status, message } = state;

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
    message,
    data,
    pagination,
    refetch: () => cioClient && fetchSearchResults(cioClient, query, searchParams || {}, dispatch),
  };
}
