import React, { useState } from 'react';
import { IncludeRenderProps, PlpSearchRedirectResponse, PlpSearchResponse } from '../../types';
import ProductCard from '../ProductCard';
import Filters from '../Filters';
import FiltersIcon from '../Filters/FiltersIcon';
import Sort from '../Sort/Sort';
import MobileModal from '../MobileModal/MobileModal';
import Pagination from '../Pagination';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import ZeroResults from './ZeroResults/ZeroResults';
import Spinner from '../Spinner/Spinner';
import { RequestStatus } from './reducer';

type CioPlpGridProps = {
  initialResponse?: PlpSearchResponse | PlpSearchRedirectResponse;
  spinner?: React.ReactNode;
};
type CioPlpGridWithRenderProps = IncludeRenderProps<CioPlpGridProps, UseSearchResultsReturn>;

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const { spinner, initialResponse, children } = props;

  const { data, status, refetch } = useSearchResults({ initialSearchResponse: initialResponse });
  const response = data?.response as unknown as PlpSearchResponse;
  const searchTerm = data.request?.term;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                    <Filters response={response} />
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
                      <Sort searchOrBrowseResponse={response} isOpen={false} />
                    </div>
                    <div className='cio-product-tiles-container'>
                      <MobileModal isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}>
                        <Filters response={response} />
                      </MobileModal>
                      {response?.results?.map((item) => (
                        <div className='cio-product-tile'>
                          <ProductCard key={item.itemId} item={item} />
                        </div>
                      ))}
                    </div>
                    <div className='cio-pagination-container'>
                      <Pagination totalNumResults={response?.totalNumResults} />
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
