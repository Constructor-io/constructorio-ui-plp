import React, { useMemo } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { IBrowseParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useBrowseResults, { UseBrowseResultsConfig } from '../../hooks/useBrowseResults';
import { CioPlpProvider as CioPlp } from '../../components/CioPlp';
import { DEMO_API_KEY } from '../../constants';

export interface UseCioClientExampleProps {
  /**
   * Browse Filter Name
   */
  filterName: string;
  /**
   * Browse Filter Value
   */
  filterValue: string;
  /**
   * Configuration object for the hook
   */
  configs?: UseBrowseResultsConfig;
  /**
   * ConstructorIO Client created using the hook: useCioClient. Optional if called within PLP Context.
   */
  cioClient?: ConstructorIOClient;
  /**
   * Browse Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-browse.html#~getBrowseResults for the full list of options.
   */
  browseParams?: IBrowseParameters;
}

// A simple React Component to showcase use with CioPlp provider
function BrowseResults({
  filterName,
  filterValue,
  configs,
}: {
  filterName: string;
  filterValue: string;
  configs?: UseBrowseResultsConfig;
}) {
  const { browseResults } = useBrowseResults(filterName, filterValue, configs);

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
export default function UseBrowseResultsExample({
  filterName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cioClient,
  browseParams,
}: UseCioClientExampleProps) {
  const storybookConfigs: UseBrowseResultsConfig = useMemo(
    () => ({ browseParams }),
    [browseParams],
  );

  return (
    <>
      <h1>useBrowseResults</h1>
      <p>This hook returns an object with the following properties:</p>
      <CioPlp apiKey={DEMO_API_KEY}>
        <BrowseResults
          filterName={filterName}
          filterValue={filterValue}
          configs={storybookConfigs}
        />
      </CioPlp>
    </>
  );
}
