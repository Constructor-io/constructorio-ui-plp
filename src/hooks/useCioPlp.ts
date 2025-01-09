import { useEffect, useState } from 'react';
import { PlpContextValue, PlpFacet, PlpItemGroup, PlpSortOption } from '../types';
import { useCioPlpContext } from './useCioPlpContext';
import useSearchResults, { UseSearchResultsProps } from './useSearchResults';
import useFilter, { UseFilterProps } from './useFilter';
import useSort, { UseSortProps } from './useSort';
import usePagination, { UsePaginationProps } from './usePagination';
import { isPlpSearchDataResults } from '../utils';
import useGroups, { UseGroupProps } from './useGroups';

export interface UseCioPlpHook extends PlpContextValue {}

export interface UseCioPlpProps extends UseSearchResultsProps {
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
  groupsConfigs?: Omit<UseGroupProps, 'groups'>;
}

export default function useCioPlp(props: UseCioPlpProps = {}) {
  const {
    initialSearchResponse,
    paginationConfigs = {},
    sortConfigs = {},
    filterConfigs = {},
    groupsConfigs = {},
  } = props;
  const contextValue = useCioPlpContext();
  const [facets, setFacets] = useState<Array<PlpFacet>>([]);
  const [sortOptions, setSortOptions] = useState<Array<PlpSortOption>>([]);
  const [rawGroups, setGroups] = useState<Array<PlpItemGroup>>([]);
  const [totalNumResults, setTotalNumResults] = useState(0);

  if (!contextValue) {
    throw new Error(
      'useCioPlp() must be used within a component that is a child of <CioPlp /> or <CioPlpProvider />',
    );
  }

  // If Search
  const { data: searchData, refetch } = useSearchResults({ initialSearchResponse });

  useEffect(() => {
    if (isPlpSearchDataResults(searchData)) {
      setFacets(searchData.response.facets);
      setSortOptions(searchData.response.sortOptions);
      setTotalNumResults(searchData.response.totalNumResults);
      setGroups(searchData.response.groups);
    }
  }, [searchData]);

  const filters = useFilter({ facets, ...filterConfigs });
  const sort = useSort({ sortOptions, ...sortConfigs });
  const pagination = usePagination({ totalNumResults, ...paginationConfigs });
  const groups = useGroups({ groups: rawGroups, ...groupsConfigs });

  return {
    searchData,
    refetch,
    filters,
    sort,
    pagination,
    groups,
  };
}
