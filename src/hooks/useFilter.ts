import { useCioPlpContext } from './useCioPlpContext';
import { PlpBrowseResponse, PlpFacet, PlpSearchResponse } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  applyFilter: (facetName: string, facetValue: any) => void;
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

  const applyFilter = (facetGroupName: string, facetValue: any) => {
    const newFilters = requestFilters || {};

    newFilters[facetGroupName] = facetValue;

    // Remove filter entirely
    if (facetValue === null) {
      delete newFilters[facetGroupName];
    }
    setRequestConfigs({ filters: newFilters });
  };

  return {
    facets,
    applyFilter,
  };
}
