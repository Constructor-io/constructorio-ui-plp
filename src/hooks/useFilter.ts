import { useCioPlpContext } from './useCioPlpContext';
import { PlpBrowseResponse, PlpFacet, PlpFilterValue, PlpSearchResponse } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
}

export interface UseFilterProps {
  /**
   * Used to build and render filters dynamically
   */
  response: PlpBrowseResponse | PlpSearchResponse;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { response: searchOrBrowseResponse } = props;
  const { facets } = searchOrBrowseResponse;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const {
    requestConfigs: { filters: requestFilters },
    setRequestConfigs,
  } = useRequestConfigs();

  const setFilter = (filterName: string, filterValue: PlpFilterValue) => {
    const newFilters = requestFilters || {};

    newFilters[filterName] = filterValue;

    // Remove filter entirely
    if (filterValue === null) {
      delete newFilters[filterName];
    }
    setRequestConfigs({ filters: newFilters, page: 1 });
  };

  return {
    facets,
    setFilter,
  };
}
