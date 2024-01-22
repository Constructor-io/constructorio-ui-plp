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

type ChildrenFunctionProps = UseSearchResultsReturn;
/**
 * Type alias for SearchResultsProps with RenderProps.
 */
type SearchResultsWithRenderProps = IncludeRenderProps<SearchResultsProps, ChildrenFunctionProps>;

/**
 * Renders the search results based on the provided query and search parameters.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {object} [props.initialSearchResponse] Default search response
 * @returns {JSX.Element} The rendered search results.
 * @throws {Error} Throws an error if the component is not rendered within CioPlpContext.
 */
export default function SearchResults(props: SearchResultsWithRenderProps) {
  const { initialSearchResponse } = props;
  const context = useCioPlpContext();

  const requestConfigs = useRequestConfigs() as SearchParameters & { query?: string };
  const { query, ...restRequestConfigs } = requestConfigs;
  const { status, data, pagination, refetch } = useSearchResults({
    query: query || '',
    searchParams: restRequestConfigs,
    initialSearchResponse,
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
          <>
            {data.response?.results ? (
              <div className='cio-results'>
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
