import React from 'react';
import classNames from 'classnames';
import { FilterOption, FilterOptionVisual } from '@constructor-io/constructorio-ui-components';
import useFilterOptionsList, { UseFilterOptionsListProps } from './UseFilterOptionsList';
import { resolveVisualOption } from '../../utils';

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
    isVisual,
    getVisualImageUrl,
    getVisualColorHex,
    checkboxPosition,
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
          const id = `${facet.name}-${option.value}`;
          const commonProps = {
            id,
            key: option.value,
            optionValue: option.value,
            displayValue: option.displayName,
            displayCountValue: option.count.toString(),
            isChecked: selectedOptionMap[option.value] || false,
            onChange: onOptionSelect,
            checkboxPosition,
          };

          if (isVisual) {
            const visual = resolveVisualOption(option, getVisualImageUrl, getVisualColorHex);
            if (visual) {
              return (
                <FilterOptionVisual
                  {...commonProps}
                  visualType={visual.type}
                  visualValue={visual.value}
                />
              );
            }
          }

          return <FilterOption {...commonProps} />;
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
