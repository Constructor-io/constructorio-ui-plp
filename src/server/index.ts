import ConstructorIONode from '@constructor-io/constructorio-node';
import {
  ConstructorClientOptions,
  SearchParameters,
  SearchResponse,
} from '@constructor-io/constructorio-node/src/types/index';
import { IncomingMessage } from 'http';
import qs from 'qs';
import {
  GetServerSidePropsContext,
  GetServerSideProps,
  DataFunctionArgs,
} from '../types/libraries';
import {
  getUserParameters,
  NextRequest,
  getQueryParamsFromUrl,
  transformQueryParams,
  defaultQueryParamMapping,
  QueryParamMapping,
} from './utils';

// Call on the server side to get search results
export async function getServerSearchResults(
  request: Request | IncomingMessage | NextRequest,
  searchParameters: SearchParameters,
  cioConfig: ConstructorClientOptions,
) {
  const cioNode = new ConstructorIONode({
    ...cioConfig,
  });

  const userParameters = getUserParameters(request);

  const searchResults = await cioNode.search.getSearchResults(
    'query',
    searchParameters,
    userParameters,
  );

  return {
    props: {
      initialSearchResults: searchResults,
      userParameters,
    },
  };
}

// This function is used to wrap the getServerSideProps function in a Next.js page
// Usage in consumer's Next.js page
/** 
  const originalGetServerSideProps = async (context) => {
    // Original getServerSideProps logic
  };

  export const getServerSideProps = withServerSideSearch(
    cioConfig,
    originalGetServerSideProps,
  );
*/
export function withSearchGetServerSideProps(
  cioConfig: ConstructorClientOptions,
  getServerSidePropsFunc: GetServerSideProps,
  queryParamMapping: QueryParamMapping = defaultQueryParamMapping,
) {
  return async (context: GetServerSidePropsContext) => {
    const cioNode = new ConstructorIONode({
      ...cioConfig,
    });
    const { req } = context;

    // didn't use Next's `query` since it won't pare nested query strings as `qs` would for foo[bar]=a
    const url = new URL(req.url!);
    const queryString = url.search?.slice(1); // This removes the leading '?'
    const customerParams = qs.parse(queryString);

    const searchParameters = transformQueryParams(customerParams, queryParamMapping);

    const userParameters = getUserParameters(req);

    const searchResults = await cioNode.search.getSearchResults(
      searchParameters.query,
      searchParameters,
      userParameters,
    );

    const props = await getServerSidePropsFunc(context);
    return {
      props: {
        ...props,
        initialSearchResults: searchResults,
        userParameters,
      },
    };
  };
}

// This function is used to wrap the loader function in a Remix page
// Usage in consumer's Remix route
/** 
  export let loader = async ({ request, params, context }, searchResults) => {
    // Use the request object to access headers, method, etc.
    // Fetch data or perform other logic based on the route parameters
    // ...
    return { ** ...data to pass to the route component... ** };
  };
*/
export const withSearchRemixLoader =
  (
    customLoader: (args: DataFunctionArgs, searchResults: SearchResponse) => Promise<any>,
    cioConfig: ConstructorClientOptions,
    queryParamMapping: QueryParamMapping = defaultQueryParamMapping,
  ) =>
  async (args: DataFunctionArgs) => {
    const { request } = args;
    const cioNode = new ConstructorIONode({
      ...cioConfig,
    });

    const customerParams = getQueryParamsFromUrl(request.url);

    const transformedQueryParams = transformQueryParams(customerParams, queryParamMapping);

    const userParameters = getUserParameters(request);

    const searchResults = await cioNode.search.getSearchResults(
      transformedQueryParams.query,
      transformedQueryParams,
      userParameters,
    );

    const additionalData = customLoader ? await customLoader(args, searchResults) : {};
    return { ...additionalData, searchResults, userParameters };
  };
