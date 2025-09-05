import React from 'react';
import classNames from 'classnames';
import useFilterOptionsList, { UseFilterOptionsListProps } from './UseFilterOptionsList';
import FilterOptionListRow from './FilterOptionListRow';

export default function FilterOptionsList(props: UseFilterOptionsListProps) {
  const {
    facet,
    initialNumOptions,
    isCollapsed,
    isShowAll,
    setIsShowAll,
    optionsToRender,
    selectedOptionMap,
    onOptionSelect,
  } = useFilterOptionsList(props);

  if (optionsToRender.length === 0) return null;
  return (
    <div
      className={classNames({
        'cio-collapsible-wrapper': true,
        'cio-collapsible-is-open': !isCollapsed,
      })}>
      <ul className='cio-filter-multiple-options-list cio-collapsible-inner'>
        {optionsToRender.map((option) => {
          const compositeId = `${facet.name}:${option.value}`;
          return (
            <FilterOptionListRow
              id={compositeId}
              displayValue={option.displayName}
              displayCountValue={option.count.toString()}
              isChecked={selectedOptionMap[compositeId] || false}
              onChange={() => onOptionSelect(compositeId)}
            />
          );
        })}

        {initialNumOptions < facet.options.length && (
          <button type='button' className='cio-see-all' onClick={() => setIsShowAll(!isShowAll)}>
            {isShowAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </ul>
    </div>
  );
}
