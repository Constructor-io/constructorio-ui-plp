/* eslint-disable react/no-array-index-key */
import React from 'react';
import { IncludeRenderProps } from '../../types';
import FilterGroup from './FilterGroup';

// Mocking the Hooks implementation
import useFilter, { UseFilterProps, UseFilterReturn } from '../../hooks/useFilter';

export type FiltersProps = UseFilterProps & {
  initialNumOptions?: number;
};
type FiltersWithRenderProps = IncludeRenderProps<FiltersProps, UseFilterReturn>;

export default function Filters(props: FiltersWithRenderProps) {
  const { children, initialNumOptions, ...useFiltersProps } = props;
  const { facets, applyFilter } = useFilter(useFiltersProps);

  return (
    <>
      {typeof children === 'function' ? (
        children({
          facets,
          applyFilter,
        })
      ) : (
        <div className='cio-filters'>
          {facets.map((facet) => (
            <FilterGroup
              facet={facet}
              initialNumOptions={initialNumOptions}
              applyFilter={applyFilter}
              key={facet.name}
            />
          ))}
        </div>
      )}
    </>
  );
}
