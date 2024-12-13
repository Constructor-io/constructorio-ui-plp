import React, { useState } from 'react';
import { GetBrowseResultsResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import ProductCard from '../ProductCard';
import Filters from '../Filters';
import FiltersIcon from '../Filters/FiltersIcon';
import MobileModal from '../MobileModal';
import Sort from '../Sort';
import Pagination from '../Pagination';
import Spinner from '../Spinner';
import { RequestStatus } from './reducer';
import { IncludeRenderProps } from '../../types';
import { UsePaginationProps } from '../../hooks/usePagination';
import { UseSortProps } from '../../hooks/useSort';
import { UseFilterProps } from '../../hooks/useFilter';
import useBrowseResults, { UseBrowseResultsReturn } from '../../hooks/useBrowseResults';

export type CioPlpBrowseProps = {
  initialResponse?: GetBrowseResultsResponse;
  spinner?: React.ReactNode;
  /**
   * Used to set `windowSize` of `pages` array. Can also override `resultsPerPage` set at the Provider-level.
   */
  paginationConfigs?: Omit<UsePaginationProps, 'totalNumResults'>;
  /**
   * No configurations available yet.
   */
  sortConfigs?: Omit<UseSortProps, 'sortOptions'>;
  /**
   * No configurations available yet.
   */
  filterConfigs?: Omit<UseFilterProps, 'facets'>;
};
export type CioPlpBrowseWithRenderProps = IncludeRenderProps<
  CioPlpBrowseProps,
  UseBrowseResultsReturn
>;

export default function CioPlpGrid(props: CioPlpBrowseWithRenderProps) {
  const { spinner, initialResponse, filterConfigs, sortConfigs, paginationConfigs, children } =
    props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, status, refetch } = useBrowseResults({ initialBrowseResponse: initialResponse });

  const response = data?.response;
  const searchTerm = data?.request?.term;

  const renderTitle = (
    <span className='cio-products-header-title'>
      <b>{response?.totalNumResults}</b> results
      {searchTerm && (
        <>
          &nbsp;for <b>&quot;{searchTerm}&quot;</b>
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
                  <div className='cio-filters-container cio-large-screen-only'>
                    <Filters facets={response.facets} {...filterConfigs} />
                  </div>
                  <div className='cio-products-container'>
                    <div className='cio-products-header-container'>
                      <div className='cio-mobile-products-header-wrapper cio-mobile-only'>
                        {renderTitle}
                      </div>
                      <div className='cio-products-header-wrapper'>
                        <button
                          type='button'
                          className='cio-filters-modal-button cio-mobile-only'
                          onClick={() => setIsFilterOpen(!isFilterOpen)}>
                          {FiltersIcon}
                          Filters
                        </button>
                        <span className='cio-large-screen-only'>{renderTitle}</span>
                        <Sort sortOptions={response.sortOptions} isOpen={false} {...sortConfigs} />
                      </div>
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
                        {...paginationConfigs}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>No items :(</div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
