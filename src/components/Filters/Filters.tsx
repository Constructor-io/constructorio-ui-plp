/* eslint-disable react/no-array-index-key */
import React from 'react';
import { IncludeRenderProps, PlpFacetOption } from '../../types';
import FilterGroup from './FilterGroup';
import useFilter, { UseFilterProps, UseFilterReturn } from '../../hooks/useFilter';

export type FiltersProps = UseFilterProps & {
  /**
   * The number of options to render for non-ranged facets.
   * The remaining options will be hidden under a "Show All" button
   */
  initialNumOptions?: number;
  /**
   * Function that takes in a PlpFacetOption and returns `true` if the option should be hidden from the final render
   * @returns boolean
   */
  isHiddenFacetOptionFn?: (option: PlpFacetOption) => boolean;
};
export type FiltersWithRenderProps = IncludeRenderProps<FiltersProps, UseFilterReturn>;

export default function Filters(props: FiltersWithRenderProps) {
  const { children, initialNumOptions, isHiddenFacetOptionFn, ...useFiltersProps } = props;
  const { facets, setFilter, sliderStep, facetSliderSteps, clearFilters } =
    useFilter(useFiltersProps);

  return (
    <>
      {typeof children === 'function' ? (
        children({
          facets,
          setFilter,
          sliderStep,
          facetSliderSteps,
          clearFilters,
        })
      ) : (
        <div className='cio-filters'>
          {facets.map((facet) => (
            <FilterGroup
              facet={facet}
              initialNumOptions={initialNumOptions}
              setFilter={setFilter}
              sliderStep={sliderStep}
              facetSliderSteps={facetSliderSteps}
              isHiddenFacetOptionFn={isHiddenFacetOptionFn}
              key={facet.name}
            />
          ))}
        </div>
      )}
    </>
  );
}
