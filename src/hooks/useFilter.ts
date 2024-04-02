import { useCioPlpContext } from './useCioPlpContext';
import { PlpBrowseResponse, PlpFacet, PlpFacetValue, PlpSearchResponse } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  applyFilter: (facetName: string, facetValue: PlpFacetValue) => void;
}

export interface UseFilterProps {
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

  const applyFilter = (facetGroupName: string, facetValue: PlpFacetValue) => {
    const newFilters = requestFilters || {};

    newFilters[facetGroupName] = facetValue;
    setRequestConfigs({ filters: newFilters });
  };

  return {
    facets,
    applyFilter,
  };
}
