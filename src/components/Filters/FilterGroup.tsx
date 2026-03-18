import React, { useState } from 'react';
import type { PlpFacet, PlpFacetOption, FilterConfig } from '../../types';
import { isMultipleOrBucketedFacet, isRangeFacet, isSingleFacet, shouldRenderVisualFacet } from '../../utils';
import FilterOptionsList from './FilterOptionsList';
import FilterRangeSlider from './FilterRangeSlider';
import { UseFilterReturn } from '../../hooks/useFilter';

export interface FilterGroupProps {
  facet: PlpFacet;
  setFilter: UseFilterReturn['setFilter'];
  initialNumOptions?: number;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
  /**
   * Function that takes in a PlpFacetOption and returns `true` if the option should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterOptionFn?: (option: PlpFacetOption) => boolean;
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined;
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined;
  isVisualFilterFn?: (facet: PlpFacet) => boolean;
  filterConfigs?: Record<string, FilterConfig>;
}

export default function FilterGroup(props: FilterGroupProps) {
  const {
    facet,
    setFilter,
    initialNumOptions = 10,
    sliderStep,
    facetSliderSteps,
    isHiddenFilterOptionFn,
    getVisualImageUrl,
    getVisualColorHex,
    isVisualFilterFn,
    filterConfigs,
  } = props;
  const isVisual = shouldRenderVisualFacet(facet, filterConfigs, isVisualFilterFn);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleIsCollapsed = () => setIsCollapsed(!isCollapsed);
  const onFilterSelect = (facetName: string) => (value: any) => {
    setFilter(facetName, value);
  };

  return (
    <li className='cio-filter-group'>
      <button className='cio-filter-header' type='button' onClick={toggleIsCollapsed}>
        {facet.displayName}
        <i className={`cio-arrow ${isCollapsed ? 'cio-arrow-up' : 'cio-arrow-down'}`} />
      </button>

      {(isMultipleOrBucketedFacet(facet) || isSingleFacet(facet)) && (
        <FilterOptionsList
          isCollapsed={isCollapsed}
          facet={facet}
          modifyRequestMultipleFilter={onFilterSelect(facet.name)}
          initialNumOptions={initialNumOptions}
          isHiddenFilterOptionFn={isHiddenFilterOptionFn}
          isVisual={isVisual}
          getVisualImageUrl={getVisualImageUrl}
          getVisualColorHex={getVisualColorHex}
        />
      )}

      {isRangeFacet(facet) && (
        <FilterRangeSlider
          isCollapsed={isCollapsed}
          rangedFacet={facet}
          modifyRequestRangeFilter={onFilterSelect(facet.name)}
          sliderStep={facetSliderSteps?.[facet.name] || sliderStep}
        />
      )}
    </li>
  );
}
