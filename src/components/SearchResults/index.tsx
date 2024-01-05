import React from 'react';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { PropsWithChildrenRenderProps } from '../../types';
import ProductList from '../ProductList';
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

type ChildrenFunctionProps = UseSearchResultsReturn;
/**
 * Type alias for SearchResultsProps with RenderProps.
 */
type SearchResultsWithRenderProps = PropsWithChildrenRenderProps<
  SearchResultsProps,
  ChildrenFunctionProps
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
  const { searchParams, initialQuery } = props;
  const context = useCioPlpContext();

  const { status, data, pagination, refetch } = useSearchResults(initialQuery || '', {
    searchParams,
  });

  if (!context) {
    throw new Error('<SearchResults /> component must be rendered within CioPlpContext');
  }

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
          <ProductList items={data.response?.results} />
        </>
      )}
    </>
  );
}
