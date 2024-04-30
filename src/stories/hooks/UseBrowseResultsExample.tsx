import React from 'react';
import useBrowseResults, { UseBrowseResultsProps } from '../../hooks/useBrowseResults';
import CioPlp from '../../components/CioPlp';
import { DEMO_API_KEY } from '../../constants';

// A simple React Component to showcase use with CioPlp provider
function MyCustomBrowseResultsComponent(props: UseBrowseResultsProps) {
  const { browseResults } = useBrowseResults(props);

  return (
    <>
      <h2>Result Id </h2>
      <div>{JSON.stringify(browseResults?.resultId)}</div>
      <h2>Total Number of Results </h2>
      <div>{JSON.stringify(browseResults?.totalNumResults)}</div>
      <h2>Array of Groups</h2>
      <div>{JSON.stringify(browseResults?.groups)}</div>
      <h2>Array of Facets</h2>
      <div>{JSON.stringify(browseResults?.facets)}</div>
      <h2>Array of Sort Options</h2>
      <div>{JSON.stringify(browseResults?.sortOptions)}</div>
      <h2>Array of Results</h2>
      <div>{JSON.stringify(browseResults?.results)}</div>
    </>
  );
}

/**
 * A React Hook to retrieve browse results using Constructor.
 */
// eslint-disable-next-line no-empty-pattern
export default function UseBrowseResultsExample({}: UseBrowseResultsProps) {
  return (
    <>
      <h1>useBrowseResults</h1>
      <p>This hook returns an object with the following properties:</p>
      <CioPlp apiKey={DEMO_API_KEY}>
        <MyCustomBrowseResultsComponent />
      </CioPlp>
    </>
  );
}
