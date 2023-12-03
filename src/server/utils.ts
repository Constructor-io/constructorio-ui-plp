import { parse } from 'cookie';
import {
  UserParameters,
  SearchParameters,
} from '@constructor-io/constructorio-node/src/types/index';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import qs from 'qs';
import { Nullable } from '../types';

// getHeaderValue is a helper function to get a header value from a Fetch API Request (Remix.js)
// ...or Node.js http.IncomingHttpHeaders (Next.js)
function getHeaderValue(headers: Headers | IncomingHttpHeaders, key: string) {
  if (headers instanceof Headers) {
    // Fetch API's Headers interface (e.g. in Remix.js)
    return headers.get(key);
  }
  if (typeof headers === 'object' && headers !== null) {
    // Plain JavaScript object (like in Express.js) or Node.js http.IncomingHttpHeaders (e.g. in Next.js)
    return headers[key.toLowerCase()]; // Header keys are case-insensitive
  }
  // Unsupported type or null/undefined
  return undefined;
}

export function getUserIp(request: Request | IncomingMessage) {
  const XFF = getHeaderValue(request.headers, 'x-forwarded-for');

  let userIp: Nullable<string> | undefined;

  if (XFF) {
    if (Array.isArray(XFF)) {
      userIp = XFF[0]?.trim();
    } else {
      userIp = XFF.split(',')?.[0]?.trim();
    }
    // If XFF is not set, try to get the user's IP from the request if the request is a Node.js http.IncomingMessage
    // There's no direct way to get the user's IP from a Fetch API Request (Remix.js)
  } else if (request instanceof IncomingMessage) {
    userIp = request.socket.remoteAddress;
  }

  return userIp;
}

export type NextRequest = IncomingMessage & {
  cookies: Partial<{
    [key: string]: string;
  }>;
};

// Type of request is either native Fetch API `Request`[Remix] or Node.js `http.IncomingMessage` [Next.js]
/**
 * `Request` -> native Fetch API Request (Remix)
 * `IncomingMessage` -> Node.js http.IncomingMessage
 * `NextRequest` -> (IncomingMessage & cookies) built on top of Node.js http.IncomingMessage and added to it cookies
 */
export function getUserParameters(request: Request | IncomingMessage | NextRequest) {
  const { headers } = request;

  let ConstructorioIDClientId: string | undefined;
  let ConstructorioIDSessionId: string | undefined;

  // Check if the request is a Next.js request
  if ('cookies' in request) {
    ConstructorioIDClientId = request.cookies.ConstructorioID_client_id;
    ConstructorioIDSessionId = request.cookies.ConstructorioID_session_id;
  } else {
    // If not, check if the request is a Fetch API Request (Remix.js) or Node.js http.IncomingMessage
    // Get the Cookie header
    const cookieHeader = getHeaderValue(headers, 'cookie') as string;

    // Parse the cookies
    const cookies = parse(cookieHeader || '');

    // Access specific cookies
    ConstructorioIDClientId = cookies.ConstructorioID_client_id;
    ConstructorioIDSessionId = cookies.ConstructorioID_session_id;
  }

  const userAgent = getHeaderValue(headers, 'user-agent');
  const userIp = getUserIp(request);

  const userParameters: UserParameters = {
    sessionId: Number(ConstructorioIDSessionId),
    clientId: ConstructorioIDClientId,
  };

  if (userAgent) {
    userParameters.userAgent = userAgent as string;
  }

  if (userIp) {
    userParameters.userIp = userIp;
  }

  return userParameters;
}

/*
 * Creates a query parameters object from the given url or current window location
 */
export function getQueryParamsFromUrl(url: string) {
  const urlObject = new URL(url);
  const queryString = urlObject.search?.slice(1); // This removes the leading '?'

  if (!queryString) return {};

  return qs.parse(queryString);
}

export type QueryParamMapping = {
  [P in keyof SearchParameters]?: string;
} & {
  query?: string;
};

// Creating the mapping
export const defaultQueryParamMapping: QueryParamMapping = {
  query: 'q',
  page: 'page',
  offset: 'offset',
  resultsPerPage: 'resultsPerPage',
  filters: 'filters',
  sortBy: 'sortBy',
  sortOrder: 'sortOrder',
  section: 'section',
  fmtOptions: 'fmtOptions',
  preFilterExpression: 'preFilterExpression',
  hiddenFields: 'hiddenFields',
  hiddenFacets: 'hiddenFacets',
  variationsMap: 'variationsMap',
  qsParam: 'qsParam',
};

// Function takes a customer parameters object and returns a transformed SearchParameters object
export function transformQueryParams(
  customerParams: Record<string, any>,
  queryParamMapping: QueryParamMapping = defaultQueryParamMapping,
): SearchParameters & { query: string } {
  const transformed: Partial<SearchParameters> = {};

  // Each key in the queryParamMapping object is a search parameter key
  Object.entries(queryParamMapping).forEach(([searchParamKey, queryKey]) => {
    if (customerParams[queryKey] !== undefined) {
      let value = customerParams[queryKey];

      // Simple type conversions
      if (['page', 'offset', 'resultsPerPage'].includes(searchParamKey)) {
        value = Number(value);
      }
      // Todo: support other props type conversions (filters, sortBy, sortOrder, etc.)

      transformed[searchParamKey] = value;
    }
  });

  return transformed as SearchParameters & { query: string };
}
