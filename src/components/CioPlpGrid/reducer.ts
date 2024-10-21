import {
  GetBrowseResultsResponse,
  SearchResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { Nullable, PlpBrowseData, PlpSearchData } from '../../types';
import { transformBrowseResponse, transformSearchResponse } from '../../utils/transformers';

export enum RequestStatus {
  STALE = 'stale',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum RequestType {
  SEARCH = 'search',
  BROWSE = 'browse',
}

export interface RequestState {
  status: RequestStatus;
  message?: string;
  search: Nullable<PlpSearchData>;
  browse: Nullable<PlpBrowseData>;
}

type RequestActionSuccess = {
  type: RequestStatus.SUCCESS;
  requestType: RequestType;
  payload: RequestState['search'] | RequestState['browse'];
};

type RequestActionError = {
  type: RequestStatus.ERROR;
  payload: string;
};

export type RequestAction =
  | { type: RequestStatus.STALE | RequestStatus.FETCHING }
  | RequestActionError
  | RequestActionSuccess;

export const initialState: RequestState = {
  status: RequestStatus.STALE,
  search: null,
  browse: null,
};

export function requestReducer(state: RequestState, action: RequestAction) {
  switch (action.type) {
    case RequestStatus.FETCHING: {
      return {
        ...state,
        status: RequestStatus.FETCHING,
      };
    }

    case RequestStatus.SUCCESS: {
      const { payload, requestType } = action;
      let search: Nullable<RequestState['search']> = null;
      let browse: Nullable<RequestState['browse']> = null;

      if (payload) {
        if (requestType === RequestType.SEARCH) {
          search = transformSearchResponse(payload.rawApiResponse as SearchResponse);
        } else if (requestType === RequestType.BROWSE) {
          browse = transformBrowseResponse(payload.rawApiResponse as GetBrowseResultsResponse);
        }
      }

      return {
        ...state,
        status: RequestStatus.SUCCESS,
        search,
        browse,
      };
    }

    case RequestStatus.ERROR: {
      return {
        ...state,
        status: RequestStatus.ERROR,
        message: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export function initFunction(
  defaultState: RequestState,
  initialSearchResponse?: SearchResponse,
  initialBrowseResponse?: GetBrowseResultsResponse,
): RequestState {
  if (initialSearchResponse) {
    return {
      status: RequestStatus.STALE,
      search: transformSearchResponse(initialSearchResponse),
      browse: null,
    };
  }

  if (initialBrowseResponse) {
    return {
      status: RequestStatus.STALE,
      search: null,
      browse: transformBrowseResponse(initialBrowseResponse),
    };
  }

  return defaultState;
}
