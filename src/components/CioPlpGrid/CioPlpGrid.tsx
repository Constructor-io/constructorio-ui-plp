import React, { useState } from 'react';
import {
  GetBrowseResultsResponse,
  SearchResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
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
import useCioPlp from '../../hooks/useCioPlp';
import Breadcrumbs from '../Breadcrumbs';

export type CioPlpGridProps = {
  initialSearchResponse?: SearchResponse;
  initialBrowseResponse?: GetBrowseResultsResponse;
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
   * Configuration options for the Filters component.
   * - `sliderStep`: Global slider step for all range facets.
   * - `facetSliderSteps`: Per-facet slider step configuration.
   * - `renderCollapsed`: When true, all filter groups render collapsed by default.
   * - `collapsedFacets`: List of facet names (or comma-separated string) to render collapsed.
   */
  filterConfigs?: Omit<UseFilterProps, 'facets'>;
  /**
   * Configuration options for the Groups component.
   * - `initialNumOptions`: Number of group options to show initially (default: 5).
   *   Remaining options are hidden under "Show All" button.
   * - `isCollapsed`: Whether the groups section starts collapsed (default: false).
   * - `title`: Custom title for the groups section (default: "Categories").
   * - `hideGroups`: Whether to hide the groups component entirely (default: false).
   */
  groupsConfigs?: Omit<GroupsProps, 'groups'>;
};

export type CioPlpGridWithRenderProps = IncludeRenderProps<
  CioPlpGridProps,
  ReturnType<typeof useCioPlp>
>;

/**
 * When filterConfigs.renderCollapsed is set and groupsConfigs.isCollapsed is not explicitly set,
 * apply the global collapse setting to the Groups filter as well.
 */
function resolveGroupsConfigs(
  filterConfigs?: Omit<UseFilterProps, 'facets'>,
  groupsConfigs?: Omit<GroupsProps, 'groups'>,
): Omit<GroupsProps, 'groups'> | undefined {
  if (filterConfigs?.renderCollapsed !== undefined && groupsConfigs?.isCollapsed === undefined) {
    return { ...groupsConfigs, isCollapsed: filterConfigs.renderCollapsed };
  }
  return groupsConfigs;
}

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const {
    spinner,
    initialSearchResponse,
    initialBrowseResponse,
    filterConfigs,
    sortConfigs,
    paginationConfigs,
    groupsConfigs,
    children,
  } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const resolvedGroupsConfigs = resolveGroupsConfigs(filterConfigs, groupsConfigs);

  const plpData = useCioPlp({
    initialSearchResponse,
    initialBrowseResponse,
  });

  const {
    isSearchPage,
    isBrowsePage,
    searchQuery,
    browseFilterValue,
    data,
    status,
    filters,
    sort,
    plpContainerCnstrcDataAttributes,
  } = plpData;

  const {
    callbacks: { onRedirect = (redirectUrl) => window.location.replace(redirectUrl) },
  } = useCioPlpContext();

  if (isPlpSearchDataRedirect(data)) {
    const redirectUrl = data.redirect.data.url;

    if (onRedirect) {
      onRedirect(redirectUrl);
    }

    return null;
  }

  if (!isSearchPage && !isBrowsePage) {
    // Render Zero results page in the case where no query is provided
    // TODO: Allow customers to override default page
    return <ZeroResults />;
  }

  let renderHeader;

  if (isSearchPage) {
    renderHeader = (
      <span className='cio-products-header-title'>
        <b>{data?.response?.totalNumResults}</b> results
        {searchQuery && (
          <>
            &nbsp;for <b>&quot;{searchQuery}&quot;</b>
          </>
        )}
      </span>
    );
  } else if (isBrowsePage && data?.request.browse_filter_name === 'group_id') {
    renderHeader = (
      <Breadcrumbs groups={data?.response.groups || []} filterValue={browseFilterValue || ''} />
    );
  }

  return (
    <>
      {typeof children === 'function' ? (
        children(plpData)
      ) : (
        <>
          {status === RequestStatus.FETCHING && (spinner || <Spinner />)}
          {status !== RequestStatus.FETCHING && data && (
            <>
              {data.response?.results?.length ? (
                <div className='cio-plp-grid'>
                  <div className='cio-filters-container cio-large-screen-only'>
                    {isSearchPage && (
                      <Groups groups={data.response.groups} {...resolvedGroupsConfigs} />
                    )}
                    <Filters facets={filters.facets} {...filterConfigs} />
                  </div>
                  <div className='cio-products-container' {...plpContainerCnstrcDataAttributes}>
                    <div className='cio-products-header-container'>
                      <div className='cio-mobile-products-header-wrapper cio-mobile-only'>
                        {renderHeader}
                      </div>
                      <div className='cio-products-header-wrapper'>
                        <button
                          type='button'
                          className='cio-filters-modal-button cio-mobile-only'
                          onClick={() => setIsFilterOpen(!isFilterOpen)}>
                          {FiltersIcon}
                          Filters
                        </button>
                        <span className='cio-large-screen-only'>{renderHeader}</span>
                        <Sort sortOptions={sort.sortOptions} isOpen={false} {...sortConfigs} />
                      </div>
                    </div>

                    <div className='cio-product-tiles-container'>
                      <MobileModal isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}>
                        {isSearchPage && (
                          <Groups groups={data.response.groups} {...resolvedGroupsConfigs} />
                        )}
                        <Filters facets={filters.facets} {...filterConfigs} />
                      </MobileModal>

                      {data.response?.results?.map((item) => (
                        <div className='cio-product-tile' key={item.itemId}>
                          <ProductCard key={item.itemId} item={item} />
                        </div>
                      ))}
                    </div>

                    <div className='cio-pagination-container'>
                      <Pagination
                        totalNumResults={data.response.totalNumResults}
                        resultsPerPage={data.response.numResultsPerPage}
                        {...paginationConfigs}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div {...plpContainerCnstrcDataAttributes}>
                  <ZeroResults />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
