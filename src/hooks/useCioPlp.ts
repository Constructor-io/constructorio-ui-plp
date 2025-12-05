import { useEffect, useState } from 'react';
import { PlpContextValue, PlpFacet, PlpItemGroup, PlpSortOption } from '../types';
import { useCioPlpContext } from './useCioPlpContext';
import useSearchResults, { UseSearchResultsProps } from './useSearchResults';
import useFilter, { UseFilterProps } from './useFilter';
import useSort, { UseSortProps } from './useSort';
import usePagination, { UsePaginationProps } from './usePagination';
import {
  getPageType,
  checkIsBrowsePage,
  isPlpBrowseDataResults,
  isPlpSearchDataResults,
  checkIsSearchPage,
  getPlpContainerCnstrcDataAttributes,
} from '../utils';
import useBrowseResults, { UseBrowseResultsProps } from './useBrowseResults';
import useGroups from './useGroups';
import { GroupsProps } from '../components/Groups';
import useRequestConfigs from './useRequestConfigs';

export interface UseCioPlpHook extends PlpContextValue {}

export type UseCioPlpProps = UseSearchResultsProps &
  UseBrowseResultsProps & {
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
     * Configuration options for the Groups component.
     * - `initialNumOptions`: Number of group options to show initially (default: 5).
     *   Remaining options are hidden under "Show All" button.
     * - `isCollapsed`: Whether the groups section starts collapsed (default: false).
     * - `title`: Custom title for the groups section (default: "Categories").
     * - `hideGroups`: Whether to hide the groups component entirely (default: false).
     * - `isHiddenGroupFn`: Function to determine if a group should be hidden (default: undefined).
     */
    groupsConfigs?: Omit<GroupsProps, 'groups'>;
  };

export default function useCioPlp(props: UseCioPlpProps = {}) {
  const {
    initialSearchResponse,
    initialBrowseResponse,
    paginationConfigs = {},
    sortConfigs = {},
    filterConfigs = {},
    groupsConfigs = {},
  } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useCioPlp() must be used within a component that is a child of <CioPlp /> or <CioPlpProvider />',
    );
  }

  const { getRequestConfigs } = useRequestConfigs();
  const requestConfigs = getRequestConfigs();
  const isSearchPage = checkIsSearchPage(requestConfigs) || !!initialSearchResponse;
  const isBrowsePage = checkIsBrowsePage(requestConfigs) || !!initialBrowseResponse;

  const search = useSearchResults({ initialSearchResponse });
  const browse = useBrowseResults({ initialBrowseResponse });

  function coalesceResponse() {
    if (isSearchPage && isPlpSearchDataResults(search?.data)) {
      return search.data.response;
    }
    if (isBrowsePage && isPlpBrowseDataResults(browse?.data)) {
      return browse.data.response;
    }
    return null;
  }

  const [facets, setFacets] = useState<Array<PlpFacet>>(() => coalesceResponse()?.facets || []);
  const [sortOptions, setSortOptions] = useState<Array<PlpSortOption>>(
    () => coalesceResponse()?.sortOptions || [],
  );
  const [totalNumResults, setTotalNumResults] = useState(
    () => coalesceResponse()?.totalNumResults || 0,
  );
  const [rawGroups, setGroups] = useState<Array<PlpItemGroup>>(coalesceResponse()?.groups || []);

  const refetch = () => {
    const currentRequestConfigs = getRequestConfigs();
    const pageType = getPageType(currentRequestConfigs);

    switch (pageType) {
      case 'search':
        search.refetch();
        break;
      case 'browse':
        browse.refetch();
        break;
      default:
    }
  };

  useEffect(() => {
    if (isSearchPage && isPlpSearchDataResults(search.data)) {
      setFacets(search.data.response.facets);
      setSortOptions(search.data.response.sortOptions);
      setTotalNumResults(search.data.response.totalNumResults);
      setGroups(search.data.response.groups);
    } else if (isBrowsePage && isPlpBrowseDataResults(browse.data)) {
      setFacets(browse.data.response.facets);
      setSortOptions(browse.data.response.sortOptions);
      setTotalNumResults(browse.data.response.totalNumResults);
      setGroups(browse.data.response.groups);
    }
  }, [search.data, isSearchPage, browse.data, isBrowsePage]);

  const filters = useFilter({ facets, ...filterConfigs });
  const sort = useSort({ sortOptions, ...sortConfigs });
  const pagination = usePagination({ totalNumResults, ...paginationConfigs });
  const groups = useGroups({ groups: rawGroups, ...groupsConfigs });

  const data = isSearchPage ? search.data : browse.data;

  const plpContainerCnstrcDataAttributes = getPlpContainerCnstrcDataAttributes(
    data,
    requestConfigs,
  );

  return {
    isSearchPage,
    isBrowsePage,
    searchQuery: search.query,
    browseFilterName: browse.filterName,
    browseFilterValue: browse.filterValue,
    status: isSearchPage ? search.status : browse.status,
    data,
    refetch,
    filters,
    sort,
    pagination,
    groups,
    plpContainerCnstrcDataAttributes,
  };
}
