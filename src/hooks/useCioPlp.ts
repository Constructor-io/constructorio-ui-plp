import { useEffect, useState } from 'react';
import { PlpContextValue, PlpFacet, PlpSortOption, UsePaginationProps } from '../types';
import { useCioPlpContext } from './useCioPlpContext';
import useSearchResults, { UseSearchResultsProps } from './useSearchResults';
import useFilter, { UseFilterProps } from './useFilter';
import useSort, { UseSortProps } from './useSort';
import { usePagination } from '../components/Pagination';
import { isPlpSearchDataResults } from '../utils';

export interface UseCioPlpHook extends PlpContextValue {}

export interface UseCioPlpProps extends UseSearchResultsProps {
  paginationConfigs?: Omit<UsePaginationProps, 'totalNumResults'>;
  sortConfigs?: Omit<UseSortProps, 'sortOptions'>;
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

  const data = searchData;
  useEffect(() => {
    if (isPlpSearchDataResults(data)) {
      setFacets(data.response.facets);
      setSortOptions(data.response.sortOptions);
      setTotalNumResults(data.response.totalNumResults);
    }
  }, [data]);

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
