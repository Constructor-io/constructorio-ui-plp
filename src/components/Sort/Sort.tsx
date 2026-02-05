import React, { useCallback, useState } from 'react';
import useSort, { UseSortProps } from '../../hooks/useSort';
import { IncludeRenderProps, PlpSortOption, UseSortReturn } from '../../types';
import MobileModal from '../MobileModal';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { translate } from '../../utils/helpers';

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
  const { translations } = useCioPlpContext();

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  const isChecked = useCallback(
    (option: PlpSortOption) =>
      selectedSort?.sortBy === option.sortBy && selectedSort?.sortOrder === option.sortOrder,
    [selectedSort],
  );

  const getOptionId = (option: PlpSortOption, idSuffix: string = '') =>
    `${option.sortBy}-${option.sortOrder}${idSuffix}`;

  const genDefaultMarkup = useCallback(
    (idSuffix: string = '') => {
      const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeSelectedSort(JSON.parse(event.target.value));
      };

      return sortOptions.map((option) => (
        <label
          htmlFor={getOptionId(option, idSuffix)}
          key={`${getOptionId(option, idSuffix)}${isChecked(option) ? '-checked' : ''}`}>
          <input
            id={getOptionId(option, idSuffix)}
            type='radio'
            name={getOptionId(option, idSuffix)}
            value={JSON.stringify(option)}
            checked={isChecked(option)}
            onChange={handleOptionChange}
          />
          <span>{option.displayName}</span>
        </label>
      ));
    },
    [changeSelectedSort, isChecked, sortOptions],
  );

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
                <span className='cio-large-screen-only'>{translate('Sort by:', translations)}</span>
                <span className='cio-mobile-only'>{translate('By', translations)}</span>{' '}
                {selectedSort.displayName}
              </span>
            ) : (
              translate('Sort', translations)
            )}
            <i className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`} />
          </button>
          <MobileModal side='right' isOpen={isOpen} setIsOpen={setIsOpen}>
            {genDefaultMarkup('-mobile')}
          </MobileModal>
          {isOpen && (
            <div className='collapsible-content cio-large-screen-only'>{genDefaultMarkup()}</div>
          )}
        </div>
      )}
    </>
  );
}

Sort.defaultProps = {
  isOpen: true,
};
