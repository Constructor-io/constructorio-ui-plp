import { useCallback, useMemo } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpFacet, PlpFilterValue } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
  clearFilters: () => void;
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
  /**
   * Function that takes in a PlpFacet and returns `true` if the facet should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterFn?: (facet: PlpFacet) => boolean;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { facets, sliderStep, facetSliderSteps, isHiddenFilterFn } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const { getIsHiddenFilterField } = contextValue.itemFieldGetters;
  const { getRequestConfigs, setRequestConfigs } = useRequestConfigs();

  const isHiddenFilter = useCallback(
    (facet: PlpFacet) =>
      (typeof isHiddenFilterFn === 'function' && isHiddenFilterFn(facet)) ||
      (typeof getIsHiddenFilterField === 'function' && getIsHiddenFilterField(facet)) ||
      false,
    [isHiddenFilterFn, getIsHiddenFilterField],
  );

  const filteredFacets = useMemo(
    () => facets.filter((facet) => !isHiddenFilter(facet)),
    [facets, isHiddenFilter],
  );

  const setFilter = (filterName: string, filterValue: PlpFilterValue) => {
    const newFilters = getRequestConfigs().filters || {};

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
    facets: filteredFacets,
    setFilter,
    sliderStep,
    facetSliderSteps,
    clearFilters,
  };
}
