import React from 'react';
import { IBrowseParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import useBrowseResults from '../../hooks/useBrowseResults';
import { useCioPlpContext } from '../../PlpContext';
import { IncludeRenderProps, PlpBrowseResponse } from '../../types';
import ProductCard from '../ProductCard';
import './BrowseResults.css';

/**
 * Props for the BrowseResults component.
 */
interface BrowseResultsProps {
  filterName: string;
  filterValue: string;
  // Browse parameters configuring the browse request.
  browseParams?: IBrowseParameters;
}

/**
 * Type alias for BrowseResultsProps with RenderProps.
 */
type BrowseResultsWithRenderProps = IncludeRenderProps<
  BrowseResultsProps,
  PlpBrowseResponse | null
>;

/**
 * Renders the browse results based on the provided query and browse parameters.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.filterName] - Browse Filter Name.
 * @param {string} [props.filterValue] - Browse Filter Value.
 * @param {BrowseParameters} [props.browseParams] - The browse parameters.
 * @returns {JSX.Element} The rendered browse results.
 * @throws {Error} Throws an error if the component is not rendered within CioPlpContext.
 */
export default function BrowseResults(props: BrowseResultsWithRenderProps) {
  const context = useCioPlpContext();

  if (!context) {
    throw new Error('<BrowseResults /> component must be rendered within CioPlpContext');
  }

  const { children, filterName, filterValue, browseParams } = props;
  const browseResponse = useBrowseResults(filterName, filterValue, {
    cioClient: context.cioClient,
    browseParams,
  });

  return (
    <>
      {typeof children === 'function' ? (
        children(browseResponse)
      ) : (
        <>
          <div>Browse Results</div>
          <div className='cio-results'>
            {browseResponse?.results.map((item) => <ProductCard item={item} />)}
          </div>
        </>
      )}
    </>
  );
}
