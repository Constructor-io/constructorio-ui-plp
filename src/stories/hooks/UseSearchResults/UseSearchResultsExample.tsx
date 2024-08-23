import React from 'react';
import useSearchResults, { UseSearchResultsProps } from '../../../hooks/useSearchResults';
import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';
import { isPlpSearchDataResults } from '../../../utils';

// A simple React Component to showcase use with PlpContext
function MyCustomSearchResultsComponent() {
  const { data } = useSearchResults();

  if (isPlpSearchDataResults(data)) {
    return <ul>{data.response?.results?.map((result) => <li>{result.itemName}</li>)}</ul>;
  }
}

/**
 * A React Hook to retrieve search results using Constructor.
 */
// eslint-disable-next-line no-empty-pattern
export default function UseSearchResultsExample({}: UseSearchResultsProps) {
  return (
    <>
      <h1>useSearchResults</h1>
      <CioPlp apiKey={DEMO_API_KEY}>
        <MyCustomSearchResultsComponent />
      </CioPlp>
    </>
  );
}
