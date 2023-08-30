import React, { useState } from 'react';
import { DEMO_API_KEY } from '../../constants';
import useCioClient from '../../hooks/useCioClient';

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

// Note Description here will be translated into the story description
/**
 * A React Hook to obtain a Constructor.io Client from our
 *  JavaScript SDK, allowing you to make Search, Browse & Tracking requests
 */
export default function UseCioClientExample({ apiKey }: UseCioClientExampleProps) {
  const cioClient = useCioClient(apiKey || DEMO_API_KEY);
  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const runSearch = async () => {
    const res = await cioClient.search.getSearchResults(searchQuery || '');
    setResults(res.response.results);
  };

  return (
    <>
      <h1>Search Results as JSON</h1>
      <input
        type='text'
        name='searchBox'
        id='searchBox'
        placeholder='Search query'
        value={searchQuery}
        onChange={onInputHandler}
      />
      <div>{JSON.stringify(results)}</div>
      <div>
        <button type='button' onClick={runSearch}>
          Search
        </button>
      </div>
    </>
  );
}

export const useCioClientExampleCode = `
import React, { useState } from 'react';
import useCioClient from '../../hooks/useCioClient';

const apiKey = 'MY_API_KEY'

function UseCioClientExample() {
  const cioClient = useCioClient(apiKey);
  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const runSearch = async () => {
    const res = await cioClient.search.getSearchResults(searchQuery || '');
    setResults(res.response.results);
  };

  return (
    <>
      <h1>Search Results as JSON</h1>
      <input
        type='text'
        name='searchBox'
        id='searchBox'
        placeholder='Search query'
        value={searchQuery}
        onChange={onInputHandler}
      />
      <div>{JSON.stringify(results)}</div>
      <div>
        <button type='button' onClick={runSearch}>
          Search
        </button>
      </div>
    </>
  );
}`;
