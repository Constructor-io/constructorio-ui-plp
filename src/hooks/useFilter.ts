import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpBrowseResponse, PlpFacet, PlpFacetValue, PlpSearchResponse } from '../types';
import { transformFacetsResponse } from '../utils/transformers';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  returnedFacets: Array<PlpFacet>;
  applyFilter: (facetName: string, facetValue: PlpFacetValue) => void;
}

export interface UseFilterProps {
  searchOrBrowseResponse: PlpBrowseResponse | PlpSearchResponse;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { searchOrBrowseResponse } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const [returnedFacets, setReturnedFacets] = useState<Array<PlpFacet>>([]);

  const {
    requestConfigs: { filters: requestFilters },
    setRequestConfigs,
  } = useRequestConfigs();

  // Read filters applied from response and set state
  useEffect(() => {
    const responseFacets = transformFacetsResponse(searchOrBrowseResponse.facets);

    setReturnedFacets(responseFacets);
  }, [searchOrBrowseResponse]);

  const applyFilter = (facetGroupName: string, facetValue: PlpFacetValue) => {
    const newFilters = requestFilters || {};

    newFilters[facetGroupName] = facetValue;
    setRequestConfigs({ filters: newFilters });
  };

  return {
    returnedFacets,
    applyFilter,
  };
}
