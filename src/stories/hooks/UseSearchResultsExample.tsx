import React, { useMemo } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults, { UseSearchResultsConfigs } from '../../hooks/useSearchResults';
import CioPlp from '../../components/CioPlp';
import { DEMO_API_KEY } from '../../constants';

export interface UseCioClientExampleProps {
  /**
   * Search Query
   */
  query: string;
  /**
   * Configuration object for the hook
   */
  configs?: UseSearchResultsConfigs;
  /**
   * ConstructorIO Client created using the hook: useCioClient. Optional if called within PLP Context.
   */
  cioClient?: ConstructorIOClient;
  /**
   * Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
   */
  searchParams?: SearchParameters;
}

// A simple React Component to showcase use with CioPlp provider
function SearchResults({ query, configs }: { query: string; configs?: UseSearchResultsConfigs }) {
  const { searchResults } = useSearchResults(query, configs);

  return (
    <>
      <h2>Result Id </h2>
      <div>{JSON.stringify(searchResults?.resultId)}</div>
      <h2>Total Number of Results </h2>
      <div>{JSON.stringify(searchResults?.totalNumResults)}</div>
      <h2>Array of Groups</h2>
      <div>{JSON.stringify(searchResults?.groups)}</div>
      <h2>Array of Facets</h2>
      <div>{JSON.stringify(searchResults?.facets)}</div>
      <h2>Array of Sort Options</h2>
      <div>{JSON.stringify(searchResults?.sortOptions)}</div>
      <h2>Array of Results</h2>
      <div>{JSON.stringify(searchResults?.results)}</div>
    </>
  );
}

/**
 * A React Hook to retrieve search results using Constructor.
 */
export default function UseSearchResultsExample({
  query,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cioClient,
  searchParams,
}: UseCioClientExampleProps) {
  const storybookConfigs: UseSearchResultsConfigs = useMemo(
    () => ({ searchParams }),
    [searchParams],
  );

  return (
    <>
      <h1>useSearchResults</h1>
      <p>This hook returns an object with the following properties:</p>
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults query={query} configs={storybookConfigs} />
      </CioPlp>
    </>
  );
}
