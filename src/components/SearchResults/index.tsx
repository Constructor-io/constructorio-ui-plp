import React, { useMemo } from 'react';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript';
import useSearchResults, { UseSearchResultsConfigs } from '../../hooks/useSearchResults';
import { useCioPlpContext } from '../../PlpContext';
import { IncludeRenderProps, PlpSearchResponse } from '../../types';
import ProductCard from '../ProductCard';
import './SearchResults.css';

/**
 * Props for the SearchResults component.
 */
interface SearchResultsProps {
  // Initial query for the search results.
  initialQuery?: string;
  // Search parameters configuring the search request.
  searchParams?: SearchParameters;
}

/**
 * Type alias for SearchResultsProps with RenderProps.
 */
type SearchResultsWithRenderProps = IncludeRenderProps<
  SearchResultsProps,
  PlpSearchResponse | null
>;

/**
 * Renders the search results based on the provided query and search parameters.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.initialQuery] - The initial search query.
 * @param {SearchParameters} [props.searchParams] - The search parameters.
 * @returns {JSX.Element} The rendered search results.
 * @throws {Error} Throws an error if the component is not rendered within CioPlpContext.
 */
export default function SearchResults(props: SearchResultsWithRenderProps) {
  const context = useCioPlpContext();

  if (!context) {
    throw new Error('<SearchResults /> component must be rendered within CioPlpContext');
  }

  const { children, initialQuery = '', searchParams } = props;
  const { searchResults } = useSearchResults(initialQuery, {
    cioClient: context?.cioClient,
    searchParams,
  });

  return (
    <>
      {typeof children === 'function' ? (
        children(searchResults)
      ) : (
        <>
          <div>Search Results</div>
          <div className='cio-results'>
            {searchResults?.results.map((item) => <ProductCard item={item} />)}
          </div>
        </>
      )}
    </>
  );
}
