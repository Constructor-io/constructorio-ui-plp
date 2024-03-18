import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useReducer, useRef } from 'react';
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
import useRequestConfigs from './useRequestConfigs';
import { getSearchParamsFromRequestConfigs } from '../utils';
import useFirstRender from './useFirstRender';

export interface UseSearchResultsProps {
  initialSearchResponse?: PlpSearchResponse | PlpSearchRedirectResponse;
}

export interface UseSearchResultsReturn {
  status: RequestStatus | null;
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

/* eslint-disable max-len */
/**
 * A React Hook to call to utilize Constructor.io Search
 * @param {Object} [props] - The component props.
 * @param {object} [props.initialSearchResponse] Initial value for search results
 * (Would be useful when passing initial state for the first render from the server
 *  to the client via something like getServerSideProps)
 * @returns {status, data, pagination, refetch}
 */
/* eslint-enable max-len */
export default function useSearchResults(
  props: UseSearchResultsProps = {},
): UseSearchResultsReturn {
  const { isFirstRender } = useFirstRender();
  const { initialSearchResponse } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useSearchResults() must be used within a component that is a child of <CioPlp />',
    );
  }

  const { cioClient } = contextValue;
  const { requestConfigs } = useRequestConfigs();
  const { query, searchParams } = getSearchParamsFromRequestConfigs(requestConfigs);

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!cioClient && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  if (!query && typeof window !== 'undefined') {
    throw new Error('Unable to retrieve query from the url.');
  }

  const [state, dispatch] = useReducer(searchReducer, initialState, (defaultState) =>
    initFunction(defaultState, initialSearchResponse),
  );

  const { search: data, status, message } = state;

  const pagination = usePagination({
    initialPage: data.request?.page,
    totalNumResults: data.response?.totalNumResults,
    resultsPerPage: data.response?.numResultsPerPage,
  });

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (cioClient && (!initialSearchResponse || !isFirstRender)) {
      if (pagination.currentPage) searchParams.page = pagination.currentPage;

      fetchSearchResults(cioClient, query, searchParams, dispatch);
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
