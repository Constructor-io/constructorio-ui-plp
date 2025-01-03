import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  Nullable,
  SearchParameters,
  SearchResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useReducer } from 'react';
import { transformSearchResponse } from '../utils/transformers';
import { PlpSearchData } from '../types';
import {
  RequestStatus,
  requestReducer,
  RequestAction,
  initialState,
  initFunction,
  RequestType,
} from '../components/CioPlpGrid/reducer';
import { useCioPlpContext } from './useCioPlpContext';
import useRequestConfigs from './useRequestConfigs';
import { getSearchParamsFromRequestConfigs, isSearchUrl } from '../utils';
import useFirstRender from './useFirstRender';

export interface UseSearchResultsProps {
  initialSearchResponse?: SearchResponse;
}

export interface UseSearchResultsReturn {
  query?: string | null;
  status: RequestStatus | null;
  message?: string;
  data: Nullable<PlpSearchData>;
  refetch: () => void;
}

const fetchSearchResults = async (
  client: ConstructorIOClient,
  query: string,
  searchParams: SearchParameters,
  dispatch: React.Dispatch<RequestAction>,
) => {
  dispatch({
    type: RequestStatus.FETCHING,
  });

  try {
    const res = await client.search.getSearchResults(query, searchParams);

    dispatch({
      type: RequestStatus.SUCCESS,
      requestType: RequestType.SEARCH,
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
 * A React Hook to call to utilize Constructor Search
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
  const isSearchPage = isSearchUrl(requestConfigs) || initialSearchResponse;

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (isSearchPage && !cioClient && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const [state, dispatch] = useReducer(requestReducer, initialState, (defaultState) =>
    initFunction(defaultState, initialSearchResponse),
  );

  const { search: data, status, message } = state;

  // Get search results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (isSearchPage && query && cioClient && (!initialSearchResponse || !isFirstRender)) {
      fetchSearchResults(cioClient, query, searchParams, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestConfigs?.page]);

  return {
    query,
    status,
    message,
    data,
    refetch: () => cioClient && fetchSearchResults(cioClient, query, searchParams || {}, dispatch),
  };
}
