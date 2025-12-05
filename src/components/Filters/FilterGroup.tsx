import React, { useState } from 'react';
import type { PlpFacet } from '../../types';
import { isMultipleOrBucketedFacet, isRangeFacet } from '../../utils';
import FilterOptionsList from './FilterOptionsList';
import FilterRangeSlider from './FilterRangeSlider';
import { UseFilterReturn } from '../../hooks/useFilter';

export interface FilterGroupProps {
  facet: PlpFacet;
  setFilter: UseFilterReturn['setFilter'];
  initialNumOptions?: number;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
}

export default function FilterGroup(props: FilterGroupProps) {
  const { facet, setFilter, initialNumOptions = 10, sliderStep, facetSliderSteps } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleIsCollapsed = () => setIsCollapsed(!isCollapsed);
  const onFilterSelect = (facetName: string) => (value: any) => {
    setFilter(facetName, value);
  };

  // Hide range filters when there's only a single value (no actual range to select)
  const isSingleValueRange = isRangeFacet(facet) && facet.min === facet.max;

  return (
    <li className={`cio-filter-group ${isSingleValueRange ? 'is-hidden' : ''}`}>
      <button className='cio-filter-header' type='button' onClick={toggleIsCollapsed}>
        {facet.displayName}
        <i className={`cio-arrow ${isCollapsed ? 'cio-arrow-up' : 'cio-arrow-down'}`} />
      </button>

      {isMultipleOrBucketedFacet(facet) && (
        <FilterOptionsList
          isCollapsed={isCollapsed}
          multipleFacet={facet}
          modifyRequestMultipleFilter={onFilterSelect(facet.name)}
          initialNumOptions={initialNumOptions}
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
