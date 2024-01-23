import React, { useState } from 'react';
import { DEMO_API_KEY } from '../../constants';
import useCioClient from '../../hooks/useCioClient';
import useSearchResults from '../../hooks/useSearchResults';
import CioPlp from '../../components/CioPlp';

/**
 * This interface will be rendered as a table in Storybook
 * Attribute-level comments will be rendered as part of the "description" column
 * Attribute-types determine the type of control: boolean = toggle, string = text input, enum = select
 */
interface UseCioClientExampleProps {
  /**
   * API Key used to requests results from
   */
  apiKey?: string;
}

function SearchResults({ searchQuery }: { searchQuery: string }) {
  const { data, refetch } = useSearchResults({
    query: searchQuery,
    searchParams: { resultsPerPage: 2, page: 1 },
  });

  return (
    <>
      {' '}
      <div>
        <button type='button' onClick={refetch}>
          Search
        </button>
      </div>
      {data.response?.results?.length && (
        <div>
          <ul>{data.response?.results.map((result) => <li>{result.itemName}</li>)}</ul>
        </div>
      )}
    </>
  );
}

// Note Description here will be translated into the story description
/**
 * A React Hook to obtain a Constructor.io Client from our
 *  JavaScript SDK, allowing you to make Search, Browse & Tracking requests
 */
export default function UseCioClientExample({ apiKey }: UseCioClientExampleProps) {
  const cioClient = useCioClient(apiKey || DEMO_API_KEY);
  const [searchQuery, setSearchQuery] = useState('');

  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <h1>Search Results as JSON</h1>
      <div>
        <input
          type='text'
          name='searchBox'
          id='searchBox'
          placeholder='Search query'
          value={searchQuery}
          onChange={onInputHandler}
        />
      </div>
      <CioPlp apiKey={DEMO_API_KEY}>
        <SearchResults searchQuery={searchQuery} />
      </CioPlp>
    </>
  );
}

export const useCioClientExampleCode = `
import React, { useState } from 'react';
import useCioClient from '../../hooks/useCioClient';

const apiKey = 'MY_API_KEY'

function SearchResults({ searchQuery }: { searchQuery: string }) {
  const { data, refetch } = useSearchResults({
    query: searchQuery,
    searchParams: { resultsPerPage: 2, page: 1 },
  });

  return (
    <>
      {' '}
      <div>
        <button type='button' onClick={refetch}>
          Search
        </button>
      </div>
      {data.response?.results?.length && (
        <div>
          <ul>{data.response?.results.map((result) => <li>{result.itemName}</li>)}</ul>
        </div>
      )}
    </>
  );
}


export default function UseCioClientExample({ apiKey }: UseCioClientExampleProps) {
  const cioClient = useCioClient(apiKey || DEMO_API_KEY);
  const [searchQuery, setSearchQuery] = useState('');

  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <h1>Search Results as JSON</h1>
      <div>
        <input
          type='text'
          name='searchBox'
          id='searchBox'
          placeholder='Search query'
          value={searchQuery}
          onChange={onInputHandler}
        />
      </div>
      <CioPlp cioClient={cioClient}>
        <SearchResults searchQuery={searchQuery} />
      </CioPlp>
    </>
  );
}
`;
