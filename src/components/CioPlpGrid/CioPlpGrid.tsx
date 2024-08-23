import React, { useState } from 'react';
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import ProductCard from '../ProductCard';
import Filters from '../Filters';
import FiltersIcon from '../Filters/FiltersIcon';
import MobileModal from '../MobileModal/MobileModal';
import Sort from '../Sort';
import Pagination from '../Pagination';
import ZeroResults from './ZeroResults/ZeroResults';
import Spinner from '../Spinner';
import { RequestStatus } from './reducer';
import { IncludeRenderProps } from '../../types';
import { isPlpSearchDataRedirect } from '../../utils';

export type CioPlpGridProps = {
  initialResponse?: SearchResponse;
  spinner?: React.ReactNode;
};
export type CioPlpGridWithRenderProps = IncludeRenderProps<CioPlpGridProps, UseSearchResultsReturn>;

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const { spinner, initialResponse, children } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, status, refetch } = useSearchResults({ initialSearchResponse: initialResponse });

  if (isPlpSearchDataRedirect(data)) {
    // Do redirect
    return null;
  }

  const response = data?.response;
  const searchTerm = data?.request?.term;

  const renderTitle = (
    <span className='cio-products-header-title'>
      <b>{response?.totalNumResults}</b> results
      {searchTerm && (
        <>
          {' '}
          for <b>&quot;{searchTerm}&quot;</b>
        </>
      )}
    </span>
  );

  return (
    <>
      {typeof children === 'function' ? (
        children({
          data,
          status,
          refetch,
        })
      ) : (
        <>
          {status === RequestStatus.FETCHING && (spinner || <Spinner />)}
          {status !== RequestStatus.FETCHING && status !== RequestStatus.STALE && (
            <>
              {response?.results?.length ? (
                <div className='cio-plp-grid'>
                  <div className='cio-filters-container'>
                    <Filters facets={response.facets} />
                  </div>
                  <div className='cio-products-container'>
                    <div className='cio-mobile-products-header-container'>{renderTitle}</div>
                    <div className='cio-products-header-container'>
                      <button
                        type='button'
                        className='cio-filters-modal-button'
                        onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        {FiltersIcon}
                        Filters
                      </button>
                      {renderTitle}
                      <Sort sortOptions={response.sortOptions} isOpen={false} />
                    </div>
                    <div className='cio-product-tiles-container'>
                      <MobileModal isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}>
                        <Filters facets={response.facets} />
                      </MobileModal>
                      {response?.results?.map((item) => (
                        <div className='cio-product-tile'>
                          <ProductCard key={item.itemId} item={item} />
                        </div>
                      ))}
                    </div>
                    <div className='cio-pagination-container'>
                      <Pagination
                        totalNumResults={response.totalNumResults}
                        resultsPerPage={response.numResultsPerPage}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ZeroResults />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
