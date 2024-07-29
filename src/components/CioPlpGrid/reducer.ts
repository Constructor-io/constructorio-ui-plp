import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import { Nullable, PlpSearchData } from '../../types';
import { transformSearchResponse } from '../../utils/transformers';

export enum RequestStatus {
  STALE = 'stale',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface SearchState {
  status: RequestStatus;
  message?: string;
  search: Nullable<PlpSearchData>;
}

type SearchActionSuccess = {
  type: RequestStatus.SUCCESS;
  payload: SearchState['search'];
};

type SearchActionError = {
  type: RequestStatus.ERROR;
  payload: string;
};

export type SearchAction =
  | { type: RequestStatus.STALE | RequestStatus.FETCHING }
  | SearchActionError
  | SearchActionSuccess;

export const initialState: SearchState = {
  status: RequestStatus.STALE,
  search: null,
};

export function searchReducer(state: SearchState, action: SearchAction) {
  switch (action.type) {
    case RequestStatus.FETCHING: {
      return {
        ...state,
        status: RequestStatus.FETCHING,
      };
    }

    case RequestStatus.SUCCESS: {
      const { payload } = action;
      let search: Nullable<SearchState['search']> = null;

      if (payload) {
        search = transformSearchResponse(payload.rawApiResponse);
      }

      return {
        ...state,
        status: RequestStatus.SUCCESS,
        search,
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
  defaultState: SearchState,
  initialSearchResponse?: SearchResponse,
): SearchState {
  if (initialSearchResponse) {
    return {
      status: RequestStatus.STALE,
      search: transformSearchResponse(initialSearchResponse),
    };
  }

  return defaultState;
}
