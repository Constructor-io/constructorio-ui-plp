import ConstructorIONode from '@constructor-io/constructorio-node';
import {
  ConstructorClientOptions,
  SearchParameters,
} from '@constructor-io/constructorio-node/src/types/index';
import { IncomingMessage } from 'http';
import {
  GetServerSidePropsContext,
  GetServerSideProps,
  DataFunctionArgs,
} from '../types/libraries';
import { getUserParameters, NextRequest } from './utils';

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
  query: string,
  searchParameters: SearchParameters,
  cioConfig: ConstructorClientOptions,
  getServerSidePropsFunc: GetServerSideProps,
) {
  return async (context: GetServerSidePropsContext) => {
    const cioNode = new ConstructorIONode({
      ...cioConfig,
    });

    const userParameters = getUserParameters(context.req);

    const searchResults = await cioNode.search.getSearchResults(
      query,
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
    customLoader,
    query: string,
    searchParameters: SearchParameters,
    cioConfig: ConstructorClientOptions,
  ) =>
  async (args: DataFunctionArgs) => {
    const { request, params, context } = args;
    const cioNode = new ConstructorIONode({
      ...cioConfig,
    });

    const userParameters = getUserParameters(request);

    const searchResults = await cioNode.search.getSearchResults(
      query,
      searchParameters,
      userParameters,
    );

    const additionalData = customLoader ? await customLoader(args, searchResults) : {};
    return { ...additionalData, searchResults, userParameters };
  };
