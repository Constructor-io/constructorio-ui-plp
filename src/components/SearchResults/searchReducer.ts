import {
  SearchResponseState,
  RedirectResponseState,
  SearchRequestState,
  RawApiResponseState,
  PlpSearchRedirectResponse,
  PlpSearchResponse,
  Nullable,
} from '../../types';
import { isPlpSearchRedirectResponse } from '../../utils';

export enum SearchStatus {
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
  status: SearchStatus;
  search: SearchData;
}

type SearchActionSuccess = {
  type: SearchStatus.SUCCESS;
  payload: PlpSearchResponse | PlpSearchRedirectResponse;
};

type SearchActionError = {
  type: SearchStatus.ERROR;
  payload: string;
};

export type SearchAction =
  | { type: SearchStatus.STALE | SearchStatus.FETCHING }
  | SearchActionError
  | SearchActionSuccess;

export function searchReducer(state: SearchState, action: SearchAction) {
  switch (action.type) {
    case SearchStatus.FETCHING: {
      return {
        ...state,
        status: SearchStatus.FETCHING,
      };
    }
    case SearchStatus.SUCCESS: {
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
        status: SearchStatus.SUCCESS,
        search: {
          rawApiResponse: payload.rawResponse,
          request: payload.rawResponse.request,
          response: search,
          redirect,
        },
      };
    }
    case SearchStatus.ERROR: {
      return {
        ...state,
        status: SearchStatus.ERROR,
      };
    }
    default: {
      return state;
    }
  }
}
