import React, { useState } from 'react';
import useSort from '../../hooks/useSort';
import {
  IncludeRenderProps,
  PlpBrowseResponse,
  PlpSearchResponse,
  UseSortReturn,
} from '../../types';

type SortProps = {
  /**
   * Default open state of dropdown
   */
  isOpen?: boolean;
  /**
   * Used to build and render sort options dynamically
   */
  searchOrBrowseResponse: PlpBrowseResponse | PlpSearchResponse;
};
type SortWithRenderProps = IncludeRenderProps<SortProps, UseSortReturn>;

export default function Sort({
  isOpen: defaultOpen = true,
  searchOrBrowseResponse,
  children,
}: SortWithRenderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { sortOptions, selectedSort, changeSelectedSort } = useSort(searchOrBrowseResponse);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeSelectedSort(JSON.parse(event.target.value));
  };

  return (
    <>
      {typeof children === 'function' ? (
        children({
          sortOptions,
          selectedSort,
          changeSelectedSort,
        })
      ) : (
        <div className='cio-plp-sort'>
          <button type='button' className='collapsible' onClick={toggleCollapsible}>
            Sort
            <i className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`} />
          </button>
          {isOpen && (
            <div className='collapsible-content'>
              {sortOptions.map((option) => (
                <label
                  htmlFor={`${option.sortBy}-${option.sortOrder}`}
                  key={`${option.sortBy}-${option.sortOrder}`}>
                  <input
                    id={`${option.sortBy}-${option.sortOrder}`}
                    type='radio'
                    name={`${option.sortBy}-${option.sortOrder}`}
                    value={JSON.stringify(option)}
                    checked={
                      selectedSort?.sortBy === option.sortBy &&
                      selectedSort.sortOrder === option.sortOrder
                    }
                    onChange={handleOptionChange}
                  />
                  <span>{option.displayName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

Sort.defaultProps = {
  isOpen: true,
};
