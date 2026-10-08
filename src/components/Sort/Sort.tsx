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
  /**
   * `id` of the sort options panel, referenced by the trigger's `aria-controls`.
   * Only needs overriding when rendering more than one `Sort` on a page.
   * @default 'cio-plp-sort-panel'
   */
  panelId?: string;
};
export type SortWithRenderProps = IncludeRenderProps<SortProps, UseSortReturn>;

export default function Sort({
  isOpen: defaultOpen = true,
  sortOptions: sortOptionsFromProps,
  panelId = 'cio-plp-sort-panel',
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

  // Each rendered option set (desktop + mobile) is its own radio group, so the two
  // instances don't compete over the same selection. Sharing one `name` within a group
  // is what makes the options arrow-navigable and mutually exclusive. (WCAG 4.1.2)
  const getGroupName = (idSuffix: string = '') => `cio-plp-sort${idSuffix}`;

  const genDefaultMarkup = useCallback(
    (idSuffix: string = '') => {
      const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeSelectedSort(JSON.parse(event.target.value));
      };

      return (
        <div role='radiogroup' aria-label={translate('Sort by:', translations)}>
          {sortOptions.map((option) => (
            // The key is deliberately independent of the checked state: a key that
            // changes on selection remounts the label and drops keyboard focus
            // mid-navigation. The inputs are controlled via `checked`.
            <label htmlFor={getOptionId(option, idSuffix)} key={getOptionId(option, idSuffix)}>
              <input
                id={getOptionId(option, idSuffix)}
                type='radio'
                name={getGroupName(idSuffix)}
                value={JSON.stringify(option)}
                checked={isChecked(option)}
                onChange={handleOptionChange}
              />
              <span>{option.displayName}</span>
            </label>
          ))}
        </div>
      );
    },
    [changeSelectedSort, isChecked, sortOptions, translations],
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
          <button
            type='button'
            className='collapsible'
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggleCollapsible}>
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
          <MobileModal
            side='right'
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            label={translate('Sort by:', translations)}>
            {genDefaultMarkup('-mobile')}
          </MobileModal>
          {isOpen && (
            <div id={panelId} className='collapsible-content cio-large-screen-only'>
              {genDefaultMarkup()}
            </div>
          )}
        </div>
      )}
    </>
  );
}

Sort.defaultProps = {
  isOpen: true,
  panelId: 'cio-plp-sort-panel',
};
