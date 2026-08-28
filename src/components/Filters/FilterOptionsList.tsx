import React from 'react';
import classNames from 'classnames';
import { FilterOptionsList as UiFilterOptionsList } from '@constructor-io/constructorio-ui-components';
import useFilterOptionsList, { UseFilterOptionsListProps } from './UseFilterOptionsList';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { translate } from '../../utils/helpers';
import type { FilterOptionOverride } from '../../types';

export type FilterOptionsListProps = UseFilterOptionsListProps & {
  /**
   * Whether options that have nested options get a toggle collapsing their nested list.
   * Defaults to `true`.
   */
  hierarchyCollapsible?: boolean;
  /**
   * Whether nested option lists start collapsed rather than expanded. Initial state only - the
   * list owns expansion from then on. Defaults to `false`.
   */
  defaultHierarchyCollapsed?: boolean;
  /**
   * Overrides individual options rather than the list around them. Pass a function to target a
   * single option; see `FilterGroupOverrides['optionsList']['filterOption']`.
   */
  filterOptionOverride?: FilterOptionOverride;
};

export default function FilterOptionsList(props: FilterOptionsListProps) {
  const {
    hierarchyCollapsible = true,
    defaultHierarchyCollapsed = false,
    filterOptionOverride,
  } = props;
  const {
    initialNumOptions,
    isCollapsed,
    isShowAll,
    setIsShowAll,
    filterOptionData,
    totalFilteredOptions,
    onOptionSelect,
    checkboxPosition,
  } = useFilterOptionsList(props);
  const { translations } = useCioPlpContext();

  if (filterOptionData.length === 0) return null;

  return (
    <div
      className={classNames({
        'cio-collapsible-wrapper': true,
        'cio-collapsible-is-open': !isCollapsed,
      })}>
      <div className='cio-collapsible-inner'>
        <UiFilterOptionsList
          className='cio-filter-multiple-options-list'
          options={filterOptionData}
          onChange={onOptionSelect}
          checkboxPosition={checkboxPosition}
          collapsible={hierarchyCollapsible}
          defaultCollapsed={defaultHierarchyCollapsed}
          componentOverrides={
            filterOptionOverride ? { filterOption: filterOptionOverride } : undefined
          }
        />

        {initialNumOptions < totalFilteredOptions && (
          <button type='button' className='cio-see-all' onClick={() => setIsShowAll(!isShowAll)}>
            {isShowAll ? translate('Show Less', translations) : translate('Show All', translations)}
          </button>
        )}
      </div>
    </div>
  );
}
