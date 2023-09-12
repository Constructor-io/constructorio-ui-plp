import React, { useMemo } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchPlp, { UseSearchPlpConfigs } from '../../hooks/useSearchPlp';
import { PlpContextProvider } from '../../PlpContext';
import { DEMO_API_KEY } from '../../constants';

/**
 * This interface will be rendered as a table in Storybook
 * Attribute-level comments will be rendered as part of the "description" column
 * Attribute-types determine the type of control: boolean = toggle, string = text input, enum = select
 */
interface UseCioClientExampleProps {
  /**
   * Search Query
   */
  query: string;
  /**
   * Configuration object for the hook
   */
  configs?: UseSearchPlpConfigs;
  /**
   * ConstructorIO Client created using the hook: useCioClient. Optional if called within PLP Context.
   */
  cioClient?: ConstructorIOClient;
  /**
   * Search Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-search.html#~getSearchResults for the full list of options.
   */
  searchParams?: SearchParameters;
}

// A simple React Component to showcase use with PlpContext
function SearchResults({ query, configs }: { query: string; configs?: UseSearchPlpConfigs }) {
  const searchResults = useSearchPlp(query, configs);

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

// Note Description here will be translated into the story description
/**
 * A React Hook to retrieve search results using Constructor.
 */
export default function UseSearchPlpExample({
  query,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cioClient,
  searchParams,
}: UseCioClientExampleProps) {
  const storybookConfigs: UseSearchPlpConfigs = useMemo(() => ({ searchParams }), [searchParams]);

  return (
    <>
      <h1>useSearchPlp</h1>
      <p>This hook returns an object with the following properties:</p>
      <PlpContextProvider apiKey={DEMO_API_KEY}>
        <SearchResults query={query} configs={storybookConfigs} />
      </PlpContextProvider>
    </>
  );
}

export const useSearchPlpFeaturedCode = `
## Usage with useCioClient

\`\`\`jsx
function myApp() {
  const cioClient = useCioClient(MY_API_KEY)
  const searchResults = useSearchPlp(query, { cioClient });
  ...
}
\`\`\`

## Usage with PlpContextProvider

\`\`\`jsx
function SearchResults({ query }) {
  const searchResults = useSearchPlp(query);
  ...
}

function myApp() {
  ...
  return (
    <>
    <PlpContextProvider apiKey={MY_API_KEY}>
      <SearchResults query={query} />
    </PlpContextProvider>
    </>
  )
}
\`\`\`
`;

export const useSearchPlpExampleCode = `
import React from 'react';
import { PlpContextProvider } from '../../PlpContext';
import useSearchPlp from '../../hooks/useSearchPlp';

const apiKey = 'MY_API_KEY'

// A simple React Component to showcase useSearchPlp with PlpContextProvider
function SearchResults({ query }) {
  const searchParams = useMemo(() => ({ resultsPerPage: 2 }), []);
  const searchResults = useSearchPlp(query, { searchParams });

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

// Main Component
function UseSearchPlpExample() {
  const [query] = useState('water')

  return (
    <>
      <h1>useSearchPlp</h1>
      <p>This hook returns an object with the following properties:</p>
      <PlpContextProvider apiKey={MY_API_KEY}>
        <SearchResults query={query} />
      </PlpContextProvider>
    </>
  );
}
`;
