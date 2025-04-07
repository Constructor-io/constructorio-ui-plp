import React, { useCallback, useState } from 'react';
import useSort, { UseSortProps } from '../../hooks/useSort';
import { IncludeRenderProps, PlpSortOption, UseSortReturn } from '../../types';
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

  const isChecked = useCallback(
    (option: PlpSortOption) =>
      selectedSort?.sortBy === option.sortBy && selectedSort?.sortOrder === option.sortOrder,
    [selectedSort],
  );

  const getOptionId = (option: PlpSortOption) => `${option.sortBy}-${option.sortOrder}`;

  const defaultMarkup = sortOptions.map((option) => (
    <label
      htmlFor={getOptionId(option)}
      key={`${getOptionId(option)}${isChecked(option) ? '-checked' : ''}`}>
      <input
        id={getOptionId(option)}
        type='radio'
        name={getOptionId(option)}
        value={JSON.stringify(option)}
        checked={isChecked(option)}
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
