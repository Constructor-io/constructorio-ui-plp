import React, { useState } from 'react';
import type { PlpFacet } from '../../types';
import { isMultipleOrBucketedFacet, isRangeFacet } from '../../utils';
import FilterOptionsList from './FilterOptionsList';
import FilterRangeSlider from './FilterRangeSlider';
// import { UseFilterReturn } from '../../hooks/useFilter';
// Mock
type UseFilterReturn = { setFilter: (facetName: string, facetValue: any) => void };

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
    <li className='filter-group'>
      <h3 className='cio-filter-header'>
        <button onClick={toggleIsCollapsed} type='button'>
          <span>{isCollapsed ? '>' : '='}</span>
          &nbsp;
          <span>{facet.displayName}</span>
        </button>
      </h3>

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
