import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DEMO_API_KEY } from '../../constants';
import useCioClient from '../../hooks/useCioClient';
import HookRerenderControls from './HookRerenderControls';

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
  /**
   * Query to search for
   */
  searchQuery?: string;
}

/**
 * Primary UI component for user interaction
 * Default values here will be reflected in the interface table
 */
export default function UseCioClientExample({ apiKey, searchQuery }: UseCioClientExampleProps) {
  const cioClient = useCioClient(apiKey || DEMO_API_KEY);
  const [results, setResults] = useState({});

  // const results = useMemo(
  //   () =>
  //     cioClient.search.getSearchResults(searchQuery || 'shirts').then((res) => {
  //       console.log(res);
  //       return res.result_id;
  //     }),
  //   [searchQuery, cioClient],
  // );
  useEffect(() => {
    cioClient.search.getSearchResults(searchQuery || 'shirts').then((res) => {
      // setResults(res.response.results);
    });
  });
  return (
    <HookRerenderControls>
      <h1>Search Results as JSON</h1>
      <div>{JSON.stringify(apiKey || DEMO_API_KEY)}</div>
      <div>{JSON.stringify(results)}</div>
    </HookRerenderControls>
  );
}
