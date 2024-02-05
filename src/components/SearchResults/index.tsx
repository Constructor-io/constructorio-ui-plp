import React from 'react';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import { IncludeRenderProps, PlpSearchRedirectResponse, PlpSearchResponse } from '../../types';
import ProductCard from '../ProductCard';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import useRequestConfigs from '../../hooks/useRequestConfigs';
import '../../styles.css';

/**
 * Props for the SearchResults component.
 */
interface SearchResultsProps {
  initialSearchResponse?: PlpSearchResponse | PlpSearchRedirectResponse;
}

/**
 * Type alias for SearchResultsProps with RenderProps.
 */
export type SearchResultsWithRenderProps = IncludeRenderProps<
  SearchResultsProps,
  UseSearchResultsReturn
>;

/**
 * Renders the search results based on the provided query and search parameters.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {object} [props.initialSearchResponse] Initial value for search results
 * (Would be useful when passing initial state for the first render from the server
 *  to the client via something like getServerSideProps)
 * @returns {JSX.Element} The rendered search results.
 * @throws {Error} Throws an error if the component is not rendered within CioPlpContext.
 */
export default function SearchResults(props: SearchResultsWithRenderProps) {
  const { initialSearchResponse } = props;
  const context = useCioPlpContext();

  if (!context) {
    throw new Error('<SearchResults /> component must be rendered within CioPlpContext');
  }

  const requestConfigs = useRequestConfigs() as SearchParameters & { query?: string };
  const { query, ...restRequestConfigs } = requestConfigs;
  if (!query) {
    throw new Error('query is a required parameter of type string');
  }

  const { status, data, pagination, refetch } = useSearchResults({
    query,
    searchParams: restRequestConfigs,
    initialSearchResponse,
  });

  const { children } = props;

  if (status === 'fetching') {
    return 'loading';
  }

  return (
    <>
      {typeof children === 'function' ? (
        children({ status, data, pagination, refetch })
      ) : (
        <>
          <div>Search Results</div>
          <>
            {data.response?.results?.length ? (
              <div className='cio-results data-results-search' data-cnstrc-search>
                {data.response?.results.map((item) => <ProductCard item={item} />)}
              </div>
            ) : (
              "Can't find matching items. Please try something else"
            )}
          </>
        </>
      )}
    </>
  );
}
