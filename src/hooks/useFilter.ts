import { useCioPlpContext } from './useCioPlpContext';
import { PlpFacet, PlpFilterValue } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
}

export interface UseFilterProps {
  /**
   * Used to build and render filters dynamically
   */
  facets: Array<PlpFacet>;
  /**
   * Global slider step for all range facets
   */
  sliderStep?: number;
  /**
   * Per-facet slider step configuration
   */
  facetSliderSteps?: Record<string, number>;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { facets, sliderStep, facetSliderSteps } = props;
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

  return {
    facets,
    setFilter,
    sliderStep,
    facetSliderSteps,
  };
}
