import { useEffect, useReducer } from 'react';
import {
  Nullable,
  IBrowseParameters as BrowseParameters,
  GetBrowseResultsResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useCioPlpContext } from './useCioPlpContext';
import useRequestConfigs from './useRequestConfigs';
import { transformBrowseResponse } from '../utils/transformers';
import { ConstructorIOClient, PlpBrowseData } from '../types';
import { getBrowseParamsFromRequestConfigs, isBrowseUrl } from '../utils';
import useFirstRender from './useFirstRender';
import {
  RequestStatus,
  requestReducer,
  RequestAction,
  initialState,
  initFunction,
  RequestType,
} from '../components/CioPlpGrid/reducer';

export interface UseBrowseResultsProps {
  initialBrowseResponse?: GetBrowseResultsResponse;
}

export type UseBrowseResultsReturn = {
  status: RequestStatus | null;
  message?: string;
  data: Nullable<PlpBrowseData>;
  refetch: () => void;
  filterName: string;
  filterValue: string;
};

const fetchBrowseResults = async (
  client: ConstructorIOClient,
  filterName: string,
  filterValue: string,
  browseParameters: BrowseParameters,
  dispatch: React.Dispatch<RequestAction>,
  // eslint-disable-next-line max-params
) => {
  dispatch({
    type: RequestStatus.FETCHING,
  });

  try {
    const res = await client.browse.getBrowseResults(filterName, filterValue, browseParameters);

    dispatch({
      type: RequestStatus.SUCCESS,
      requestType: RequestType.BROWSE,
      payload: transformBrowseResponse(res),
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
 * A React Hook to call to utilize Constructor Browse
 * @param {object} [props.initialBrowseResponse] Initial value for browse results. Results will not be re-fetched on first render if this is provided
 */
/* eslint-enable max-len */
export default function useBrowseResults(
  props: UseBrowseResultsProps = {},
): UseBrowseResultsReturn {
  const { isFirstRender } = useFirstRender();
  const { initialBrowseResponse } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useBrowseResults() must be used within a component that is a child of <CioPlp />',
    );
  }

  const { cioClient } = contextValue;
  const { requestConfigs } = useRequestConfigs();
  const {
    filterName,
    filterValue,
    queryParams: browseParams,
  } = getBrowseParamsFromRequestConfigs(requestConfigs);
  const isBrowsePage = isBrowseUrl(requestConfigs) || initialBrowseResponse;

  if (isBrowsePage && (!filterName || !filterValue) && typeof window !== 'undefined') {
    throw new Error('Unable to retrieve filterName and filterValue from the url.');
  }

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (isBrowsePage && !cioClient && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const [state, dispatch] = useReducer(requestReducer, initialState, (defaultState) =>
    initFunction(defaultState, undefined, initialBrowseResponse),
  );

  const { browse: data, status, message } = state;

  // Get browse results for initial query if there is one if not don't ever run this effect again
  useEffect(() => {
    if (
      isBrowsePage &&
      cioClient &&
      filterName &&
      filterValue &&
      (!initialBrowseResponse || !isFirstRender)
    ) {
      fetchBrowseResults(cioClient, filterName, filterValue, browseParams, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestConfigs?.page]);

  return {
    status,
    filterName,
    filterValue,
    message,
    data,
    refetch: () =>
      cioClient &&
      fetchBrowseResults(cioClient, filterName, filterValue, browseParams || {}, dispatch),
  };
}
