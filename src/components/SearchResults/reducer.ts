import {
  SearchResponseState,
  RedirectResponseState,
  SearchRequestState,
  RawApiResponseState,
  PlpSearchRedirectResponse,
  PlpSearchResponse,
  Nullable,
} from '../../types';
import { isPlpSearchRedirectResponse, isPlpSearchResponse } from '../../utils';

export enum RequestStatus {
  STALE = 'stale',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface SearchData {
  rawApiResponse: RawApiResponseState;
  request: SearchRequestState;
  response: SearchResponseState;
  redirect: RedirectResponseState;
}

export interface SearchState {
  status: RequestStatus;
  search: SearchData;
}

type SearchActionSuccess = {
  type: RequestStatus.SUCCESS;
  payload: PlpSearchResponse | PlpSearchRedirectResponse;
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
  search: {
    rawApiResponse: null,
    request: null,
    response: null,
    redirect: null,
  },
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
      let redirect: Nullable<Omit<PlpSearchRedirectResponse, 'rawResponse'>> = null;
      let search: Nullable<Omit<PlpSearchResponse, 'rawResponse'>> = null;

      if (isPlpSearchRedirectResponse(payload)) {
        const { rawResponse, ...otherFields } = payload;
        redirect = otherFields;
      } else {
        const { rawResponse, ...otherFields } = payload;
        search = otherFields;
      }

      return {
        ...state,
        status: RequestStatus.SUCCESS,
        search: {
          rawApiResponse: payload.rawResponse,
          request: payload.rawResponse.request,
          response: search,
          redirect,
        },
      };
    }
    case RequestStatus.ERROR: {
      return {
        ...state,
        status: RequestStatus.ERROR,
      };
    }
    default: {
      return state;
    }
  }
}

export const initFunction = (
  defaultState: SearchState,
  initialSearchResponse: PlpSearchResponse | PlpSearchRedirectResponse | undefined,
): SearchState => {
  if (initialSearchResponse) {
    if (isPlpSearchRedirectResponse(initialSearchResponse)) {
      const { rawResponse, redirect, resultId } = initialSearchResponse;

      return {
        status: RequestStatus.STALE,
        search: {
          rawApiResponse: rawResponse,
          request: rawResponse.request,
          response: { resultId },
          redirect,
        },
      };
    }
    if (isPlpSearchResponse(initialSearchResponse)) {
      const { rawResponse, ...restResponse } = initialSearchResponse;
      return {
        status: RequestStatus.STALE,
        search: {
          rawApiResponse: rawResponse,
          request: rawResponse.request,
          response: restResponse,
          redirect: null,
        },
      };
    }
  }

  return defaultState;
};
