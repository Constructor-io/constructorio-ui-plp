import React, { useState } from 'react';
import useSort, { UseSortProps } from '../../hooks/useSort';
import { IncludeRenderProps, UseSortReturn } from '../../types';
import MobileModal from '../MobileModal';

export type SortProps = UseSortProps & {
  /**
   * Default open state of dropdown
   */
  isOpen?: boolean;
};
export type SortWithRenderProps = IncludeRenderProps<SortProps, UseSortReturn>;

export default function Sort({
  isOpen: defaultOpen = true,
  sortOptions: sortOptionsFromProps,
  children,
}: SortWithRenderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { sortOptions, selectedSort, changeSelectedSort } = useSort({
    sortOptions: sortOptionsFromProps,
  });

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeSelectedSort(JSON.parse(event.target.value));
  };

  const defaultMarkup = sortOptions.map((option) => (
    <label
      htmlFor={`${option.sortBy}-${option.sortOrder}`}
      key={`${option.sortBy}-${option.sortOrder}`}>
      <input
        id={`${option.sortBy}-${option.sortOrder}`}
        type='radio'
        name={`${option.sortBy}-${option.sortOrder}`}
        value={JSON.stringify(option)}
        checked={
          selectedSort?.sortBy === option.sortBy && selectedSort.sortOrder === option.sortOrder
        }
        onChange={handleOptionChange}
      />
      <span>{option.displayName}</span>
    </label>
  ));

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
            {selectedSort?.displayName ? (
              <span className='cio-plp-sort-button-label'>
                <span className='cio-large-screen-only'>Sort by:</span>
                <span className='cio-mobile-only'>By</span> {selectedSort.displayName}
              </span>
            ) : (
              'Sort'
            )}
            <i className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`} />
          </button>
          <MobileModal side='right' isOpen={isOpen} setIsOpen={setIsOpen}>
            {defaultMarkup}
          </MobileModal>
          {isOpen && (
            <div className='collapsible-content cio-large-screen-only'>{defaultMarkup}</div>
          )}
        </div>
      )}
    </>
  );
}

Sort.defaultProps = {
  isOpen: true,
};
