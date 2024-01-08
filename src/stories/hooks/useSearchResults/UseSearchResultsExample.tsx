import React from 'react';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults from '../../../hooks/useSearchResults';
import { CioPlpContext } from '../../../PlpContext';
import { DEMO_API_KEY } from '../../../constants';

export interface UseCioClientExampleProps {
  /**
   * Search Query
   */
  query: string;
  /**
   * Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
   */
  searchParams?: SearchParameters;
}

// A simple React Component to showcase use with PlpContext
function SearchResults({
  query,
  searchParams,
}: {
  query: string;
  searchParams?: SearchParameters;
}) {
  const { data } = useSearchResults(query, { searchParams });

  return <ul>{data.response?.results.map((result) => <li>{result.itemName}</li>)}</ul>;
}

/**
 * A React Hook to retrieve search results using Constructor.
 */
export default function UseSearchResultsExample({ query, searchParams }: UseCioClientExampleProps) {
  return (
    <>
      <h1>useSearchResults</h1>
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <SearchResults query={query} searchParams={searchParams} />
      </CioPlpContext>
    </>
  );
}
