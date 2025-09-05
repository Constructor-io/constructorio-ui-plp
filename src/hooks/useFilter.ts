import { useCioPlpContext } from './useCioPlpContext';
import { PlpFacet, PlpFilterValue } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
  clearFilters: () => void;
}

export interface UseFilterProps {
  /**
   * Used to build and render filters dynamically
   */
  facets: Array<PlpFacet>;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { facets } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const { getRequestConfigs, setRequestConfigs } = useRequestConfigs();
  const { filters: requestFilters } = getRequestConfigs();

  const setFilter = (filterName: string, filterValue: PlpFilterValue) => {
    const newFilters = requestFilters || {};

    newFilters[filterName] = filterValue;

    // Remove filter entirely
    if (filterValue === null) {
      delete newFilters[filterName];
    }
    setRequestConfigs({ filters: newFilters, page: 1 });
  };

  const clearFilters = () => {
    setRequestConfigs({ filters: {}, page: 1 });
  };

  return {
    facets,
    setFilter,
    clearFilters,
  };
}
