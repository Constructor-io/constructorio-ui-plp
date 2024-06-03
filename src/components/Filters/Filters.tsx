/* eslint-disable react/no-array-index-key */
import React from 'react';
import { IncludeRenderProps } from '../../types';
import FilterGroup from './FilterGroup';
import useFilter, { UseFilterProps, UseFilterReturn } from '../../hooks/useFilter';

export type FiltersProps = UseFilterProps & {
  /**
   * The number of options to render for non-ranged facets.
   * The remaining options will be hidden under a "Show All" button
   */
  initialNumOptions?: number;
};
type FiltersWithRenderProps = IncludeRenderProps<FiltersProps, UseFilterReturn>;

export default function Filters(props: FiltersWithRenderProps) {
  const { children, initialNumOptions, ...useFiltersProps } = props;
  const { facets, setFilter } = useFilter(useFiltersProps);

  return (
    <>
      {typeof children === 'function' ? (
        children({
          facets,
          setFilter,
        })
      ) : (
        <div className='cio-filters'>
          {facets.map((facet) => (
            <FilterGroup
              facet={facet}
              initialNumOptions={initialNumOptions}
              setFilter={setFilter}
              key={facet.name}
            />
          ))}
        </div>
      )}
    </>
  );
}
