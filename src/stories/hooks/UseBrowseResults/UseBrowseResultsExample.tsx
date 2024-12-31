import React, { ReactNode } from 'react';
import useBrowseResults, { UseBrowseResultsProps } from '../../../hooks/useBrowseResults';
import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';

function Code({ children }: { children: ReactNode }) {
  return (
    <section
      style={{
        backgroundColor: 'lightgrey',
        padding: '5px',
        borderRadius: '2px',
        fontFamily: 'monospace',
      }}>
      <pre>{children}</pre>
    </section>
  );
}

function MyCustomBrowseResultsComponent(props: UseBrowseResultsProps) {
  const { data, status, refetch } = useBrowseResults(props);

  return (
    <>
      <h2>Request status</h2>
      <div style={{ display: 'flex', gap: '5px', width: '20%' }}>
        {status}
        <button onClick={refetch} type='button'>
          Refetch
        </button>
      </div>
      <h2>Result Id </h2>
      <Code>{JSON.stringify(data?.resultId, null, 2)}</Code>
      <h2>Total Number of Results </h2>
      <Code>{JSON.stringify(data?.response?.totalNumResults, null, 2)}</Code>
      <h2>Array of Groups</h2>
      <Code>{JSON.stringify(data?.response?.groups, null, 2)}</Code>
      <h2>Array of Facets</h2>
      <Code>{JSON.stringify(data?.response?.facets, null, 2)}</Code>
      <h2>Array of Sort Options</h2>
      <Code>{JSON.stringify(data?.response?.sortOptions, null, 2)}</Code>
      <h2>Array of Results</h2>
      <Code>{JSON.stringify(data?.response?.results, null, 2)}</Code>
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
