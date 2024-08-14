import React from 'react';
import { DEMO_API_KEY } from '../../../constants';
import { isPlpSearchDataResults } from '../../../utils';
import CioPlpProvider from '../../../components/CioPlp/CioPlpProvider';
import useCioPlp, { UseCioPlpProps } from '../../../hooks/useCioPlp';

// A simple React Component to showcase useCioPlp with PlpContext
function MyCustomCioPlpComponent(props: UseCioPlpProps) {
  const { filters, pagination, sort, searchData } = useCioPlp(props);

  return (
    <>
      <div>
        <h2>Filter Groups</h2>
        {filters.facets.map((facet) => (
          <div>{facet.displayName}</div>
        ))}
      </div>

      <div>
        <h2>Sort Options</h2>
        {sort.sortOptions.map((sortOption) => (
          <div>{sortOption.displayName}</div>
        ))}
      </div>

      <div>
        <h2>Pagination</h2>
        {pagination.pages.map((page) => {
          if (page === -1) {
            return '...';
          }
          return <div>Page: {page}</div>;
        })}
      </div>

      <div>
        <h2>Results</h2>
        <ul>
          {isPlpSearchDataResults(searchData) &&
            searchData.response.results.map((item) => <li>{item.itemName}</li>)}
        </ul>
      </div>
    </>
  );
}

/**
 * A React Hook to retrieve search results using Constructor.
 */
// eslint-disable-next-line no-empty-pattern
export default function UseCioPlpExample({}: UseCioPlpProps) {
  return (
    <>
      <h1>useCioPlp</h1>
      <CioPlpProvider apiKey={DEMO_API_KEY}>
        <MyCustomCioPlpComponent />
      </CioPlpProvider>
    </>
  );
}
