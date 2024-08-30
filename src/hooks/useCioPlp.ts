import { useEffect, useState } from 'react';
import { PlpContextValue, PlpFacet, PlpSortOption } from '../types';
import { useCioPlpContext } from './useCioPlpContext';
import useSearchResults, { UseSearchResultsProps } from './useSearchResults';
import useFilter, { UseFilterProps } from './useFilter';
import useSort, { UseSortProps } from './useSort';
import usePagination, { UsePaginationProps } from './usePagination';
import { isPlpSearchDataResults } from '../utils';

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
}

export default function useCioPlp(props: UseCioPlpProps = {}) {
  const {
    initialSearchResponse,
    paginationConfigs = {},
    sortConfigs = {},
    filterConfigs = {},
  } = props;
  const contextValue = useCioPlpContext();
  const [facets, setFacets] = useState<Array<PlpFacet>>([]);
  const [sortOptions, setSortOptions] = useState<Array<PlpSortOption>>([]);
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
    }
  }, [searchData]);

  const filters = useFilter({ facets, ...filterConfigs });
  const sort = useSort({ sortOptions, ...sortConfigs });
  const pagination = usePagination({ totalNumResults, ...paginationConfigs });

  return {
    searchData,
    refetch,
    filters,
    sort,
    pagination,
  };
}
