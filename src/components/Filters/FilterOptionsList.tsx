import React from 'react';
import classNames from 'classnames';
import useFilterOptionsList, { UseFilterOptionsListProps } from './UseFilterOptionsList';

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
        {optionsToRender.map((option) => (
          <li className='cio-filter-multiple-option' key={option.value}>
            <label htmlFor={option.value}>
              <input
                type='checkbox'
                id={option.value}
                value={option.displayName}
                checked={selectedOptionMap[option.value] || false}
                onChange={() => onOptionSelect(option.value)}
              />
              <div className='cio-checkbox'>
                <svg
                  width='10'
                  height='8'
                  viewBox='0 0 10 8'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='cio-check'>
                  <path
                    d='M1 4L3.5 6.5L9 1'
                    stroke='white'
                    strokeWidth='1.7'
                    strokeLinecap='round'
                  />
                </svg>
              </div>
              <div className='cio-filter-multiple-option-display'>
                <span className='cio-filter-option-name'>{option.displayName}</span>
                <span className='cio-filter-option-count'>{option.count}</span>
              </div>
            </label>
          </li>
        ))}

        {initialNumOptions < facet.options.length && (
          <button type='button' className='cio-see-all' onClick={() => setIsShowAll(!isShowAll)}>
            {isShowAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </ul>
    </div>
  );
}
