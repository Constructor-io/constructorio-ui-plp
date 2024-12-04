import React, { useState } from 'react';
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import ProductCard from '../ProductCard';
import Filters from '../Filters';
import Groups, { GroupsProps } from '../Groups';
import FiltersIcon from '../Filters/FiltersIcon';
import MobileModal from '../MobileModal';
import Sort from '../Sort';
import Pagination from '../Pagination';
import ZeroResults from './ZeroResults/ZeroResults';
import Spinner from '../Spinner';
import { RequestStatus } from './reducer';
import { IncludeRenderProps } from '../../types';
import { isPlpSearchDataRedirect } from '../../utils';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { UsePaginationProps } from '../../hooks/usePagination';
import { UseSortProps } from '../../hooks/useSort';
import { UseFilterProps } from '../../hooks/useFilter';
import { UseGroupProps } from '../../hooks/useGroups';

export type CioPlpGridProps = {
  initialResponse?: SearchResponse;
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
  /**
   * Used to set the `initialNumOptions` to limit the number of options shown initially.
   */
  groupsConfigs?: Omit<GroupsProps, 'groups'>;
};
export type CioPlpGridWithRenderProps = IncludeRenderProps<CioPlpGridProps, UseSearchResultsReturn>;

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const {
    spinner,
    initialResponse,
    filterConfigs,
    sortConfigs,
    paginationConfigs,
    groupsConfigs,
    children,
  } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, status, refetch } = useSearchResults({ initialSearchResponse: initialResponse });
  const {
    callbacks: { onRedirect = (redirectUrl) => window.location.replace(redirectUrl) },
  } = useCioPlpContext();

  if (isPlpSearchDataRedirect(data)) {
    const redirectUrl = data.redirect.redirect.data.url;

    if (onRedirect) {
      onRedirect(redirectUrl);
    }

    return null;
  }

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
                    <Groups groups={response.groups} {...groupsConfigs} />
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
                <ZeroResults />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
