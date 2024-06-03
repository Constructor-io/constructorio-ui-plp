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
}

export default function FilterGroup(props: FilterGroupProps) {
  const { facet, setFilter, initialNumOptions = 10 } = props;
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

      {isMultipleOrBucketedFacet(facet) && (
        <FilterOptionsList
          isCollapsed={isCollapsed}
          multipleFacet={facet}
          updateSelectedOptions={onFilterSelect(facet.name)}
          initialNumOptions={initialNumOptions}
        />
      )}

      {isRangeFacet(facet) && (
        <FilterRangeSlider
          isCollapsed={isCollapsed}
          rangedFacet={facet}
          updateFilterRange={onFilterSelect(facet.name)}
        />
      )}
    </li>
  );
}
